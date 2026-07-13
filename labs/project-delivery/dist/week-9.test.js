import test from 'node:test';
import assert from 'node:assert/strict';
import { safeLog, shouldRetry } from './week-9.js';
test('week 9 retries only bounded idempotent transient failures', () => { assert.equal(shouldRetry({ method: 'GET', idempotent: true, attempt: 1, status: 503 }), true); assert.equal(shouldRetry({ method: 'POST', idempotent: false, attempt: 1, status: 503 }), false); assert.equal(shouldRetry({ method: 'GET', idempotent: true, attempt: 3, status: 503 }), false); });
test('week 9 structured log drops secrets', () => assert.deepEqual(safeLog({ service: 'gateway', requestId: 'r1', route: '/movies/:id', status: 200, durationMs: 12, token: 'secret' }), { service: 'gateway', requestId: 'r1', route: '/movies/:id', status: 200, durationMs: 12 }));
