# Project Delivery Ticket: Implement Booking Service, seat hold/ticket and race/idempotency evidence

- **Tuần**: 7
- **Ngày**: Thứ 6-7
- **Issue**: [#35](https://github.com/vanphutin/education-backend/issues/35)
- **Giai đoạn**: Project Delivery

## Required Reading

- **Cơ bản/Trung bình:** [NestJS Docs - Testing](https://docs.nestjs.com/fundamentals/testing)
- **Nâng cao:** [Stripe Engineering Blog - Designing Robust API Idempotency](https://stripe.com/blog/idempotency)

## Microservice Scope

- Booking Service owns seat snapshots, holds, bookings, payment records and tickets in `booking_db`.
- Include an idempotent Catalog event consumer/inbox, a local transaction for hold/booking transition, and an outbox for downstream work.
- Race evidence must show two concurrent commands against Booking only; no cross-service lock or shared table is accepted as the consistency mechanism.

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
- Question: SELECT FOR UPDATE bảo vệ gì?
- My answer:
  - ...
