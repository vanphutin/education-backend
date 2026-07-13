# Tuần 7 - Booking Service: critical consistency, seat hold, ticket và idempotency

**Giai đoạn:** Project Delivery  
**Chế độ học:** Transaction/concurrency theory + implement critical flow.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Booking Service tự bảo vệ được invariant ghế/hold/booking/ticket trong database riêng, không cần transaction xuyên Catalog/Identity. |
| Focus | Booking-owned showtime seat snapshot, state machine, local transaction, row lock, constraints, idempotency, race tests, event consumer. |
| Project rule | Booking không query/join `catalog_db`; nó consume Catalog event idempotently và dùng snapshot tối thiểu. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Booking ownership and state machine: showtime event → seat snapshot → hold/booking/payment/ticket/check-in |
| Thứ 3 | Booking-local concurrency: race condition, row lock, isolation, deadlock, retry and snapshot freshness |
| Thứ 4 | Idempotency: duplicate command, client retry, event/webhook replay, inbox/outbox and unique key strategy |
| Thứ 5 | Map critical flow into Booking DB/API/local transaction; define Catalog event dependency and no-distributed-transaction rule |
| Thứ 6-7 | Implement Booking Service, event consumer, seat hold/booking/ticket/check-in and race/idempotency evidence |

## 3. Output bắt buộc
- Hoàn thành [Job-ready Booking consistency playbook](../../study/tuan-7/job-ready-playbook.md) và tests tuần 7 trong [`labs/project-delivery`](../../labs/project-delivery/README.md).

- Booking state diagrams and Catalog-to-Booking snapshot contract
- Booking-local transaction/inbox/outbox design
- Race test/logs and duplicate Catalog event evidence
- PostgreSQL concurrent test có exactly-one-winner và idempotency payload-conflict evidence.
- Gateway → Booking E2E flow without cross-DB access
- Audit/integration logs with event/request correlation

## 4. Interview drill

- Seat invariant thuộc service/database nào và vì sao?
- Catalog event đến trùng/chậm thì Booking snapshot bảo vệ command thế nào?
- Vì sao không dùng distributed transaction để confirm booking với payment/catalog?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [Martin Fowler - State Machine](https://martinfowler.com/bliki/StateMachine.html) | [PostgreSQL Docs - Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) |
| Tue | [PostgreSQL Docs - Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html) | [PostgreSQL Docs - MVCC](https://www.postgresql.org/docs/current/mvcc.html) |
| Wed | [Stripe Docs - Idempotent Requests](https://docs.stripe.com/api/idempotent_requests) | [RFC 9110 Section 9.2.2 - Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2) |
| Thu | [TypeORM Docs - Transactions](https://typeorm.io/transactions) | [Martin Fowler - Unit of Work](https://martinfowler.com/eaaCatalog/unitOfWork.html) |
| Fri-Sat | [NestJS Docs - Testing](https://docs.nestjs.com/fundamentals/testing) | [Stripe Engineering Blog - Designing Robust API Idempotency](https://stripe.com/blog/idempotency) |
