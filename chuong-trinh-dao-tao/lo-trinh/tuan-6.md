# Tuần 6 - payOS, webhook idempotency, jobs và semantic search

Tuần 6 đưa hệ thống ra khỏi vùng "core CRUD": tích hợp external payment, xử lý webhook, job nền và AI search nhưng vẫn bảo vệ core booking.

---

## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Business goal | Customer thanh toán bằng payOS; hệ thống tự expire hold/booking; guest tìm phim bằng ngôn ngữ tự nhiên. |
| Engineering goal | Payment provider abstraction, webhook verification, idempotency, BullMQ jobs, pgvector semantic search. |
| System thinking | Integration boundary, retry/timeout, provider failure, idempotency key, async consistency. |
| Deliverables | payOS flow docs, webhook tests, BullMQ jobs, integration logs, semantic search mock provider. |
| Interview focus | Webhook safety, idempotency, background jobs, embeddings, pgvector, fallback. |

---

## 2. Kế hoạch học tập theo ngày

Thứ 2-4 là theory sprint. Thứ 5-7 mới mapping vào project.

| Ngày | Loại buổi | Trọng tâm | Output bắt buộc |
|---|---|---|---|
| Thứ 2 | Theory sprint | Payment integration theory: provider abstraction, payment link, webhook, signature, idempotency | Payment flow diagram, idempotency notes, failure cases |
| Thứ 3 | Theory sprint | Async systems: Redis, BullMQ, retry, timeout, job idempotency, integration logs | Queue/job notes, retry risk analysis |
| Thứ 4 | Theory sprint | AI search theory: embeddings, vector similarity, pgvector, content hash, mock provider | Semantic vs keyword notes, embedding document design |
| Thứ 5 | Project mapping | Map payment/jobs/AI vào Movie Booking without breaking core booking | payOS design, job design, AI boundary, migration plan |
| Thứ 6-7 | Project sprint | Implement payOS, webhook replay safety, BullMQ expiry, semantic movie search | PR, webhook replay evidence, job logs, AI search tests |

---

## 3. API scope tuần 6

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
GET /admin/integration-logs
```

---

## 4. Acceptance criteria

- [ ] Payment provider có abstraction để mock/test.
- [ ] Webhook verify signature.
- [ ] Webhook idempotent, replay không tạo ticket trùng.
- [ ] Amount/orderCode/paymentLinkId được đối soát.
- [ ] Job expire hold/booking chạy được.
- [ ] AI provider có mock trong test.
- [ ] Semantic search không được can thiệp booking/payment core.
- [ ] Có integration logs cho payOS/AI.

---

## 5. Interview drill

- Webhook idempotency là gì?
- Vì sao không tin `returnUrl` làm nguồn xác nhận thanh toán?
- Job retry có thể gây bug gì nếu handler không idempotent?
- Embedding search khác keyword search thế nào?
