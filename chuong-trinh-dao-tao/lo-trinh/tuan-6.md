# Tuần 6 - payOS, background jobs, AI semantic search và embeddings

---

## 1. Nội dung tổng quan

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Tích hợp external system thật: payOS payment, webhook, background job expire hold, AI semantic search bằng pgvector. |
| **Lý thuyết** | Payment link, webhook, signature verification, idempotency, queue/job, retry/timeout, embeddings, vector similarity, pgvector. |
| **Thực hành (Lab payment)** | Tạo payOS payment link, lưu payment metadata, webhook verify, idempotent confirm booking. |
| **Thực hành (Lab jobs)** | BullMQ expire seat hold, expire pending booking, integration logs. |
| **Thực hành (Lab AI)** | Tạo `movie_embedding_documents`, mock embedding provider, pgvector migration, semantic search API. |
| **Sản phẩm (Deliverable)** | PR `feat/payos-jobs-ai-semantic-search`; docs payOS flow; docs AI search; tests mock provider. |
| **Câu hỏi phỏng vấn (Interview drill)** | Webhook idempotency là gì? Embedding search khác keyword search thế nào? |

---

## 2. Kế hoạch học tập theo ngày

| Buổi | Trọng tâm | Tài liệu học tập |
|---|---|---|
| **Thứ 2** | payOS payment link và SDK | [payOS bắt đầu](https://payos.vn/docs/), [payOS API](https://payos.vn/docs/api/), [payOS NodeJS SDK](https://payos.vn/docs/sdks/back-end/node/) |
| **Thứ 3** | Webhook, idempotency, payment safety | [payOS API](https://payos.vn/docs/api/), [payOS môi trường test](https://payos.vn/docs/moi-truong-test/), [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x00-header/) |
| **Thứ 4** | BullMQ, Redis, background job | [NestJS queues](https://docs.nestjs.com/techniques/queues), [BullMQ guide](https://docs.bullmq.io/), [Redis docs](https://redis.io/docs/latest/) |
| **Thứ 5** | Embeddings và pgvector | [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings), [pgvector](https://github.com/pgvector/pgvector), [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html) |
| **Thứ 6-7** | Semantic search API và mock provider test | [OpenAI API docs](https://platform.openai.com/docs/), [TypeORM query builder](https://typeorm.io/select-query-builder), [Jest mock functions](https://jestjs.io/docs/mock-functions) |

---

## 3. Các API & Migrations tuần 6

### APIs:
```text
POST /bookings/:id/payments/payos
POST /webhooks/payos
GET /payments/:id
POST /admin/payments/:id/sync
POST /ai/movie-search
POST /ai/recommendations
POST /ai/recommendations/feedback
POST /admin/movies/:id/embeddings/rebuild
POST /admin/ai/embeddings/rebuild
GET /admin/ai/logs
```

### Migrations:
```text
CREATE EXTENSION IF NOT EXISTS vector;
movie_embedding_documents
ai_request_logs
ai_recommendation_feedback
integration_logs
```
