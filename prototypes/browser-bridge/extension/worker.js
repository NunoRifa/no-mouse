import { createState, resetConnection, beginEnrollment, acceptEnrollment, cancelTab, invalidate, snapshot, wireTarget, validateSnapshot } from './state.mjs';

const state = createState();
const ports = new Map();
const requests = new Map();
const HOST = 'dev.nomouse.browser_bridge_probe';
const ORIGIN = 'https://www.youtube.com';
let nativePort = null;
let requestSequence = 0;
let lastRevision = -1;
const popupUrl = chrome.runtime.getURL('popup.html');
const changed = () => { chrome.runtime.sendMessage({ type: 'changed' }).catch(() => {}); };
function originOf(value) { try { return new URL(value).origin; } catch { return null; } }
function clearTargets() {
  for (const port of ports.values()) { try { port.disconnect(); } catch {} }
  ports.clear(); resetConnection(state, null, null); lastRevision = -1;
  for (const request of requests.values()) { clearTimeout(request.timer); request.reject(new Error('disconnected')); }
  requests.clear(); changed();
}
function disconnect() {
  const port = nativePort; nativePort = null;
  clearTargets(); if (port) { try { port.disconnect(); } catch {} }
}
function send(type, fields = {}) {
  if (!nativePort || requestSequence >= 4000) { disconnect(); return Promise.reject(new Error('disconnected')); }
  const requestId = `r${++requestSequence}`;
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => { requests.delete(requestId); reject(new Error('timeout')); disconnect(); }, 5000);
    requests.set(requestId, { resolve, reject, timer, type, expectedState: { connectionId: state.connectionId, epoch: state.epoch, targets: new Map(state.targets) } });
    try { nativePort.postMessage({ version: 1, type, requestId, ...fields }); }
    catch { disconnect(); }
  });
}
async function connect() {
  disconnect(); requestSequence = 0;
  const port = chrome.runtime.connectNative(HOST); nativePort = port;
  port.onDisconnect.addListener(() => { if (nativePort === port) { nativePort = null; clearTargets(); } });
  port.onMessage.addListener(message => {
    if (nativePort !== port) return;
    if (!message || message.version !== 1) return disconnect();
    const pending = requests.get(message.requestId);
    if (!pending) return disconnect();
    const isError = message.type === 'error' && typeof message.code === 'string' && /^[a-z_]{1,40}$/.test(message.code) && Object.keys(message).sort().join() === 'code,requestId,type,version';
    const isHello = pending.type === 'hello' && message.type === 'helloAck' && message.mode === 'read-only' && /^[a-f0-9]{32}$/.test(message.connectionId) && /^[a-f0-9]{32}$/.test(message.epoch) && Object.keys(message).sort().join() === 'connectionId,epoch,mode,requestId,type,version';
    const isSnapshot = pending.type !== 'hello' && validateSnapshot(pending.expectedState, message) && message.revision >= lastRevision;
    clearTimeout(pending.timer); requests.delete(message.requestId);
    if (isError) { pending.reject(new Error(message.code)); disconnect(); }
    else if (isHello || isSnapshot) { if (isSnapshot) lastRevision = message.revision; pending.resolve(message); }
    else { pending.reject(new Error('invalid_response')); disconnect(); }
  });
  const ack = await send('hello', { browser: 'chrome' });
  if (nativePort !== port) throw new Error('disconnected');
  resetConnection(state, ack.connectionId, ack.epoch); changed();
}
function remove(enrollmentId, reason) {
  const target = invalidate(state, enrollmentId);
  if (!target) return;
  const port = ports.get(enrollmentId); ports.delete(enrollmentId);
  if (port) { try { port.disconnect(); } catch {} }
  if (state.epoch) send('targetRemove', { epoch: state.epoch, enrollmentId, generation: target.generation, reason }).catch(() => disconnect());
  changed();
}
function invalidateTab(tabId, reason) {
  const target = [...state.targets.values()].find(t => t.tabId === tabId);
  state.pending.delete(tabId);
  if (target) remove(target.enrollmentId, reason);
}
async function enrollTab(tabId) {
  if (!state.epoch) throw new Error('not_ready');
  const ticket = beginEnrollment(state, tabId);
  let finish;
  ticket.injected = new Promise(resolve => { finish = resolve; });
  try {
    const tab = await chrome.tabs.get(tabId);
    if (tab.incognito || !tab.active || originOf(tab.url) !== ORIGIN || !(await chrome.permissions.contains({ origins: [ORIGIN + '/*'] }))) throw new Error('permission_required');
    if (state.pending.get(tabId)?.nonce !== ticket.nonce || state.epoch !== ticket.epoch) throw new Error('tab_changed');
    const results = await chrome.scripting.executeScript({ target: { tabId, frameIds: [0] }, files: ['content.js'], world: 'ISOLATED' });
    const documentId = results.find(result => result.frameId === 0)?.documentId;
    finish(documentId ?? null);
    if (!documentId) throw new Error('document_unavailable');
  } catch { finish(null); if (state.pending.get(tabId)?.nonce === ticket.nonce) state.pending.delete(tabId); throw new Error('injection_failed'); }
}
chrome.runtime.onConnect.addListener(port => {
  if (port.name !== 'nomouse-readonly-document') return port.disconnect();
  const sender = port.sender;
  const tabId = sender?.tab?.id;
  const ticket = state.pending.get(tabId);
  if (!ticket || sender.id !== chrome.runtime.id || sender.frameId !== 0 || !sender.documentId || sender.tab.incognito || originOf(sender.url) !== ORIGIN) return port.disconnect();
  let target = null, received = false, portAlive = true;
  const timer = setTimeout(() => { if (!received) { if (state.pending.get(tabId)?.nonce === ticket.nonce) state.pending.delete(tabId); port.disconnect(); } }, 5000);
  port.onDisconnect.addListener(() => { portAlive = false; clearTimeout(timer); if (target && ports.get(target.enrollmentId) === port) remove(target.enrollmentId, 'disconnected'); });
  port.onMessage.addListener(message => {
    if (received || !message || message.type !== 'documentReady' || Object.keys(message).sort().join() !== 'generation,type' || !/^[a-f0-9-]{36}$/.test(message.generation)) return port.disconnect();
    received = true; clearTimeout(timer);
    (async () => {
      const expectedDocument = await ticket.injected;
      if (!portAlive || expectedDocument !== sender.documentId) throw new Error('document_changed');
      const tab = await chrome.tabs.get(tabId);
      if (originOf(tab.url) !== ORIGIN || tab.incognito || !(await chrome.permissions.contains({ origins: [ORIGIN + '/*'] }))) throw new Error('permission_required');
      if (!portAlive) throw new Error('document_closed');
      target = acceptEnrollment(state, ticket, { tabId, generation: message.generation, service: 'youtube', origin: ORIGIN, frameId: 0, incognito: false });
      if (!target) return port.disconnect();
      ports.set(target.enrollmentId, port);
      await send('targetUpsert', wireTarget(state, target)); changed();
    })().catch(() => { if (target) remove(target.enrollmentId, 'disconnected'); else port.disconnect(); });
  });
});
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status === 'loading' || info.url !== undefined || info.discarded === true) invalidateTab(tabId, 'navigation');
});
chrome.tabs.onRemoved.addListener(tabId => invalidateTab(tabId, 'closed'));
chrome.permissions.onRemoved.addListener(() => { disconnect(); });
chrome.runtime.onMessage.addListener((message, sender, reply) => {
  if (sender.id !== chrome.runtime.id || sender.url !== popupUrl || sender.tab) return false;
  (async () => {
    switch (message?.type) {
      case 'status': return snapshot(state);
      case 'connect': await connect(); return snapshot(state);
      case 'enroll': await enrollTab(message.tabId); return snapshot(state);
      case 'release': remove(message.enrollmentId, 'released'); return snapshot(state);
      case 'revoke': disconnect(); return snapshot(state);
      default: return { error: 'unsupported_operation' };
    }
  })().then(reply, () => reply({ error: 'operation_failed' }));
  return true;
});
