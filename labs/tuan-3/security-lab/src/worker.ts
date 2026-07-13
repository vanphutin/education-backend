export type JobStatus = 'PENDING' | 'PROCESSING' | 'RETRYABLE' | 'DONE' | 'DEAD';
export interface Job {
  id: string;
  idempotencyKey: string;
  attempts: number;
  status: JobStatus;
  nextAttemptAt: number;
  traceId: string;
  lastError?: string;
}

export interface DeadLetter { jobId: string; reason: string; attempts: number; traceId: string }

export class Outbox {
  readonly jobs = new Map<string, Job>();
  readonly deadLetters: DeadLetter[] = [];

  enqueue(input: Pick<Job, 'id' | 'idempotencyKey' | 'traceId'>): Job {
    const duplicate = [...this.jobs.values()].find((job) => job.idempotencyKey === input.idempotencyKey);
    if (duplicate) return duplicate;
    const job: Job = { ...input, attempts: 0, status: 'PENDING', nextAttemptAt: 0 };
    this.jobs.set(job.id, job);
    return job;
  }
}

export class DeterministicWorker {
  readonly effects: string[] = [];
  readonly processed = new Set<string>();
  constructor(private readonly outbox: Outbox, private readonly now: () => number = () => Date.now()) {}

  async run(jobId: string, effect: () => Promise<void>, maxAttempts = 3): Promise<Job> {
    const job = this.outbox.jobs.get(jobId);
    if (!job) throw new Error('JOB_NOT_FOUND');
    if (this.processed.has(job.idempotencyKey)) return this.save({ ...job, status: 'DONE' });
    if (job.status === 'DEAD' || job.status === 'DONE') return job;
    if (job.nextAttemptAt > this.now()) return job;

    this.save({ ...job, status: 'PROCESSING' });
    try {
      await effect();
      this.processed.add(job.idempotencyKey);
      this.effects.push(job.idempotencyKey);
      return this.save({ ...job, attempts: job.attempts + 1, status: 'DONE' });
    } catch (error) {
      const attempts = job.attempts + 1;
      const reason = error instanceof Error ? error.message : 'UNKNOWN_ERROR';
      if (attempts >= maxAttempts) {
        this.outbox.deadLetters.push({ jobId: job.id, reason, attempts, traceId: job.traceId });
        return this.save({ ...job, attempts, status: 'DEAD', lastError: reason });
      }
      const backoff = Math.min(1000 * 2 ** (attempts - 1), 30_000);
      return this.save({ ...job, attempts, status: 'RETRYABLE', nextAttemptAt: this.now() + backoff, lastError: reason });
    }
  }

  replayDead(jobId: string): Job {
    const job = this.outbox.jobs.get(jobId);
    if (!job || job.status !== 'DEAD') throw new Error('JOB_NOT_DEAD');
    const index = this.outbox.deadLetters.findIndex((item) => item.jobId === jobId);
    if (index >= 0) this.outbox.deadLetters.splice(index, 1);
    const { lastError: _lastError, ...retryable } = job;
    return this.save({ ...retryable, attempts: 0, status: 'RETRYABLE', nextAttemptAt: this.now() });
  }

  private save(job: Job): Job {
    this.outbox.jobs.set(job.id, job);
    return job;
  }
}
