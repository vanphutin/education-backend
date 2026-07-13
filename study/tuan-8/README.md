# Tuần 8 - Outbox/worker, payment/webhook integration, cache và semantic search optional

**Giai đoạn:** Project Delivery  
**Nhịp học:** Async/integration theory + implement selected production features.

Redis cache, BullMQ jobs, retry/timeout, payment provider abstraction, webhook idempotency, semantic search.

Roadmap chi tiết: [chuong-trinh-dao-tao/lo-trinh/tuan-8.md](../../chuong-trinh-dao-tao/lo-trinh/tuan-8.md)

**Chuẩn job-ready bắt buộc:** [Reliable async playbook](job-ready-playbook.md) · [Executable tests tuần 5–10](../../labs/project-delivery/README.md)

## Daily tickets

- [Thứ 2 - Cache deep dive: TTL, invalidation, cache-aside, stale data, when not to cache](thu-2.md) (Issue #36)
- [Thứ 3 - Queue/job deep dive: BullMQ, retry, timeout, delayed jobs, idempotent handlers](thu-3.md) (Issue #37)
- [Thứ 4 - Integration/AI: payment webhook, provider abstraction, embeddings, pgvector, mock provider](thu-4.md) (Issue #38)
- [Thứ 5 - Map event ownership, worker/payment/cache/search into services safely](thu-5.md) (Issue #39)
- [Thứ 6-7 - Implement outbox relay, expiry/webhook safety, service-local cache and optional search](thu-6-7.md) (Issue #40)

> Semantic search là stretch trong Catalog Service; outbox/inbox/worker và payment replay safety là ưu tiên trước.
