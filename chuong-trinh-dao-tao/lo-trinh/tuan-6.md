# Tuần 6 - Identity Service, Gateway auth context, RBAC và security hardening

**Giai đoạn:** Project Delivery  
**Chế độ học:** Security theory + implement auth boundary.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Identity Service sở hữu credential/token lifecycle; Gateway và downstream service nhận actor context đáng tin cậy, kiểm đúng authorization boundary. |
| Focus | Identity Service, password hashing, JWT/refresh token, RBAC, service trust, actor propagation, guards, security baseline. |
| Project rule | Không copy user/password table vào Catalog/Booking; downstream chỉ giữ claim/context tối thiểu cần thiết. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Identity ownership: password hash, token lifecycle, session/logout, JWKS or verification contract |
| Thứ 3 | Authorization across boundary: RBAC, permission matrix, actor/tenant context, Gateway vs service enforcement |
| Thứ 4 | Security hardening: secrets, CORS, rate limit, internal trust, sensitive logging, least privilege network/config |
| Thứ 5 | Map Identity → Gateway → Catalog/Booking authorization assumptions and deny scenarios |
| Thứ 6-7 | Implement Identity Service, Gateway auth middleware/guard, protected service APIs and security evidence |

## 3. Output bắt buộc
- Hoàn thành [Job-ready Identity playbook](../../study/tuan-6/job-ready-playbook.md) và tests tuần 6 trong [`labs/project-delivery`](../../labs/project-delivery/README.md).

- Auth/refresh flow with Identity as sole credential owner
- RBAC/object-authorization matrix including Gateway and downstream checks
- Internal actor-context/service-trust decision and security checklist
- Deny tests at Gateway and service boundary; curl/log evidence without token leakage
- Refresh rotation/reuse revocation, ownership/IDOR negative tests và permission matrix.

## 4. Interview drill

- Gateway verify token rồi service có còn cần authorization không? Vì sao?
- Token claim nào có thể stale và service xử lý freshness thế nào?
- Vì sao không được share Identity database cho tiện lookup user?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [OWASP - Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | [RFC 7519 - JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519) |
| Tue | [OWASP - Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | [NIST SP 800-63B - Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html) |
| Wed | [OWASP - REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) | [OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/) |
| Thu | [NestJS Docs - Authentication](https://docs.nestjs.com/security/authentication) | [NestJS Docs - Authorization](https://docs.nestjs.com/security/authorization) |
| Fri-Sat | [OWASP - Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) | [RFC 9106 - Argon2 Memory-Hard Function](https://www.rfc-editor.org/rfc/rfc9106) |
