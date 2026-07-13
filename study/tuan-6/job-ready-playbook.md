# Tuần 6 Job-ready Playbook — Identity, session và authorization

## Outcome

Identity sở hữu credential/session; access token ngắn hạn, refresh rotation/revocation và authorization deny-by-default được kiểm chứng. Gateway xác thực edge nhưng downstream vẫn bảo vệ capability nhạy cảm.

## Daily depth

| Ngày | Trọng tâm | Failure lab | Evidence |
|---|---|---|---|
| Thứ 2 | password hash, session, access/refresh lifecycle | wrong password, expired/replayed refresh | rotation/revocation tests |
| Thứ 3 | RBAC/permission/resource ownership | missing role, privilege escalation, IDOR | deny matrix |
| Thứ 4 | secrets, CORS, rate limit, logging | token leakage, forged actor header | security negative tests |
| Thứ 5 | Identity → Gateway → service trust | invalid signature/stale claim | trust-boundary diagram |
| Thứ 6–7 | implement complete auth slice | logout/reuse/concurrent refresh | e2e + audit evidence |

## Required implementation

- Argon2/bcrypt parameters documented; password/token never logged.
- Refresh token stored hashed, bound to family/session; rotation and reuse detection.
- Stable deny response without leaking resource existence where sensitive.
- Permission matrix, ownership checks, admin/customer negative cases.
- Rate limit key/proxy assumption documented.
- Secret/config validation and redacted structured audit log.

## Hard gates

Fail nếu JWT payload được tin chỉ vì decode, actor context nhận trực tiếp từ Internet, logout không revoke session, hoặc chỉ test happy path.

Lab precursor: [`labs/project-delivery`](../../labs/project-delivery/README.md), tests tuần 6.

