# Tuần 6 - Identity Service, Gateway auth context, RBAC và security hardening

**Giai đoạn:** Project Delivery  
**Nhịp học:** Security theory + implement auth boundary.

Register/login, password hashing, JWT/refresh token, RBAC, guards, decorators, security baseline.

Roadmap chi tiết: [chuong-trinh-dao-tao/lo-trinh/tuan-6.md](../../chuong-trinh-dao-tao/lo-trinh/tuan-6.md)

**Chuẩn job-ready bắt buộc:** [Identity/security playbook](job-ready-playbook.md) · [Executable tests tuần 5–10](../../labs/project-delivery/README.md)

## Daily tickets

- [Thứ 2 - Auth deep dive: password hashing, token lifecycle, session/logout strategy](thu-2.md) (Issue #26)
- [Thứ 3 - Authorization design: RBAC, permission matrix, least privilege, guard/decorator](thu-3.md) (Issue #27)
- [Thứ 4 - Security hardening: validation, secrets, CORS, rate limit, sensitive logging](thu-4.md) (Issue #28)
- [Thứ 5 - Map Identity → Gateway → service auth/RBAC and protected APIs](thu-5.md) (Issue #29)
- [Thứ 6-7 - Implement Identity Service, Gateway auth context and protected APIs](thu-6-7.md) (Issue #30)

> Scope: Identity là owner duy nhất của credential/session. Catalog và Booking không copy bảng user hoặc refresh token.
