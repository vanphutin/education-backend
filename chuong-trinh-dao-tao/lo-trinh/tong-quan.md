# Tổng quan lộ trình 10 tuần cường độ cao

Đừng học backend bằng cách học framework trước. Framework chỉ là công cụ. Backend thật sự nằm ở HTTP, API design, database, authentication, authorization, transaction, cache, queue, logging, monitoring, security, scalability và deployment. Framework có thể đổi; tư duy backend thì đi theo bạn cả sự nghiệp.

Khóa này cố tình đi ngược thói quen "mở framework lên rồi code CRUD". Ba tuần đầu là nền móng nặng: Thứ 2-4 học chuyên sâu, Thứ 5-7 làm mini labs tương ứng, chưa bắt đầu dự án thật. Bảy tuần sau mới dùng NestJS như công cụ để biến tư duy backend thành project thật.

## Nhịp học

| Giai đoạn | Tuần | Nhịp độ | Output |
|---|---:|---|---|
| Core theory + mini labs | 1-2 | 5-7 giờ/ngày | Thứ 2-4 theory deep dive, Thứ 5-7 mini labs |
| Deep foundation + mini labs | 3 | 5-7 giờ/ngày | DB/security/transaction/production theory và mini labs |
| Project delivery | 4-10 | 6-8 giờ/ngày | Code, tests, migrations, logs, Swagger/curl, PR/evidence |
| Capstone emphasis | 10 | 6-8 giờ/ngày | Final README, design doc, evidence pack, mock interview |

## Bản đồ 10 tuần

| Tuần | Giai đoạn | Chủ đề | Trọng tâm |
|---:|---|---|---|
| 1 | Core Theory + Mini Labs | Backend mindset, Internet, HTTP và API fundamentals | Backend mindset, client-server, DNS/TCP/TLS, HTTP, REST, status code, headers, cookies, CORS, API contract. |
| 2 | Core Theory + Mini Labs | TypeScript/OOP, NestJS mental model và backend code organization | TypeScript type system, OOP, composition, dependency injection, module boundary, controller/service/repository responsibility. |
| 3 | Deep Foundation + Mini Labs | Database, security, transaction và production thinking foundation | SQL modeling, constraints, indexes, transaction, auth/authz, cache/queue/logging/security/deploy overview. |
| 4 | Project Delivery | Project kickoff: API skeleton, public catalog và request pipeline | NestJS project setup, public APIs, validation, error contract, pagination, request id, Swagger. |
| 5 | Project Delivery | PostgreSQL implementation, migrations, indexes và query review | Entities, migrations, seed, ERD, constraints, index strategy, EXPLAIN, N+1 prevention. |
| 6 | Project Delivery | Authentication, authorization, RBAC và security hardening | Register/login, password hashing, JWT/refresh token, RBAC, guards, decorators, security baseline. |
| 7 | Project Delivery | Critical consistency: seat hold, booking, ticket và idempotency | State machine, transaction boundary, SELECT FOR UPDATE, unique constraints, idempotency, race tests. |
| 8 | Project Delivery | Cache, queue, payment/webhook integration và semantic search | Redis cache, BullMQ jobs, retry/timeout, payment provider abstraction, webhook idempotency, semantic search. |
| 9 | Project Delivery | Observability, monitoring mindset, resilience và deployment | Structured logging, correlation id, health/readiness, timeout/retry, rate limit, Docker/CI, deploy guide, runbook. |
| 10 | Capstone | System design capstone, final evidence và mock interview | System design doc, final README, ERD/state diagrams, test/evidence pack, load sanity, release notes, mock interview. |

## Rule mỗi ngày

- Học concept đủ sâu trước khi code.
- Viết lại bằng lời của mình.
- Làm lab nhỏ để kiểm chứng.
- Tuần 1-3 chỉ ghi "sau này áp dụng vào project ở đâu", không bắt đầu dự án thật.
- Với 7 tuần cuối, từ tuần 4 đến tuần 10, phải có evidence chạy được hoặc giải thích được.
