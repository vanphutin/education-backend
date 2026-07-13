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
| 1 | Core Theory + Mini Labs | Backend mindset, Internet, HTTP và API fundamentals | System/boundary/failure thinking, problem decomposition, client-server, request lifecycle, DNS/TCP/TLS, HTTP semantics và contract-first API. |
| 2 | Core Theory + Mini Labs | TypeScript/OOP, NestJS mental model và backend code organization | Contract/invariant/state, TypeScript runtime boundary, domain modeling, cohesion/coupling, dependency direction, architecture/pattern reasoning và testing. |
| 3 | Deep Foundation + Mini Labs | Database, security, transaction và production thinking foundation | Data/invariant modeling, constraints/indexes, transaction/concurrency, threat model, delivery/idempotency, observability và deploy mental model. |
| 4 | Project Delivery | Gateway, Catalog Service và request pipeline | Monorepo/Compose, service boundary, API Gateway, public catalog contract, validation, request/trace ID, Swagger. |
| 5 | Project Delivery | Catalog database ownership, migrations, indexes và event publication | Catalog DB only, migrations/seed, ERD, constraints, index strategy, EXPLAIN, outbox `showtime.published`. |
| 6 | Project Delivery | Identity Service, Gateway auth context và security hardening | Password/token lifecycle, RBAC, service trust, gateway-to-service actor context, security baseline. |
| 7 | Project Delivery | Booking Service: seat hold, booking, ticket và idempotency | Booking-owned seat snapshot, local transaction, row lock/constraints, idempotency, race tests. |
| 8 | Project Delivery | Outbox/worker, payment/webhook, cache và semantic search optional | Relay, retries/DLQ, provider adapter, webhook idempotency; Catalog AI/search as optional stretch. |
| 9 | Project Delivery | Service observability, resilience và deployment | Cross-service logs/traces, health/readiness per service, timeout/retry, Compose/CI, deploy guide, runbook. |
| 10 | Capstone | Distributed system capstone, final evidence và mock interview | Service boundary/design doc, contract/event evidence, failure/load sanity, release notes, mock interview. |

## Rule mỗi ngày

- Học concept đủ sâu trước khi code.
- Viết lại bằng lời của mình.
- Làm lab nhỏ để kiểm chứng.
- Tuần 1-3 chỉ ghi "sau này áp dụng vào project ở đâu", không bắt đầu dự án thật.
- Với 7 tuần cuối, từ tuần 4 đến tuần 10, phải có evidence chạy được hoặc giải thích được.

## Cổng năng lực trước tuần 4

Trước khi bắt đầu project thật, người học phải dùng một bài toán mini độc lập để chứng minh rằng mình có thể:

- phân rã actor, outcome, input/output, assumption, invariant và failure case;
- vẽ sequence, state, ERD và module/dependency diagram ở mức đơn giản;
- viết API/error contract và giải thích idempotency, validation, pagination decision;
- tách pure business rule khỏi I/O/framework và lập unit/integration test matrix;
- chọn constraint/transaction/concurrency strategy từ invariant cần bảo vệ;
- so sánh hai phương án và nói rõ trade-off cùng điều kiện khiến quyết định thay đổi.

Checklist và mẫu trả lời chi tiết nằm tại [Tư duy code và mô hình hóa hệ thống](../huong-dan/tu-duy-code-va-mo-hinh.md).
