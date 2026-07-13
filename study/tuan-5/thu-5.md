# Project Delivery Ticket: Map Catalog DB into Gateway APIs and showtime event contract

- **Tuần**: 5
- **Ngày**: Thứ 5
- **Issue**: [#24](https://github.com/vanphutin/education-backend/issues/24)
- **Giai đoạn**: Project Delivery

## Required Reading

- **Cơ bản/Trung bình:** [TypeORM Docs - Select Query Builder](https://typeorm.io/select-query-builder)
- **Nâng cao:** [PostgreSQL Docs - Indexes and ORDER BY](https://www.postgresql.org/docs/current/indexes-ordering.html)

## Microservice Scope

- All migrations and entities in this ticket belong only to `catalog-service` / `catalog_db`.
- Admin writes to Catalog; Gateway never executes Catalog SQL and Booking never reads the tables directly.
- Define `catalog.showtime.published.v1` and `catalog.showtime.cancelled.v1`: event ID, version, payload minimum, producer transaction/outbox and consumer expectation.
- Record what Booking must snapshot later, without creating cross-service FK or distributed transaction.

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
- Question: Index khi nào làm chậm write?
- My answer:
  - ...
