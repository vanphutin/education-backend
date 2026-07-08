# Tuần 4 - Auth, RBAC và seat holding transaction

---

## 1. Nội dung tổng quan

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Implement auth/RBAC và luồng giữ ghế an toàn bằng transaction. |
| **Lý thuyết** | Password hashing, JWT, refresh token, guard/decorator, RBAC, transaction, row lock, isolation. |
| **Thực hành (Lab)** | Register/login/refresh/logout. Roles Admin/Staff/Customer. Implement `POST /showtimes/:id/seat-holds` với transaction. |
| **Sản phẩm (Deliverable)** | PR `feat/auth-rbac-seat-hold`; RBAC matrix; unit test guard; test hold ghế đã bị giữ. |
| **Câu hỏi phỏng vấn (Interview drill)** | Làm sao chống hai user giữ cùng một ghế? Vì sao cần transaction? |

---

## 2. Kế hoạch học tập theo ngày

| Buổi | Trọng tâm | Tài liệu học tập |
|---|---|---|
| **Thứ 2** | Auth flow, JWT, password hashing | [NestJS authentication](https://docs.nestjs.com/security/authentication), [Passport JWT](https://www.passportjs.org/packages/passport-jwt/), [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) |
| **Thứ 3** | RBAC, guard, decorator | [NestJS authorization](https://docs.nestjs.com/security/authorization), [NestJS guards](https://docs.nestjs.com/guards), [NestJS custom decorators](https://docs.nestjs.com/custom-decorators) |
| **Thứ 4** | Transaction, row lock, isolation | [PostgreSQL transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html), [PostgreSQL isolation](https://www.postgresql.org/docs/current/transaction-iso.html), [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html) |
| **Thứ 5** | TypeORM transaction implementation | [TypeORM transactions](https://typeorm.io/transactions), [TypeORM EntityManager](https://typeorm.io/working-with-entity-manager) |
| **Thứ 6-7** | Test guard và seat hold edge cases | [NestJS testing](https://docs.nestjs.com/fundamentals/testing), [Jest mock functions](https://jestjs.io/docs/mock-functions) |

---

## 3. Các API & Transaction gợi ý

### APIs:
```text
POST /auth/register
POST /auth/login
POST /auth/refresh
POST /auth/logout
GET /me
PATCH /me/preferences
POST /showtimes/:id/seat-holds
DELETE /seat-holds/:id
```

### Hướng dẫn Transaction giữ ghế:
```text
BEGIN
SELECT showtime_seats ... FOR UPDATE
validate AVAILABLE or expired HELD
insert seat_hold
update showtime_seats = HELD
insert audit_log
COMMIT
```
