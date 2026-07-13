# Project Delivery Ticket: Map Identity → Gateway → service auth/RBAC boundaries

- **Tuần**: 6
- **Ngày**: Thứ 5
- **Issue**: [#29](https://github.com/vanphutin/education-backend/issues/29)
- **Giai đoạn**: Project Delivery

## Required Reading

- **Cơ bản/Trung bình:** [NestJS Docs - Authentication](https://docs.nestjs.com/security/authentication)
- **Nâng cao:** [NestJS Docs - Authorization](https://docs.nestjs.com/security/authorization)

## Microservice Scope

- Identity Service is the credential/session owner. Gateway authenticates external calls and forwards only trusted actor context/claims according to a documented contract.
- Catalog/Booking must still enforce authorization for their own resource/action; a Gateway route guard is not object-level authorization for every service.
- Do not share Identity tables/database. Document token verification, claim freshness, key/secret rotation and downstream failure behavior.

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
- Question: Authentication khác authorization thế nào?
- My answer:
  - ...
