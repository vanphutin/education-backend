export interface Clock { now(): number }

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, { startedAt: number; count: number }>();
  constructor(private readonly limit: number, private readonly windowMs: number, private readonly clock: Clock) {}

  consume(subject: string): { allowed: boolean; remaining: number; retryAfterMs: number } {
    const now = this.clock.now();
    let bucket = this.buckets.get(subject);
    if (!bucket || now - bucket.startedAt >= this.windowMs) {
      bucket = { startedAt: now, count: 0 };
      this.buckets.set(subject, bucket);
    }
    if (bucket.count >= this.limit) {
      return { allowed: false, remaining: 0, retryAfterMs: this.windowMs - (now - bucket.startedAt) };
    }
    bucket.count += 1;
    return { allowed: true, remaining: this.limit - bucket.count, retryAfterMs: 0 };
  }
}
