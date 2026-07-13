export class IdempotentWorker {
    effects = [];
    dlq = [];
    completed = new Set();
    handle(job, failUntilAttempt = 0) {
        if (this.completed.has(job.id))
            return { ...job, status: 'done' };
        const attempts = job.attempts + 1;
        if (attempts <= failUntilAttempt) {
            const failed = { ...job, attempts, status: (attempts >= 3 ? 'dead' : 'pending') };
            if (failed.status === 'dead')
                this.dlq.push(failed);
            return failed;
        }
        this.effects.push(job.id);
        this.completed.add(job.id);
        return { ...job, attempts, status: 'done' };
    }
}
