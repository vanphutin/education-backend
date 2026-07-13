# Project Delivery Ticket: Implement Identity Service, Gateway auth context and protected service APIs

- **Tuần**: 6
- **Ngày**: Thứ 6-7
- **Issue**: [#30](https://github.com/vanphutin/education-backend/issues/30)
- **Giai đoạn**: Project Delivery

## Required Reading

- **Cơ bản/Trung bình:** [OWASP - Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- **Nâng cao:** [RFC 9106 - Argon2 Memory-Hard Function](https://www.rfc-editor.org/rfc/rfc9106)

## Microservice Scope

- Implement Identity as a separate deployable with its own persistence/config. Gateway validates/authenticates at edge; service validates actor context according to the chosen trust model.
- Show deny evidence for missing/invalid token, stale/insufficient role and object-level access. Logs must not expose password, refresh token or raw authorization header.
- Include a contract/rotation note: what happens when signing key or claim format changes while services are deployed independently?

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
- Question: Refresh token rotation giải quyết gì?
- My answer:
  - ...
