# Project Delivery Ticket: Map service events, worker/payment/cache/search boundaries safely

- **Tuần**: 8
- **Ngày**: Thứ 5
- **Issue**: [#39](https://github.com/vanphutin/education-backend/issues/39)
- **Giai đoạn**: Project Delivery

## Required Reading

- **Cơ bản/Trung bình:** [Redis Docs - Caching Tutorial](https://redis.io/docs/latest/develop/use/caching/)
- **Nâng cao:** [PostgreSQL pgvector README](https://github.com/pgvector/pgvector)

## Microservice Scope

- Map every cache to its service-local source of truth; do not make Redis the owner of Booking seat state.
- Map Booking outbox → worker/payment provider and Catalog outbox → embedding worker separately. Each has a versioned event, retry/idempotency/DLQ policy and correlation fields.
- Semantic search belongs to Catalog and remains optional until hold expiry, payment webhook and duplicate delivery evidence pass.

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
- Question: Cache invalidation khó ở đâu?
- My answer:
  - ...
