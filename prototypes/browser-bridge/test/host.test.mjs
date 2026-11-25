import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const dll = fileURLToPath(new URL('../host/bin/Release/net10.0/NoMouse.BrowserBridge.Host.dll', import.meta.url));
const dotnet = process.env.DOTNET_EXE || 'dotnet';
function frame(value) {
  const payload = Buffer.isBuffer(value) ? value : Buffer.from(JSON.stringify(value));
  const prefix = Buffer.alloc(4);
  prefix.writeUInt32LE(payload.length);
  return Buffer.concat([prefix, payload]);
}
function host(t, args = ['--stdio-check']) {
  assert.ok(existsSync(dll), 'Build the read-only native host before running checks');
  const child = spawn(dotnet, [dll, ...args], { stdio: ['pipe', 'pipe', 'pipe'] });
  t.after(() => child.kill());
  let buffer = Buffer.alloc(0);
  let stderr = '';
  const messages = [], waiters = [];
  child.stderr.on('data', b => { stderr += b; });
  child.stdout.on('data', b => {
    buffer = Buffer.concat([buffer, b]);
    while (buffer.length >= 4 && buffer.length >= buffer.readUInt32LE(0) + 4) {
      const n = buffer.readUInt32LE(0);
      const result = JSON.parse(buffer.subarray(4, n + 4).toString('utf8'));
      buffer = buffer.subarray(n + 4);
      if (waiters.length) waiters.shift()(result); else messages.push(result);
    }
  });
  const exited = new Promise((resolve, reject) => {
    child.on('error', reject);
    child.on('exit', code => resolve(code));
  });
  let id = 0;
  return {
    child, exited,
    stderr: () => stderr,
    async read() {
      return await Promise.race([
        messages.length ? Promise.resolve(messages.shift()) : new Promise(resolve => waiters.push(resolve)),
        exited.then(code => { throw new Error(`Host exited ${code}: ${stderr}`); }),
        new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('Host response timeout')), 5000); timer.unref(); }),
      ]);
    },
    async send(type, fields = {}) {
      child.stdin.write(frame({ version: 1, type, requestId: `r${++id}`, ...fields }));
      return await this.read();
    },
  };
}
async function ready(t) {
  const h = host(t);
  h.ack = await h.send('hello', { browser: 'chrome' });
  assert.equal(h.ack.type, 'helloAck');
  assert.equal(h.ack.mode, 'read-only');
  assert.match(h.ack.epoch, /^[a-f0-9]{32}$/);
  return h;
}
function target(h, i = 1) {
  return { epoch: h.ack.epoch, enrollmentId: `tab-${i}`, generation: `doc-${i}`, service: 'youtube', label: `YouTube — Tab ${i}`, status: 'registered' };
}

test('handshake required; framed Unicode snapshots preserve two distinct targets', async t => {
  const h = host(t);
  assert.equal((await h.send('snapshotRequest', { epoch: 'wrong' })).code, 'handshake_required');
  h.ack = await h.send('hello', { browser: 'chrome' });
  await h.send('targetUpsert', target(h, 1));
  const result = await h.send('targetUpsert', target(h, 2));
  assert.equal(result.targets.length, 2);
  assert.equal(result.targets[0].label, 'YouTube — Tab 1');
  assert.notEqual(result.targets[0].targetHandle, result.targets[1].targetHandle);
  assert.deepEqual(Object.keys(result.targets[0]).sort(), ['enrollmentId', 'generation', 'label', 'service', 'status', 'targetHandle']);
  h.child.stdin.end();
  assert.equal(await h.exited, 0);
});

test('commands, fields, versions, duplicate properties, and wrong epoch are rejected', async t => {
  const h = await ready(t);
  for (const command of ['play', 'pause', 'stop', 'queue', 'volume', 'navigate']) {
    assert.equal((await h.send(command, { epoch: h.ack.epoch })).code, 'unsupported_operation');
  }
  assert.equal((await h.send('targetUpsert', { ...target(h), url: 'https://private.invalid/' })).code, 'invalid_message');
  assert.equal((await h.send('targetUpsert', { ...target(h), epoch: 'old' })).code, 'stale_connection');
  assert.equal((await h.send('hello', { browser: 'chrome' })).code, 'already_connected');
  h.child.stdin.write(frame({ version: 2, type: 'hello', requestId: 'v2', browser: 'chrome' }));
  assert.equal((await h.read()).code, 'invalid_message');
  h.child.stdin.write(frame(Buffer.from('{"version":1,"version":1,"type":"hello","requestId":"dup","browser":"chrome"}')));
  assert.equal((await h.read()).code, 'invalid_message');
  h.child.stdin.write(frame({ version: 1, type: 'snapshotRequest', requestId: 'é', epoch: h.ack.epoch }));
  assert.equal((await h.read()).code, 'invalid_message');
  assert.equal((await h.send('snapshotRequest', { epoch: h.ack.epoch })).targets.length, 0);
});

test('old generation, retired enrollment, request replay, and 51st target cannot mutate state', async t => {
  const h = await ready(t);
  const first = target(h);
  const added = await h.send('targetUpsert', first);
  const handle = added.targets[0].targetHandle;
  assert.equal((await h.send('targetRemove', { epoch: h.ack.epoch, enrollmentId: first.enrollmentId, generation: 'old', reason: 'navigation' })).code, 'stale_target');
  assert.equal((await h.send('targetUpsert', { ...first, generation: 'new' })).code, 'stale_target');
  assert.equal((await h.send('snapshotRequest', { epoch: h.ack.epoch })).targets[0].targetHandle, handle);
  await h.send('targetRemove', { epoch: h.ack.epoch, enrollmentId: first.enrollmentId, generation: first.generation, reason: 'navigation' });
  assert.equal((await h.send('targetUpsert', first)).code, 'stale_target');
  for (let i = 2; i <= 51; i++) assert.equal((await h.send('targetUpsert', { ...target(h, i), label: 'YouTube — Tab 1' })).type, 'snapshot');
  assert.equal((await h.send('targetUpsert', { ...target(h, 52), label: 'YouTube — Tab 1' })).code, 'target_limit');
  const message = { version: 1, type: 'snapshotRequest', requestId: 'same', epoch: h.ack.epoch };
  h.child.stdin.write(frame(message)); await h.read();
  h.child.stdin.write(frame(message)); assert.equal((await h.read()).code, 'replayed_request');
});

test('partial frame reads and adjacent frames work without stdout diagnostics', async t => {
  const h = host(t);
  const hello = frame({ version: 1, type: 'hello', requestId: 'split', browser: 'chrome' });
  h.child.stdin.write(hello.subarray(0, 2));
  await new Promise(resolve => setImmediate(resolve));
  h.child.stdin.write(hello.subarray(2));
  const ack = await h.read();
  const a = frame({ version: 1, type: 'snapshotRequest', requestId: 'a', epoch: ack.epoch });
  const b = frame({ version: 1, type: 'snapshotRequest', requestId: 'b', epoch: ack.epoch });
  h.child.stdin.write(Buffer.concat([a, b]));
  assert.equal((await h.read()).requestId, 'a');
  assert.equal((await h.read()).requestId, 'b');
  assert.equal(h.stderr(), '');
});

for (const [name, input] of [
  ['truncated prefix', Buffer.from([1, 0])],
  ['truncated payload', Buffer.from([4, 0, 0, 0, 123])],
  ['oversize prefix', Buffer.from([1, 0, 1, 0])],
  ['zero prefix', Buffer.alloc(4)],
  ['invalid UTF8', frame(Buffer.from([0xff]))],
  ['invalid JSON', frame(Buffer.from('{'))],
]) {
  test(`fatal framing: ${name}`, async t => {
    const h = host(t); h.child.stdin.end(input);
    assert.notEqual(await h.exited, 0);
    assert.match(h.stderr(), /^invalid_frame\s*$/);
  });
}
test('empty stdin is clean EOF and unregistered browser origins fail closed', async t => {
  const h = host(t); h.child.stdin.end(); assert.equal(await h.exited, 0);
  const bad = host(t, ['chrome-extension://aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/']);
  bad.child.stdin.end(); assert.notEqual(await bad.exited, 0);
  assert.match(bad.stderr(), /^origin_not_allowed\s*$/);
});
