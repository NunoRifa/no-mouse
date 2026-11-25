const id = value => typeof value === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(value);
const keys = (value, names) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).sort().join() === [...names].sort().join();
export const createState = () => ({ connectionId: null, epoch: null, targets: new Map(), pending: new Map(), sequence: 0 });
export function resetConnection(state, connectionId, epoch) {
  state.targets.clear(); state.pending.clear();
  state.connectionId = connectionId; state.epoch = epoch;
}
export function beginEnrollment(state, tabId) {
  if (!state.epoch || !Number.isInteger(tabId) || tabId < 0) throw new Error('not_ready');
  const ticket = { tabId, epoch: state.epoch, nonce: crypto.randomUUID() };
  state.pending.set(tabId, ticket); return ticket;
}
export function enroll(state, descriptor) {
  const { tabId, generation, origin, frameId, incognito, service } = descriptor;
  if (!state.epoch || !Number.isInteger(tabId) || tabId < 0 || !id(generation) || origin !== 'https://www.youtube.com' || frameId !== 0 || incognito || service !== 'youtube' || state.targets.size >= 50 || state.sequence >= 999999 || [...state.targets.values()].some(t => t.tabId === tabId)) throw new Error('invalid_target');
  const target = { tabId, generation, service, label: `YouTube — Tab ${++state.sequence}`, status: 'registered', enrollmentId: crypto.randomUUID() };
  state.targets.set(target.enrollmentId, target); return target;
}
export function acceptEnrollment(state, ticket, descriptor) {
  const pending = state.pending.get(ticket.tabId);
  if (!pending || ticket.epoch !== state.epoch || pending.nonce !== ticket.nonce || descriptor.tabId !== ticket.tabId) return null;
  state.pending.delete(ticket.tabId); return enroll(state, descriptor);
}
export function invalidate(state, enrollmentId) {
  const target = state.targets.get(enrollmentId);
  state.targets.delete(enrollmentId); return target ?? null;
}
export function cancelTab(state, tabId) {
  state.pending.delete(tabId);
  const target = [...state.targets.values()].find(t => t.tabId === tabId);
  return target ? invalidate(state, target.enrollmentId) : null;
}
export function snapshot(state) {
  return { connected: Boolean(state.epoch), targets: [...state.targets.values()].map(({ enrollmentId, label }) => ({ enrollmentId, label })) };
}
export function wireTarget(state, target) {
  return { epoch: state.epoch, enrollmentId: target.enrollmentId, generation: target.generation, service: target.service, label: target.label, status: target.status };
}
export function validateSnapshot(state, message) {
  if (!keys(message, ['version', 'type', 'requestId', 'connectionId', 'epoch', 'revision', 'targets']) || message.version !== 1 || message.type !== 'snapshot' || message.epoch !== state.epoch || message.connectionId !== state.connectionId || !id(message.requestId) || !Number.isSafeInteger(message.revision) || message.revision < 0 || !Array.isArray(message.targets) || message.targets.length > 50) return false;
  const seen = new Set(), handles = new Set();
  return message.targets.every(t => {
    if (!keys(t, ['enrollmentId', 'generation', 'service', 'label', 'status', 'targetHandle']) || !id(t.enrollmentId) || !id(t.generation) || !id(t.targetHandle) || t.service !== 'youtube' || t.status !== 'registered' || !/^YouTube — Tab [1-9][0-9]{0,5}$/.test(t.label) || seen.has(t.enrollmentId) || handles.has(t.targetHandle)) return false;
    seen.add(t.enrollmentId); handles.add(t.targetHandle);
    const local = state.targets.get(t.enrollmentId);
    return local && local.generation === t.generation && local.label === t.label;
  });
}
