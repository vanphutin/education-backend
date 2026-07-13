export interface Job { id: string; attempts: number; status: 'pending'|'done'|'dead'; }
export class IdempotentWorker {
  readonly effects: string[]=[]; readonly dlq: Job[]=[]; private completed=new Set<string>();
  handle(job: Job, failUntilAttempt=0): Job {
    if (this.completed.has(job.id)) return {...job,status:'done'};
    const attempts=job.attempts+1;
    if (attempts <= failUntilAttempt) {
      const failed={...job,attempts,status:(attempts>=3?'dead':'pending') as Job['status']};
      if(failed.status==='dead') this.dlq.push(failed); return failed;
    }
    this.effects.push(job.id); this.completed.add(job.id); return {...job,attempts,status:'done'};
  }
}
