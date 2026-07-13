# Tuần 8 - Outbox/worker, payment/webhook integration, cache và semantic search optional

**Giai đoạn:** Project Delivery  
**Chế độ học:** Async/integration theory + implement selected production features.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Service integration chịu được duplicate/lost/late delivery và provider failure; core Booking/Catalog không gọi external provider trong transaction. |
| Focus | Outbox relay, worker, Redis cache, BullMQ jobs, retry/timeout/DLQ, payment provider abstraction, webhook idempotency; semantic search là Catalog stretch. |
| Project rule | Event contract versioned; worker xử lý at-least-once; AI/search chỉ làm sau khi core flows và observability ổn. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Service-local cache: Catalog read cache, TTL/invalidation, stale data, when not to cache Booking state |
| Thứ 3 | Outbox relay/worker: retry, timeout, delayed hold expiry, idempotent handler, inbox/DLQ and replay |
| Thứ 4 | Integration: payment worker/webhook, provider abstraction; Catalog embeddings/pgvector as optional stretch |
| Thứ 5 | Map event ownership: booking payment/hold events, catalog AI events, cache boundary and failure matrix |
| Thứ 6-7 | Implement outbox relay/worker, expiry, webhook replay safety, service-local cache and optional search slice/logs |

## 3. Output bắt buộc
- Hoàn thành [Job-ready async integration playbook](../../study/tuan-8/job-ready-playbook.md) và tests tuần 8 trong [`labs/project-delivery`](../../labs/project-delivery/README.md).

- Cache strategy per service and explicit source-of-truth decision
- Versioned event/outbox/inbox/job/DLQ design
- Payment webhook replay and provider-failure evidence
- Outbox crash recovery, inbox deduplication, bounded retry/DLQ và cache-down evidence.
- Semantic search docs only if Catalog core/reliability exits are met
- Correlated integration logs across service → worker → provider

## 4. Interview drill

- Vì sao queue delivery không thể giả định exactly-once?
- Outbox và inbox giải quyết hai failure window khác nhau nào?
- Booking state nào không nên cache như source of truth?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [Redis Docs - Client-side Caching](https://redis.io/docs/latest/develop/reference/client-side-caching/) | [Redis Docs - Distributed Locks with Redis](https://redis.io/docs/latest/develop/use/patterns/distributed-locks/) |
| Tue | [BullMQ Docs - Introduction](https://docs.bullmq.io/guide/introduction) | [BullMQ Docs - Retrying Failing Jobs](https://docs.bullmq.io/guide/retrying-failing-jobs) |
| Wed | [Stripe Docs - Webhooks](https://docs.stripe.com/webhooks) | [OpenAI Docs - Embeddings](https://platform.openai.com/docs/guides/embeddings) |
| Thu | [Redis Docs - Caching Tutorial](https://redis.io/docs/latest/develop/use/caching/) | [PostgreSQL pgvector README](https://github.com/pgvector/pgvector) |
| Fri-Sat | [BullMQ Docs - Delayed Jobs](https://docs.bullmq.io/guide/jobs/delayed) | [BullMQ Docs - Parent-Child Relations (Flows)](https://docs.bullmq.io/guide/flows) |
