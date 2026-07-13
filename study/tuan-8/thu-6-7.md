# Project Delivery Ticket: Implement outbox relay, expiry/webhook safety, service-local cache and optional search

- **Tuần**: 8
- **Ngày**: Thứ 6-7
- **Issue**: [#40](https://github.com/vanphutin/education-backend/issues/40)
- **Giai đoạn**: Project Delivery

## Required Reading

- **Cơ bản/Trung bình:** [BullMQ Docs - Delayed Jobs](https://docs.bullmq.io/guide/jobs/delayed)
- **Nâng cao:** [BullMQ Docs - Parent-Child Relations (Flows)](https://docs.bullmq.io/guide/flows)

## Microservice Scope

- Relay Booking outbox and process delayed hold expiry/payment jobs with at-least-once semantics, inbox/dedup and bounded retry/DLQ.
- Payment webhook reaches a dedicated worker/adapter boundary, then performs an idempotent Booking-local transition; it never writes Catalog/Identity databases.
- Cache only Catalog read models or explicitly safe derived data. Add semantic search only as a Catalog-owned stretch slice.

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
- Question: Job retry gây bug gì?
- My answer:
  - ...
