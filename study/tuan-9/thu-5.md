# Project Delivery Ticket: Map operational concerns into Gateway/Identity/Catalog/Booking/Worker release

- **Tuần**: 9
- **Ngày**: Thứ 5
- **Issue**: [#44](https://github.com/vanphutin/education-backend/issues/44)
- **Giai đoạn**: Project Delivery

## Required Reading

- **Cơ bản/Trung bình:** [Kubernetes Docs - Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/)
- **Nâng cao:** [Google SRE Book - Handling Overload](https://sre.google/sre-book/handling-overload/)

## Microservice Scope

- Write one topology diagram with every process, database, queue/provider dependency and ownership.
- Define propagation of request/trace/event IDs, timeout/retry owner, health/readiness semantics and failure behavior for every hop.
- Record deployment/migration order and compatibility windows; rollback must not assume cross-service schema rollback is safe.

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
- Question: Log gì để debug mà không lộ dữ liệu?
- My answer:
  - ...
