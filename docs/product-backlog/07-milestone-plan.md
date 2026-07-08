# 7. Milestone Plan — Roadmap 8 tuần cho Backend Fresher

---

## Tuần 1: Foundation + Public Catalog API

**Goals:**
- Khởi tạo NestJS project với TypeScript.
- Thiết lập module structure chuẩn.
- Implement Public Catalog APIs (movies, cinemas).
- Swagger/OpenAPI setup.

**Backlog items:** BL-001, BL-002, BL-003, BL-050 (Swagger setup)

**Deliverables:**
- [ ] NestJS project chạy được.
- [ ] GET `/movies`, `/movies/:id`, `/cinemas`, `/cinemas/:id` hoạt động.
- [ ] Swagger UI accessible.
- [ ] README cơ bản.
- [ ] ADR: lý do chọn NestJS, TypeORM/Prisma.

**Evidence:**
- Swagger UI screenshot.
- Curl response cho mỗi API.
- `npm run build` pass.
- PR description.

**Interview focus:** NestJS module/controller/provider pattern. Dependency Injection. REST API design principles.

---

## Tuần 2: Request Pipeline + Validation + Pagination + Logging

**Goals:**
- Global exception filter với error response format thống nhất.
- DTO validation (class-validator).
- Pagination helper.
- Request ID middleware.
- Structured logging.
- Complete Public APIs (showtimes, seat map).

**Backlog items:** BL-004, BL-005, BL-045, BL-046 (unit test foundation)

**Deliverables:**
- [ ] GET `/showtimes`, `/showtimes/:id`, `/showtimes/:id/seats` hoạt động.
- [ ] Error responses thống nhất format.
- [ ] DTO validation hoạt động (400 cho invalid input).
- [ ] Request ID trong response header + logs.
- [ ] Pagination hoạt động đúng.

**Evidence:**
- Curl test validation error → 400 response.
- Curl test pagination.
- Request ID trong response header.
- Unit test output.

**Interview focus:** Error handling strategy. Validation pipeline. Middleware vs Interceptor vs Guard vs Pipe. Request lifecycle NestJS.

---

## Tuần 3: Database Design + Migrations + Showtime Seat Snapshot

**Goals:**
- Thiết kế ERD hoàn chỉnh.
- Tạo migrations cho toàn bộ schema.
- Seed data cho demo.
- Implement Admin APIs: cinema, screen, seats, showtimes.
- Showtime seat snapshot logic.

**Backlog items:** BL-006, BL-007, BL-008, BL-009, BL-010, BL-011, BL-051, BL-052

**Deliverables:**
- [ ] ERD document.
- [ ] Migrations chạy từ clean DB.
- [ ] Seed data: movies, cinemas, screens, seats, showtimes.
- [ ] Admin CRUD APIs hoạt động.
- [ ] Showtime tạo → seat snapshot tự động.

**Evidence:**
- ERD diagram.
- Migration log output.
- Seed log output.
- Curl test Admin APIs.
- DB query: `SELECT COUNT(*) FROM showtime_seats WHERE showtime_id = ?`.

**Interview focus:** Database normalization. Constraints vs application validation. Migration strategy. Index design rationale. Snapshot pattern.

---

## Tuần 4: Auth + RBAC + Seat Hold Transaction

**Goals:**
- Implement Authentication (register, login, refresh, logout).
- RBAC Guard.
- **Seat hold với transaction + pessimistic locking.**
- Race condition testing.

**Backlog items:** BL-012, BL-013, BL-014, BL-015, BL-016, BL-017, BL-018

**Deliverables:**
- [ ] Auth flow hoàn chỉnh.
- [ ] RBAC chặn đúng role.
- [ ] Seat hold với `SELECT FOR UPDATE`.
- [ ] Race condition test: 2 concurrent requests cùng ghế.
- [ ] Lock strategy document.

**Evidence:**
- Curl auth flow.
- JWT payload decoded.
- RBAC deny test (customer access admin).
- **Race condition test output** — đây là evidence quan trọng nhất tuần.
- Lock strategy ADR.

**Interview focus:** JWT stateless vs stateful. Refresh token rotation security. Bcrypt. Transaction isolation levels. SELECT FOR UPDATE. Deadlock prevention. Race condition explanation.

---

## Tuần 5: Booking + Ticket + Testing + Docker + CI

**Goals:**
- Booking flow (create, cancel, history).
- Ticket generation + Staff check-in.
- Background job: expire seat hold, expire booking.
- Docker Compose setup.
- GitHub Actions CI.
- Unit test + E2E test.

**Backlog items:** BL-019, BL-020, BL-021, BL-022, BL-023, BL-024, BL-025, BL-026, BL-032, BL-046, BL-047, BL-048, BL-049

**Deliverables:**
- [ ] Booking flow hoàn chỉnh.
- [ ] Ticket generation khi booking CONFIRMED (mock confirm).
- [ ] Staff check-in hoạt động.
- [ ] BullMQ expire jobs hoạt động.
- [ ] Docker Compose chạy full stack.
- [ ] CI pipeline pass.
- [ ] E2E test cho auth + seat hold + booking.

**Evidence:**
- E2E test output.
- Docker compose up log.
- CI pipeline screenshot (green).
- State machine diagram (booking, payment).
- BullMQ job execution log.

**Interview focus:** State machine design. BullMQ architecture. Docker multi-stage build. CI pipeline design. Test pyramid. Mocking strategy.

---

## Tuần 6: payOS + Webhook + Jobs + Semantic Search

**Goals:**
- payOS payment link integration.
- Webhook processing + idempotency.
- AI semantic search (pgvector).
- Embedding generation pipeline.

**Backlog items:** BL-027, BL-028, BL-029, BL-030, BL-031, BL-033, BL-034, BL-035, BL-036

**Deliverables:**
- [ ] payOS payment link tạo thành công.
- [ ] Webhook verify signature + idempotent.
- [ ] Replay test: 5 webhooks → 1 processing.
- [ ] pgvector semantic search hoạt động.
- [ ] Mock embedding provider trong test.
- [ ] Integration logs cho payOS + AI.

**Evidence:**
- payOS checkoutUrl screenshot.
- Webhook replay test output.
- Idempotency evidence (ticket count after replay).
- Semantic search curl response.
- Integration log entries.

**Interview focus:** Payment integration architecture. Webhook security (signature). Idempotency design. Vector embeddings concept. pgvector cosine similarity. Provider abstraction pattern.

---

## Tuần 7: Admin AI Workflow + Hardening + Operations

**Goals:**
- Admin AI content draft/apply workflow.
- Audit logging hoàn chỉnh.
- Integration logging hoàn chỉnh.
- Security hardening review.
- Error handling completeness.

**Backlog items:** BL-037, BL-038, BL-039, BL-040, BL-041, BL-042, BL-043, BL-044

**Deliverables:**
- [ ] AI content draft → Apply/Reject flow.
- [ ] Human approval enforced.
- [ ] Audit logs cho tất cả critical actions.
- [ ] Integration logs cho payOS + AI.
- [ ] Admin query logs APIs.
- [ ] Security checklist passed.

**Evidence:**
- AI draft/apply curl flow.
- AI request log entries.
- Audit log entries.
- Security checklist.
- Demo slice: end-to-end flow video/screenshots.

**Interview focus:** AI safety boundaries. Human-in-the-loop design. Audit trail importance. Structured logging. Observability principles.

---

## Tuần 8: Release + Regression + Demo + Interview Evidence

**Goals:**
- Regression testing toàn bộ.
- Fix remaining bugs.
- Release notes v1.0.0.
- README portfolio hoàn chỉnh.
- Interview preparation.
- Final demo.

**Backlog items:** BL-053, BL-054, BL-055

**Deliverables:**
- [ ] Tất cả tests pass.
- [ ] Docker compose up từ zero → full demo flow.
- [ ] Release notes v1.0.0.
- [ ] README portfolio.
- [ ] Interview notes: 3-minute pitch + deep-dive Q&A.
- [ ] Evidence pack hoàn chỉnh.

**Evidence:**
- Full test output.
- Docker demo log.
- Release notes document.
- README (đủ cho reviewer hiểu trong 5 phút).
- Interview notes.

**Interview focus:** System design storytelling. Trade-off explanation. What would you do differently. Scaling considerations. Production readiness assessment.

---

## Tổng hợp Milestone

| Tuần | Epic chính | Backlog items | Độ khó | Focus |
|:---:|---|---|:---:|---|
| 1 | Epic 1 | BL-001→003, BL-050 | ⭐⭐ | Foundation |
| 2 | Epic 1 (cont.) | BL-004→005, BL-045 | ⭐⭐ | Pipeline |
| 3 | Epic 2 | BL-006→011, BL-051→052 | ⭐⭐⭐ | Database |
| 4 | Epic 3, 4 | BL-012→018 | ⭐⭐⭐⭐⭐ | **Auth + Concurrency** |
| 5 | Epic 5, 8, 12 | BL-019→026, BL-032, BL-046→049 | ⭐⭐⭐⭐ | Booking + Infra |
| 6 | Epic 6, 7, 9 | BL-027→031, BL-033→036 | ⭐⭐⭐⭐⭐ | **Payment + AI** |
| 7 | Epic 10, 11 | BL-037→044 | ⭐⭐⭐ | Operations |
| 8 | Epic 12 | BL-053→055 | ⭐⭐ | Release |
