# Tuần 7 - Critical consistency: seat hold, booking, ticket và idempotency

**Giai đoạn:** Project Delivery  
**Chế độ học:** Transaction/concurrency theory + implement critical flow.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Không double-booking, không duplicate ticket, không check-in trùng. |
| Focus | State machine, transaction boundary, SELECT FOR UPDATE, unique constraints, idempotency, race tests. |
| Project rule | Core booking flow. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | State machine: seat hold, booking, payment, ticket, check-in transitions |
| Thứ 3 | Concurrency deep dive: race condition, row lock, isolation, deadlock, retry |
| Thứ 4 | Idempotency: duplicate request, client retry, webhook replay, unique key strategy |
| Thứ 5 | Map critical flow into DB/API/service transaction boundary |
| Thứ 6-7 | Implement seat hold, booking, ticket, check-in and race/idempotency evidence |

## 3. Output bắt buộc

- State diagrams
- Transaction design
- Race test/logs
- E2E flow
- Audit logs

## 4. Interview drill

- Invariant quan trọng nhất của seat hold là gì?
- SELECT FOR UPDATE bảo vệ gì?
- Client retry sau timeout xử lý thế nào?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [Martin Fowler - State Machine](https://martinfowler.com/bliki/StateMachine.html) | [PostgreSQL Docs - Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) |
| Tue | [PostgreSQL Docs - Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html) | [PostgreSQL Docs - MVCC](https://www.postgresql.org/docs/current/mvcc.html) |
| Wed | [Stripe Docs - Idempotent Requests](https://docs.stripe.com/api/idempotent_requests) | [RFC 9110 Section 9.2.2 - Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2) |
| Thu | [TypeORM Docs - Transactions](https://typeorm.io/transactions) | [Martin Fowler - Unit of Work](https://martinfowler.com/eaaCatalog/unitOfWork.html) |
| Fri-Sat | [NestJS Docs - Testing](https://docs.nestjs.com/fundamentals/testing) | [Stripe Engineering Blog - Designing Robust API Idempotency](https://stripe.com/blog/idempotency) |
