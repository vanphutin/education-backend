import type { Result } from './src/Result.js';

export class InvalidEmailError extends Error {
  constructor(public readonly code: 'INVALID_EMAIL_TYPE' | 'INVALID_EMAIL_FORMAT') { super(code); }
}

export class Email {
  private constructor(private readonly address: string) {}

  static tryCreate(input: unknown): Result<Email, 'INVALID_EMAIL_TYPE' | 'INVALID_EMAIL_FORMAT'> {
    if (typeof input !== 'string') return { ok: false, error: 'INVALID_EMAIL_TYPE' };
    const normalized = input.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
      return { ok: false, error: 'INVALID_EMAIL_FORMAT' };
    }
    return { ok: true, value: new Email(normalized) };
  }

  static create(input: unknown): Email {
    const result = Email.tryCreate(input);
    if (!result.ok) throw new InvalidEmailError(result.error);
    return result.value;
  }

  equals(other: Email): boolean {
    return this.address === other.address;
  }

  toString(): string {
    return this.address;
  }
}

