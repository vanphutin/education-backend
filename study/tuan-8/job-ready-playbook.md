# Tuần 8 Job-ready Playbook — Reliable async integration

## Outcome

State change và outbox commit cùng transaction; relay/worker chịu duplicate, crash và poison job; payment webhook được verify, dedupe và reconcile. Cache không trở thành source of truth.

## Daily depth

| Ngày | Trọng tâm | Failure lab | Evidence |
|---|---|---|---|
| Thứ 2 | cache-aside, TTL/invalidation/stampede | stale/miss/Redis down | correctness without cache |
| Thứ 3 | outbox/inbox, retry/backoff/DLQ | crash after effect, duplicate delivery | replay/recovery logs |
| Thứ 4 | webhook/provider boundary | bad signature, replay, timeout | provider contract tests |
| Thứ 5 | event ownership/versioning | old/new schema, late event | compatibility matrix |
| Thứ 6–7 | relay + expiry + payment worker | poison job and recovery | queue/DLQ dashboard/log |

## Required implementation

- Outbox row and business change in one local transaction.
- Claim/lease strategy prevents two relays from publishing blindly.
- Consumer inbox or idempotency key before side effect.
- Bounded exponential backoff + jitter; DLQ with manual replay procedure.
- Webhook signature verified on raw body; provider event ID unique.
- Cache failure degrades performance, not booking correctness.

## Hard gates

Fail nếu fire-and-forget, ack trước durable outcome, infinite retry, cache owns booking state, or external provider called while DB lock held.

Lab precursor: [`labs/project-delivery`](../../labs/project-delivery/README.md), tests tuần 8.

