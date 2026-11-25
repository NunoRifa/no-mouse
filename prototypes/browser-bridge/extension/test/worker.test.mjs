import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

function event() {
  const listeners = [];
  return { addListener(fn) { listeners.push(fn); }, emit(...args) { return listeners.map(fn => fn(...args)); } };
}
async function fixture() {
  const runtimeMessage = event(), runtimeConnect = event(), updated = event(), removed = event(), revoked = event();
  const native = [];
  let granted = true, injection = null, permissionCheck = null;
  const tabs = new Map([[1, { id: 1, url: 'https://www.youtube.com/watch?v=test', active: true, incognito: false }], [2, { id: 2, url: 'https://www.youtube.com/watch?v=another', active: true, incognito: false }]]);
  const chrome = {
    runtime: { id: 'a'.repeat(32), getURL: p => `chrome-extension://${'a'.repeat(32)}/${p}`, onMessage: runtimeMessage, onConnect: runtimeConnect,
      sendMessage: async () => {}, connectNative: () => {
        const port = { onMessage: event(), onDisconnect: event(), sent: [], disconnect() { this.onDisconnect.emit(); }, postMessage(m) {
          this.sent.push(m);
          if (m.type === 'hello') queueMicrotask(() => this.onMessage.emit({ version: 1, type: 'helloAck', requestId: m.requestId, connectionId: 'a'.repeat(32), epoch: 'b'.repeat(32), mode: 'read-only' }));
          else if (m.type === 'targetUpsert') {
            this.targets ??= new Map();
            const { enrollmentId, generation, service, label, status } = m;
            this.targets.set(enrollmentId, { enrollmentId, generation, service, label, status, targetHandle: `h${this.sent.length}` });
            queueMicrotask(() => this.onMessage.emit({ version: 1, type: 'snapshot', requestId: m.requestId, connectionId: 'a'.repeat(32), epoch: 'b'.repeat(32), revision: this.sent.length, targets: [...this.targets.values()] }));
          } else if (m.type === 'targetRemove') {
            this.targets?.delete(m.enrollmentId);
            queueMicrotask(() => this.onMessage.emit({ version: 1, type: 'snapshot', requestId: m.requestId, connectionId: 'a'.repeat(32), epoch: 'b'.repeat(32), revision: this.sent.length, targets: [...(this.targets?.values() ?? [])] }));
          }
        } };
        native.push(port); return port;
      },
    },
    tabs: { get: async id => ({ ...tabs.get(id) }), onUpdated: updated, onRemoved: removed },
    permissions: { contains: async () => permissionCheck ? await permissionCheck() : granted, onRemoved: revoked },
    scripting: { executeScript: async options => { if (injection) return await injection(options); return [{ frameId: 0, documentId: 'doc-browser-1' }]; } },
  };
  globalThis.chrome = chrome;
  await import(`../worker.js?fixture=${crypto.randomUUID()}`);
  const call = message => new Promise(resolve => runtimeMessage.emit(message, { id: chrome.runtime.id, url: chrome.runtime.getURL('popup.html') }, resolve));
  return { call, native, updated, removed, revoked, runtimeConnect, chrome, tabs,
    deny() { granted = false; }, inject(fn) { injection = fn; }, permission(fn) { permissionCheck = fn; },
  };
}

test('worker disconnect clears state and ignores late messages from old native port', async () => {
  const f = await fixture();
  await f.call({ type: 'connect' }); const old = f.native[0];
  await f.call({ type: 'connect' });
  old.onMessage.emit({ version: 1, type: 'error', requestId: 'old', code: 'late' });
  assert.equal((await f.call({ type: 'status' })).connected, true);
  f.revoked.emit(); assert.equal((await f.call({ type: 'status' })).connected, false);
});
test('worker rejects enrollment without permission and clears pending navigation race', async () => {
  const f = await fixture(); await f.call({ type: 'connect' }); f.deny();
  assert.equal((await f.call({ type: 'enroll', tabId: 1 })).error, 'operation_failed');
  assert.deepEqual((await f.call({ type: 'status' })).targets, []);
  f.revoked.emit();
});
function content(f, tabId = 1, documentId = 'doc-browser-1') {
  let disconnected = false;
  const port = { name: 'nomouse-readonly-document', sender: { id: f.chrome.runtime.id, tab: f.tabs.get(tabId), frameId: 0, documentId, url: f.tabs.get(tabId).url }, onMessage: event(), onDisconnect: event(), disconnect() { if (!disconnected) { disconnected = true; this.onDisconnect.emit(); } } };
  f.runtimeConnect.emit(port);
  return port;
}
const tick = () => new Promise(resolve => setImmediate(resolve));
test('worker ignores adapter whose injection completed in a different document', async () => {
  const f = await fixture(); await f.call({ type: 'connect' });
  let port;
  f.inject(async () => { port = content(f, 1, 'old-document'); port.onMessage.emit({ type: 'documentReady', generation: crypto.randomUUID() }); return [{ frameId: 0, documentId: 'new-document' }]; });
  await f.call({ type: 'enroll', tabId: 1 }); await tick(); await tick();
  assert.equal((await f.call({ type: 'status' })).targets.length, 0);
  f.revoked.emit();
});
test('worker enrolls two tabs, removes a closed tab, and drops all on revoke', async () => {
  const f = await fixture(); await f.call({ type: 'connect' });
  f.inject(async ({ target }) => {
    const port = content(f, target.tabId);
    port.onMessage.emit({ type: 'documentReady', generation: crypto.randomUUID() });
    return [{ frameId: 0, documentId: 'doc-browser-1' }];
  });
  await f.call({ type: 'enroll', tabId: 1 }); await tick();
  await f.call({ type: 'enroll', tabId: 2 }); await tick();
  assert.equal((await f.call({ type: 'status' })).targets.length, 2);
  f.removed.emit(1); await tick();
  assert.equal((await f.call({ type: 'status' })).targets.length, 1);
  f.revoked.emit(); assert.deepEqual((await f.call({ type: 'status' })).targets, []);
  assert.equal(JSON.stringify(f.native[0].sent).includes('watch?v='), false);
});
test('navigation while permission check awaits cannot enroll replacement document', async () => {
  const f = await fixture(); await f.call({ type: 'connect' });
  let release; f.permission(() => new Promise(resolve => { release = resolve; }));
  let injected = 0; f.inject(async () => { injected++; return []; });
  const pending = f.call({ type: 'enroll', tabId: 1 }); await tick();
  f.updated.emit(1, { status: 'loading' }); release(true);
  await pending; assert.equal(injected, 0);
  assert.deepEqual((await f.call({ type: 'status' })).targets, []); f.revoked.emit();
});
test('ordered snapshot in flight does not disconnect remaining tab after local removal', async () => {
  const f = await fixture(); await f.call({ type: 'connect' });
  f.inject(async ({ target }) => { const port = content(f, target.tabId); port.onMessage.emit({ type: 'documentReady', generation: crypto.randomUUID() }); return [{ frameId: 0, documentId: 'doc-browser-1' }]; });
  await f.call({ type: 'enroll', tabId: 1 }); await tick();
  const native = f.native[0], originalEmit = native.onMessage.emit.bind(native.onMessage);
  let delayed = null;
  native.onMessage.emit = message => { if (message.type === 'snapshot' && message.targets.length === 2) delayed = message; else originalEmit(message); };
  await f.call({ type: 'enroll', tabId: 2 }); await tick(); assert.ok(delayed);
  f.removed.emit(1); originalEmit(delayed); await tick();
  const result = await f.call({ type: 'status' });
  assert.equal(result.connected, true); assert.equal(result.targets.length, 1); f.revoked.emit();
});
test('manifest does not grant all-site or sensitive browser permissions', async () => {
  const manifest = JSON.parse(await readFile(new URL('../manifest.json', import.meta.url), 'utf8'));
  assert.deepEqual(manifest.permissions.sort(), ['nativeMessaging', 'scripting', 'storage']);
  assert.deepEqual(manifest.optional_host_permissions, ['https://www.youtube.com/*']);
  assert.equal(manifest.host_permissions, undefined);
  assert.equal(manifest.externally_connectable, undefined);
  assert.equal(manifest.content_scripts, undefined);
  assert.equal(manifest.incognito, 'not_allowed');
});
