import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, enroll, invalidate, resetConnection, snapshot, beginEnrollment, acceptEnrollment, cancelTab, wireTarget, validateSnapshot } from '../state.mjs';

const descriptor = (tabId, generation = `doc-${tabId}`) => ({ tabId, generation, service: 'youtube', origin: 'https://www.youtube.com', frameId: 0, incognito: false });
function connected() { const state = createState(); resetConnection(state, 'conn', 'epoch'); return state; }

test('two identical-service tabs stay distinct without leaking URLs or titles', () => {
  const s = connected();
  const a = enroll(s, descriptor(1)), b = enroll(s, descriptor(2));
  assert.notEqual(a.enrollmentId, b.enrollmentId);
  assert.equal(snapshot(s).targets.length, 2);
  const wire = wireTarget(s, a);
  assert.equal(wire.service, 'youtube');
  assert.deepEqual(Object.keys(wire).sort(), ['enrollmentId', 'epoch', 'generation', 'label', 'service', 'status']);
  assert.equal(JSON.stringify(wire).includes('https'), false);
});
test('rejects unpermitted origin, subframes, incognito, duplicate tab, invalid generation and capacity', () => {
  const s = connected();
  for (const patch of [{ origin: 'https://evil.invalid' }, { frameId: 1 }, { incognito: true }, { generation: '' }]) {
    assert.throws(() => enroll(s, { ...descriptor(1), ...patch }));
  }
  enroll(s, descriptor(1)); assert.throws(() => enroll(s, descriptor(1)));
  for (let i = 2; i <= 50; i++) enroll(s, descriptor(i));
  assert.throws(() => enroll(s, descriptor(51)));
});
test('navigation invalidates pending enrollment before async adapter response', () => {
  const s = connected(); const ticket = beginEnrollment(s, 1);
  cancelTab(s, 1);
  assert.equal(acceptEnrollment(s, ticket, descriptor(1)), null);
  assert.equal(snapshot(s).targets.length, 0);
});
test('old epoch and stale nonce cannot register after native reconnect', () => {
  const s = connected(); const ticket = beginEnrollment(s, 1);
  assert.equal(acceptEnrollment(s, { ...ticket, nonce: 'forged' }, descriptor(1)), null);
  resetConnection(s, 'newconn', 'newepoch');
  assert.equal(acceptEnrollment(s, ticket, descriptor(1)), null);
  assert.equal(snapshot(s).targets.length, 0);
});
test('revoke, close and disconnect drop targets; old callback cannot remove replacement', () => {
  const s = connected(); const a = enroll(s, descriptor(1));
  assert.equal(invalidate(s, a.enrollmentId, 'released')?.generation, a.generation);
  const b = enroll(s, descriptor(1, 'newdoc'));
  assert.equal(invalidate(s, a.enrollmentId, 'disconnected'), null);
  assert.equal(snapshot(s).targets[0].enrollmentId, b.enrollmentId);
  cancelTab(s, 1); assert.equal(snapshot(s).targets.length, 0);
  enroll(s, descriptor(2)); resetConnection(s, null, null);
  assert.deepEqual(snapshot(s), { connected: false, targets: [] });
  assert.throws(() => enroll(s, descriptor(3)));
  assert.deepEqual(snapshot(createState()), { connected: false, targets: [] });
});
test('snapshot trust boundary rejects extras, duplicates, invalid epoch and oversized lists', () => {
  const s = connected(); const a = enroll(s, descriptor(1));
  const entry = { ...wireTarget(s, a), targetHandle: 'handle' }; delete entry.epoch;
  const message = { version: 1, type: 'snapshot', requestId: 'r1', epoch: 'epoch', connectionId: 'conn', revision: 1, targets: [entry] };
  assert.equal(validateSnapshot(s, message), true);
  for (const value of [{ ...message, epoch: 'old' }, { ...message, targets: [entry, entry] }, { ...message, targets: [{ ...entry, url: 'https://private.invalid/' }] }, { ...message, targets: Array(51).fill(entry) }]) {
    assert.equal(validateSnapshot(s, value), false);
  }
});
