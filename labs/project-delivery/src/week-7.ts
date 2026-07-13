export class SeatInventory {
  private heldBy: string | null = null; private requests = new Map<string, { actor: string; outcome: string }>();
  hold(actor: string, idempotencyKey: string) {
    const previous=this.requests.get(idempotencyKey);
    if (previous) { if (previous.actor !== actor) throw new Error('IDEMPOTENCY_KEY_CONFLICT'); return previous.outcome; }
    const outcome = this.heldBy === null ? (this.heldBy=actor,'HELD') : 'SEAT_UNAVAILABLE';
    this.requests.set(idempotencyKey,{actor,outcome}); return outcome;
  }
  owner(){ return this.heldBy; }
}
