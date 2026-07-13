# Project Delivery Ticket: Implement Catalog migrations, queries, outbox and query-plan evidence

- **Tuần**: 5
- **Ngày**: Thứ 6-7
- **Issue**: [#25](https://github.com/vanphutin/education-backend/issues/25)
- **Giai đoạn**: Project Delivery

## Required Reading

- **Cơ bản/Trung bình:** [TypeORM Docs - Relations](https://typeorm.io/relations)
- **Nâng cao:** [PostgreSQL Docs - Performance Tips](https://www.postgresql.org/docs/current/performance-tips.html)

## Microservice Scope

- Catalog service runs its own migration/seed command against `catalog_db`; prove a clean environment can start without Booking/Identity database access.
- Add an outbox record atomically when a publishable showtime changes. A relay may be stubbed this week, but event schema and retry/idempotency assumptions must be documented.
- Verify public query routes through Gateway and keep query-plan evidence service-local.

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
- Question: Migration production cần tránh gì?
- My answer:
  - ...
