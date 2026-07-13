import assert from 'node:assert/strict';
import test from 'node:test';
import { CacheAside } from './cache.js';
import { hashPassword, verifyPassword } from './hash.js';
import { signAccessToken, verifyAccessToken } from './jwt.js';
import { structuredLog } from './logger.js';
import { FixedWindowRateLimiter } from './rate-limit.js';
import { health } from './health.js';
import { DeterministicWorker, Outbox } from './worker.js';

test('bcrypt uses random salt and verifies without exposing the password', async () => {
  const password = 'lab-password-only';
  const [a, b] = await Promise.all([hashPassword(password, 4), hashPassword(password, 4)]);
  assert.notEqual(a, b);
  assert.equal(await verifyPassword(password, a), true);
  assert.equal(await verifyPassword('wrong-password', a), false);
});

test('JWT verification rejects tampering', () => {
  const secret = 'lab-secret-with-at-least-24-characters';
  const token = signAccessToken('user-1', 'student', secret);
  assert.equal(verifyAccessToken(token, secret).sub, 'user-1');
  assert.throws(() => verifyAccessToken(`${token.slice(0, -1)}x`, secret));
});

test('recursive logger redacts nested credentials', () => {
  const output = structuredLog('auth.failed', { headers: { Authorization: 'Bearer SECRET' }, nested: [{ password: 'SECRET' }] });
  assert.equal(output.includes('SECRET'), false);
  assert.equal(output.includes('[REDACTED]'), true);
});

test('rate limit and cache are deterministic under a fake clock', async () => {
  let now = 0; const clock = { now: () => now };
  const limiter = new FixedWindowRateLimiter(2, 1000, clock);
  assert.equal(limiter.consume('a').allowed, true);
  assert.equal(limiter.consume('a').allowed, true);
  assert.equal(limiter.consume('a').allowed, false);
  now = 1000; assert.equal(limiter.consume('a').allowed, true);

  let loads = 0; const cache = new CacheAside(100, clock);
  assert.equal((await cache.get('tenant:1', async () => ++loads)).hit, false);
  assert.equal((await cache.get('tenant:1', async () => ++loads)).hit, true);
  assert.equal(loads, 1);
});

test('worker retries are bounded and duplicate success does not repeat the effect', async () => {
  let now = 0;
  const outbox = new Outbox();
  outbox.enqueue({ id: 'job-1', idempotencyKey: 'receipt-1', traceId: 'trace-1' });
  const worker = new DeterministicWorker(outbox, () => now);
  let failures = 2;
  for (let i = 0; i < 3; i += 1) {
    const job = await worker.run('job-1', async () => { if (failures-- > 0) throw new Error('TRANSIENT'); });
    now = job.nextAttemptAt;
  }
  const job = outbox.jobs.get('job-1');
  assert.ok(job);
  assert.equal(job.status, 'DONE');
  await worker.run('job-1', async () => assert.fail('duplicate must not run'));
  assert.deepEqual(worker.effects, ['receipt-1']);
});

test('permanent failure enters DLQ and manual replay is explicit', async () => {
  let now = 0;
  const outbox = new Outbox();
  outbox.enqueue({ id: 'poison', idempotencyKey: 'poison-key', traceId: 'trace-poison' });
  const worker = new DeterministicWorker(outbox, () => now);
  for (let i = 0; i < 3; i += 1) {
    const job = await worker.run('poison', async () => { throw new Error('PERMANENT'); });
    now = job.nextAttemptAt;
  }
  assert.equal(outbox.jobs.get('poison')?.status, 'DEAD');
  assert.deepEqual(outbox.deadLetters, [{ jobId: 'poison', reason: 'PERMANENT', attempts: 3, traceId: 'trace-poison' }]);
  assert.equal(worker.replayDead('poison').status, 'RETRYABLE');
});

test('readiness depends on required state, not optional cache', () => {
  assert.equal(health({ configReady: true, requiredStoreWritable: true, cacheAvailable: false, pendingJobs: 2, oldestPendingAgeMs: 1000 }).status, 'degraded');
  assert.equal(health({ configReady: true, requiredStoreWritable: false, cacheAvailable: true, pendingJobs: 0, oldestPendingAgeMs: 0 }).ready, false);
});
