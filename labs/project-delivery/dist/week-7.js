export class SeatInventory {
    heldBy = null;
    requests = new Map();
    hold(actor, idempotencyKey) {
        const previous = this.requests.get(idempotencyKey);
        if (previous) {
            if (previous.actor !== actor)
                throw new Error('IDEMPOTENCY_KEY_CONFLICT');
            return previous.outcome;
        }
        const outcome = this.heldBy === null ? (this.heldBy = actor, 'HELD') : 'SEAT_UNAVAILABLE';
        this.requests.set(idempotencyKey, { actor, outcome });
        return outcome;
    }
    owner() { return this.heldBy; }
}
