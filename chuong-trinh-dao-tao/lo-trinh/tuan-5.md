# Tuần 5 - Booking state machine, ticket, testing, CI và Docker

Tuần 5 nối seat hold thành flow đặt vé end-to-end, có state machine, ticket check-in, test và môi trường chạy được.

---

## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Business goal | Customer tạo booking từ seat hold, nhận ticket sau confirm mock; staff check-in ticket. |
| Engineering goal | Booking/ticket state machine, unit/e2e test, CI, Docker Compose, Swagger. |
| System thinking | Boundary giữa booking/payment/ticket, test pyramid, mock đúng boundary, deployability. |
| Deliverables | Booking APIs, ticket APIs, e2e happy path, Docker Compose, CI, README setup. |
| Interview focus | State machine, unit vs e2e, mocking boundary, CI/CD, Docker. |

---

## 2. Kế hoạch học tập theo ngày

Thứ 2-4 là theory sprint. Thứ 5-7 mới mapping vào project.

| Ngày | Loại buổi | Trọng tâm | Output bắt buộc |
|---|---|---|---|
| Thứ 2 | Theory sprint | State machine design: booking/payment/ticket/check-in states and transitions | State machine notes, invalid transition table |
| Thứ 3 | Theory sprint | Testing theory: test pyramid, unit vs integration vs e2e, mocking boundaries, Supertest | Test strategy notes, mock boundary examples |
| Thứ 4 | Theory sprint | CI/CD and Docker fundamentals: image, container, compose, env, reproducible setup | CI/Docker notes, compose architecture sketch |
| Thứ 5 | Project mapping | Map state machine/testing/CI/Docker vào Movie Booking flow | Booking/ticket design, e2e scenario, Docker/CI plan |
| Thứ 6-7 | Project sprint | Implement booking/ticket/check-in, e2e, CI, Docker, Swagger/README evidence | PR `feat/booking-ticket-testing-ci-docker`, e2e and Docker logs |

---

## 3. API scope tuần 5

```text
POST /bookings
GET /bookings/my
GET /bookings/:id
POST /bookings/:id/cancel
POST /bookings/:id/mock-confirm-payment
GET /tickets/my
GET /tickets/:id
GET /staff/tickets/:code
POST /staff/tickets/:id/check-in
```

---

## 4. Acceptance criteria

- [ ] Booking chỉ tạo từ active hold hợp lệ.
- [ ] Booking amount tính từ showtime seat snapshot.
- [ ] Ticket chỉ sinh sau confirmed booking.
- [ ] Staff check-in không cho check-in trùng.
- [ ] Có ít nhất một e2e happy path.
- [ ] CI chạy lint/test/build.
- [ ] Docker Compose chạy được app + Postgres + Redis.

---

## 5. Interview drill

- Vì sao booking cần state machine?
- Mock payment ở boundary nào là hợp lý?
- Unit test và e2e test nên chia trách nhiệm thế nào?
- Docker Compose giúp gì cho onboarding backend?
