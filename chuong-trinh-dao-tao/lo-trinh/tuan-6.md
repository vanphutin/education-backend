# Tuần 6 - Authentication, authorization, RBAC và security hardening

**Giai đoạn:** Project Delivery  
**Chế độ học:** Security theory + implement auth boundary.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Actors có quyền rõ ràng; API admin/staff/customer được bảo vệ. |
| Focus | Register/login, password hashing, JWT/refresh token, RBAC, guards, decorators, security baseline. |
| Project rule | Auth/RBAC implementation. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Auth deep dive: password hashing, token lifecycle, session/logout strategy |
| Thứ 3 | Authorization design: RBAC, permission matrix, least privilege, guard/decorator |
| Thứ 4 | Security hardening: validation, secrets, CORS, rate limit, sensitive logging |
| Thứ 5 | Map auth/RBAC into Movie Ticket Booking actors and protected APIs |
| Thứ 6-7 | Implement auth, RBAC, protected APIs and security evidence |

## 3. Output bắt buộc

- Auth flow
- RBAC matrix
- Security checklist
- Deny tests
- curl evidence

## 4. Interview drill

- Authentication khác authorization thế nào?
- Refresh token rotation giải quyết gì?
- Vì sao không log token/password?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [OWASP - Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | [RFC 7519 - JSON Web Token (JWT)](https://www.rfc-editor.org/rfc/rfc7519) |
| Tue | [OWASP - Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | [NIST SP 800-63B - Digital Identity Guidelines](https://pages.nist.gov/800-63-3/sp800-63b.html) |
| Wed | [OWASP - REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) | [OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/) |
| Thu | [NestJS Docs - Authentication](https://docs.nestjs.com/security/authentication) | [NestJS Docs - Authorization](https://docs.nestjs.com/security/authorization) |
| Fri-Sat | [OWASP - Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) | [RFC 9106 - Argon2 Memory-Hard Function](https://www.rfc-editor.org/rfc/rfc9106) |
