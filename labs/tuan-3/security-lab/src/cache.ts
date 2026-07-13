import type { Clock } from './rate-limit.js';

export class CacheAside<T> {
  private readonly entries = new Map<string, { value: T; expiresAt: number }>();
  constructor(private readonly ttlMs: number, private readonly clock: Clock) {}

  async get(key: string, load: () => Promise<T>): Promise<{ value: T; hit: boolean }> {
    const entry = this.entries.get(key);
    if (entry && entry.expiresAt > this.clock.now()) return { value: entry.value, hit: true };
    const value = await load();
    this.entries.set(key, { value, expiresAt: this.clock.now() + this.ttlMs });
    return { value, hit: false };
  }

  invalidate(key: string): void { this.entries.delete(key); }
}
