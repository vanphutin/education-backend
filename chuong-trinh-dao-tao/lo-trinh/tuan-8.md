# Tuần 8 - Cache, queue, payment/webhook integration và semantic search

**Giai đoạn:** Project Delivery  
**Chế độ học:** Async/integration theory + implement selected production features.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Hệ thống xử lý async/integration an toàn, không làm hỏng core booking khi provider lỗi. |
| Focus | Redis cache, BullMQ jobs, retry/timeout, payment provider abstraction, webhook idempotency, semantic search. |
| Project rule | Async/integration layer. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Cache deep dive: TTL, invalidation, cache-aside, stale data, when not to cache |
| Thứ 3 | Queue/job deep dive: BullMQ, retry, timeout, delayed jobs, idempotent handlers |
| Thứ 4 | Integration/AI: payment webhook, provider abstraction, embeddings, pgvector, mock provider |
| Thứ 5 | Map cache/jobs/payment/semantic search into Movie Ticket Booking safely |
| Thứ 6-7 | Implement expiry jobs, webhook replay safety, cache/search slice and integration logs |

## 3. Output bắt buộc

- Cache strategy
- Job design
- Webhook replay evidence
- Semantic search docs
- Integration logs

## 4. Interview drill

- Cache invalidation khó ở đâu?
- Job retry gây bug gì?
- Vì sao webhook phải idempotent?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [Redis Docs - Client-side Caching](https://redis.io/docs/latest/develop/reference/client-side-caching/) | [Redis Docs - Distributed Locks with Redis](https://redis.io/docs/latest/develop/use/patterns/distributed-locks/) |
| Tue | [BullMQ Docs - Introduction](https://docs.bullmq.io/guide/introduction) | [BullMQ Docs - Retrying Failing Jobs](https://docs.bullmq.io/guide/retrying-failing-jobs) |
| Wed | [Stripe Docs - Webhooks](https://docs.stripe.com/webhooks) | [OpenAI Docs - Embeddings](https://platform.openai.com/docs/guides/embeddings) |
| Thu | [Redis Docs - Caching Tutorial](https://redis.io/docs/latest/develop/use/caching/) | [PostgreSQL pgvector README](https://github.com/pgvector/pgvector) |
| Fri-Sat | [BullMQ Docs - Delayed Jobs](https://docs.bullmq.io/guide/jobs/delayed) | [BullMQ Docs - Parent-Child Relations (Flows)](https://docs.bullmq.io/guide/flows) |
