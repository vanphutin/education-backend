# Project Delivery Ticket: Cross-service regression, failure drill, demo and mock interview

- **Tuần**: 10
- **Ngày**: Thứ 6-7
- **Issue**: [#50](https://github.com/vanphutin/education-backend/issues/50)
- **Giai đoạn**: Capstone

## Required Reading

- **Cơ bản/Trung bình:** [AWS Well-Architected Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html)
- **Nâng cao:** [Google SRE Book - Postmortem Culture](https://sre.google/sre-book/postmortem-culture/)

## Microservice Scope

- Regression includes Gateway routing, Identity auth, Catalog read/event, Booking local consistency, Worker replay and a failure drill for one unavailable dependency.
- Defend why the system has these boundaries, why it does not share a database and which service is deliberately not split further yet.
- Evidence includes service context, ownership matrix, event envelope/example, trace/log path and runbook result.

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
- Question: Nếu scale 10x thì nghẽn ở đâu?
- My answer:
  - ...
