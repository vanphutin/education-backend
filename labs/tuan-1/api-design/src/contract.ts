export type BookStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface Book {
  id: string;
  isbn: string;
  title: string;
  priceMinor: number;
  stock: number;
  status: BookStatus;
  version: number;
}

export type ApiErrorCode =
  | 'BOOK_NOT_FOUND'
  | 'INVALID_TRANSITION'
  | 'INSUFFICIENT_STOCK'
  | 'PRECONDITION_FAILED'
  | 'IDEMPOTENCY_KEY_REUSED';

export class ContractError extends Error {
  constructor(public readonly code: ApiErrorCode, message: string) {
    super(message);
  }
}

const transitions: Record<BookStatus, readonly BookStatus[]> = {
  DRAFT: ['PUBLISHED'],
  PUBLISHED: ['ARCHIVED'],
  ARCHIVED: [],
};

export function transitionBook(book: Book, next: BookStatus, expectedVersion: number): Book {
  if (book.version !== expectedVersion) {
    throw new ContractError('PRECONDITION_FAILED', 'The representation is stale');
  }
  if (!transitions[book.status].includes(next)) {
    throw new ContractError('INVALID_TRANSITION', `${book.status} cannot transition to ${next}`);
  }
  return { ...book, status: next, version: book.version + 1 };
}

export interface AdjustmentCommand {
  idempotencyKey: string;
  delta: number;
}

export interface RecordedAdjustment {
  requestFingerprint: string;
  result: Book;
}

export function adjustStock(
  book: Book,
  command: AdjustmentCommand,
  recorded: Map<string, RecordedAdjustment>,
): Book {
  const fingerprint = JSON.stringify({ bookId: book.id, delta: command.delta });
  const previous = recorded.get(command.idempotencyKey);
  if (previous) {
    if (previous.requestFingerprint !== fingerprint) {
      throw new ContractError('IDEMPOTENCY_KEY_REUSED', 'The key was used with another payload');
    }
    return previous.result;
  }

  const stock = book.stock + command.delta;
  if (stock < 0) throw new ContractError('INSUFFICIENT_STOCK', 'Stock cannot become negative');
  const result = { ...book, stock, version: book.version + 1 };
  recorded.set(command.idempotencyKey, { requestFingerprint: fingerprint, result });
  return result;
}

export function encodeCursor(book: Pick<Book, 'id' | 'priceMinor'>): string {
  return Buffer.from(JSON.stringify([book.priceMinor, book.id])).toString('base64url');
}

export function decodeCursor(cursor: string): readonly [number, string] {
  const value: unknown = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
  if (!Array.isArray(value) || value.length !== 2 || !Number.isInteger(value[0]) || typeof value[1] !== 'string') {
    throw new TypeError('Invalid cursor');
  }
  return [value[0], value[1]];
}

export function paginateBooks(
  books: readonly Book[],
  limit: number,
  after?: string,
): { items: Book[]; nextCursor: string | null } {
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new RangeError('INVALID_LIMIT');
  const sorted = [...books].sort((a, b) => a.priceMinor - b.priceMinor || a.id.localeCompare(b.id));
  const boundary = after ? decodeCursor(after) : null;
  const eligible = boundary
    ? sorted.filter((book) => book.priceMinor > boundary[0] || (book.priceMinor === boundary[0] && book.id > boundary[1]))
    : sorted;
  const items = eligible.slice(0, limit);
  const last = items.at(-1);
  return { items, nextCursor: items.length === limit && last ? encodeCursor(last) : null };
}
