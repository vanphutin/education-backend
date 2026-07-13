# Project Delivery Ticket: Implement service hardening, health/trace smoke tests and runbooks

- **Tuần**: 9
- **Ngày**: Thứ 6-7
- **Issue**: [#45](https://github.com/vanphutin/education-backend/issues/45)
- **Giai đoạn**: Project Delivery

## Required Reading

- **Cơ bản/Trung bình:** [Docker Docs - Compose](https://docs.docker.com/compose/)
- **Nâng cao:** [GitHub Actions Docs](https://docs.github.com/en/actions)

## Microservice Scope

- Compose/CI starts Gateway, Identity, Catalog, Booking, Worker and their isolated dependencies/configuration.
- Add health/readiness per process, traceable smoke test across Gateway → service and one event/worker path, plus a service-down/degraded case.
- Produce a runbook per failure domain: gateway upstream unavailable, database unavailable, event backlog/DLQ, provider webhook failure, secret/config failure.

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
- Question: Retry khi nào nguy hiểm?
- My answer:
  - ...
