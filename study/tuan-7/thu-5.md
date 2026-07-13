# Project Delivery Ticket: Map Catalog event → Booking DB/API/local transaction boundary

- **Tuần**: 7
- **Ngày**: Thứ 5
- **Issue**: [#34](https://github.com/vanphutin/education-backend/issues/34)
- **Giai đoạn**: Project Delivery

## Required Reading

- **Cơ bản/Trung bình:** [TypeORM Docs - Transactions](https://typeorm.io/transactions)
- **Nâng cao:** [Martin Fowler - Unit of Work](https://martinfowler.com/eaaCatalog/unitOfWork.html)

## Microservice Scope

- Booking consumes Catalog showtime events idempotently and creates a booking-owned snapshot before accepting hold commands.
- Hold/booking/payment record/ticket invariants are protected in one `booking_db` transaction. Do not query `catalog_db`, join across services or add a distributed transaction.
- Specify stale/missing snapshot behavior, event replay strategy, outbox record and external API error/retry semantics.

## 1. Business Scenario
- Actor:
- User story:
- Why it matters:

## 2. System Analysis
- Input:
- Output:
- State involved:
- Edge cases:
- Failure cases:
- Security/data consistency/performance risk:

## 3. Design Before Code
- API contract:
- DB impact:
- Module/service boundary:
- Validation/error behavior:
- Logging/audit/integration logs:
- Transaction/permission concern:

## 4. Implementation Checklist
- [ ] ...

## 5. Verification
- Unit test:
- E2E/manual curl:
- Swagger/API docs:
- Migration/seed:
- Build/lint:

## 6. Evidence
- Issue:
- PR/commit:
- Logs/screenshots:
- Docs/ADR:

## 7. Interview Drill
- Question: Invariant quan trọng nhất của seat hold là gì?
- My answer:
  - ...
