# Tuần 4 - Auth, RBAC và seat hold concurrency

Tuần 4 là tuần bảo vệ invariant quan trọng nhất: một ghế trong một suất chiếu không thể bị giữ bởi hai khách cùng lúc.

---

## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Business goal | Customer đăng nhập và giữ ghế an toàn; Admin/Staff/Customer có quyền khác nhau. |
| Engineering goal | JWT auth, RBAC, guard/decorator, seat hold transaction, row lock, audit log. |
| System thinking | Phân tích state, race condition, isolation, lock, expired hold và security boundary. |
| Deliverables | Auth flow, RBAC matrix, seat hold API, double-hold test/evidence, audit log. |
| Interview focus | JWT, password hashing, RBAC, transaction, row lock, race condition. |

---

## 2. Kế hoạch học tập theo ngày

Thứ 2-4 là theory sprint. Thứ 5-7 mới mapping vào project.

| Ngày | Loại buổi | Trọng tâm | Output bắt buộc |
|---|---|---|---|
| Thứ 2 | Theory sprint | Auth fundamentals: password hashing, JWT, refresh token, session/logout, OWASP auth risks | Auth flow notes, token lifecycle diagram |
| Thứ 3 | Theory sprint | Authorization: RBAC, guards, decorators, permission matrix, least privilege | RBAC matrix draft, guard/decorator notes |
| Thứ 4 | Theory sprint | Transactions, isolation, row locks, race condition, state machines for seat hold | Seat hold invariant, lock strategy notes, race scenario explanation |
| Thứ 5 | Project mapping | Map auth/RBAC/transaction vào Movie Booking: actors, protected APIs, seat hold state | Final RBAC matrix, seat hold state diagram, transaction design |
| Thứ 6-7 | Project sprint | Implement auth, RBAC guards, transactional seat hold, race/security tests | PR `feat/auth-rbac-seat-hold`, auth curl, race evidence |

---

## 3. API scope tuần 4

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

---

## 4. Seat hold invariant

```text
For a showtime seat:
- AVAILABLE -> HELD when a valid customer holds it.
- HELD -> AVAILABLE when hold expires/cancels.
- HELD -> SOLD when booking/payment is confirmed.
- SOLD cannot go back to HELD.
```

Transaction sketch:

```text
BEGIN
SELECT showtime_seats ... FOR UPDATE
validate AVAILABLE or expired HELD
insert seat_hold
update showtime_seats = HELD
insert audit_log
COMMIT
```

---

## 5. Acceptance criteria

- [ ] Password được hash.
- [ ] Admin APIs có guard.
- [ ] RBAC matrix có trong docs.
- [ ] Seat hold chạy trong transaction.
- [ ] Có xử lý hold hết hạn.
- [ ] Có test/evidence chống double hold.
- [ ] Có audit log cho hành động quan trọng.

---

## 6. Interview drill

- Race condition trong giữ ghế xảy ra thế nào?
- `SELECT ... FOR UPDATE` khác SELECT thường ra sao?
- Nếu webhook payment đến sau khi hold hết hạn thì xử lý thế nào?
- RBAC khác permission-based access control ra sao?
