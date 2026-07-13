import test from 'node:test';
import assert from 'node:assert/strict';
import { migrationRisks, recommendCompositeIndex } from './week-5.js';
test('week 5 rejects unsafe not-null migration order', () => assert.deepEqual(migrationRisks([{ kind: 'add_nullable', table: 'showtimes' }, { kind: 'set_not_null', table: 'showtimes' }]), ['NOT_NULL_BEFORE_BACKFILL', 'NOT_NULL_BEFORE_VALIDATION']));
test('week 5 derives index columns from access pattern, not guesses', () => assert.deepEqual(recommendCompositeIndex(['cinema_id', 'show_date'], ['starts_at', 'id']), ['cinema_id', 'show_date', 'starts_at', 'id']));
