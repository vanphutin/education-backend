import test from 'node:test';
import assert from 'node:assert/strict';
import { IdempotentWorker } from './week-8.js';
test('week 8 applies a duplicated job effect once', () => { const w = new IdempotentWorker(); const j = { id: 'evt-1', attempts: 0, status: 'pending' }; w.handle(j); w.handle(j); assert.deepEqual(w.effects, ['evt-1']); });
test('week 8 bounds retries and sends poison work to DLQ', () => { const w = new IdempotentWorker(); let j = { id: 'evt-bad', attempts: 0, status: 'pending' }; j = w.handle(j, 99); j = w.handle(j, 99); const last = w.handle(j, 99); assert.equal(last.status, 'dead'); assert.equal(w.dlq.length, 1); });
