import assert from 'node:assert/strict';
import test from 'node:test';
import { adjustStock, ContractError, decodeCursor, encodeCursor, paginateBooks, transitionBook, type Book } from './contract.js';

const draft: Book = {
  id: 'book-1', isbn: '978-0-00-000001-1', title: 'Backend Mental Models',
  priceMinor: 120_000, stock: 5, status: 'DRAFT', version: 3,
};

test('optimistic precondition prevents a stale transition', () => {
  assert.throws(() => transitionBook(draft, 'PUBLISHED', 2),
    (error: unknown) => error instanceof ContractError && error.code === 'PRECONDITION_FAILED');
  assert.equal(transitionBook(draft, 'PUBLISHED', 3).version, 4);
});

test('an idempotent adjustment returns the recorded result on retry', () => {
  const recorded = new Map();
  const command = { idempotencyKey: 'adjust-1', delta: -2 };
  const first = adjustStock(draft, command, recorded);
  const retry = adjustStock(draft, command, recorded);
  assert.deepEqual(retry, first);
  assert.equal(retry.stock, 3);
});

test('reusing an idempotency key with a different payload is rejected', () => {
  const recorded = new Map();
  adjustStock(draft, { idempotencyKey: 'same-key', delta: 1 }, recorded);
  assert.throws(() => adjustStock(draft, { idempotencyKey: 'same-key', delta: 2 }, recorded),
    (error: unknown) => error instanceof ContractError && error.code === 'IDEMPOTENCY_KEY_REUSED');
});

test('cursor round-trips the complete stable sort key', () => {
  assert.deepEqual(decodeCursor(encodeCursor(draft)), [120_000, 'book-1']);
});

test('cursor pagination remains stable when a new earlier item is inserted', () => {
  const books = [
    { ...draft, id: 'b', priceMinor: 100 },
    { ...draft, id: 'c', priceMinor: 100 },
    { ...draft, id: 'd', priceMinor: 200 },
  ];
  const first = paginateBooks(books, 2);
  const second = paginateBooks([{ ...draft, id: 'a', priceMinor: 50 }, ...books], 2, first.nextCursor ?? undefined);
  assert.deepEqual(first.items.map((book) => book.id), ['b', 'c']);
  assert.deepEqual(second.items.map((book) => book.id), ['d']);
});

test('negative stock and forbidden lifecycle transitions are rejected', () => {
  assert.throws(() => adjustStock(draft, { idempotencyKey: 'negative', delta: -99 }, new Map()),
    (error: unknown) => error instanceof ContractError && error.code === 'INSUFFICIENT_STOCK');
  assert.throws(() => transitionBook({ ...draft, status: 'ARCHIVED' }, 'PUBLISHED', 3),
    (error: unknown) => error instanceof ContractError && error.code === 'INVALID_TRANSITION');
});

test('malformed cursors and invalid page sizes are rejected at runtime boundary', () => {
  assert.throws(() => decodeCursor('not-json'));
  assert.throws(() => paginateBooks([draft], 0), /INVALID_LIMIT/);
});
