# 7. Milestone Plan - Roadmap 10 tuần cường độ cao

Đừng học backend bằng cách học framework trước. Framework chỉ là công cụ. Backend thật sự nằm ở HTTP, API design, database, authentication, authorization, transaction, cache, queue, logging, monitoring, security, scalability và deployment. Framework có thể đổi; tư duy backend thì đi theo bạn cả sự nghiệp.

Nhịp chính: tuần 1-3 chưa bắt đầu dự án thật; Thứ 2-4 học chuyên sâu, Thứ 5-7 làm mini labs tương ứng. Tuần 4-10 là 7 tuần vừa học topic mới vừa làm project.

## Tuần 1: Backend mindset, Internet, HTTP và API fundamentals

**Phase:** Core Theory + Mini Labs

**Mode:** Thứ 2-4 học chuyên sâu. Thứ 5-7 làm mini labs từ kiến thức Thứ 2-4. Chưa bắt đầu dự án thật.

**Focus:** Backend mindset, client-server, DNS/TCP/TLS, HTTP, REST, status code, headers, cookies, CORS, API contract.

**Outputs**
- [ ] Protocol notes
- [ ] HTTP/status-code decision table
- [ ] curl/Postman HTTP lab evidence
- [ ] API contract mini lab
- [ ] Interview answers

---

## Tuần 2: TypeScript/OOP, NestJS mental model và backend code organization

**Phase:** Core Theory + Mini Labs

**Mode:** Thứ 2-4 học chuyên sâu. Thứ 5-7 làm mini labs từ kiến thức Thứ 2-4. Chưa bắt đầu dự án thật.

**Focus:** TypeScript type system, OOP, composition, dependency injection, module boundary, controller/service/repository responsibility.

**Outputs**
- [ ] TypeScript notes
- [ ] OOP mini lab
- [ ] DI notes
- [ ] NestJS lifecycle diagram
- [ ] NestJS lifecycle mini lab
- [ ] Interview answers

---

## Tuần 3: Database, security, transaction và production thinking foundation

**Phase:** Deep Foundation + Mini Labs

**Mode:** Thứ 2-4 học chuyên sâu. Thứ 5-7 làm mini labs từ kiến thức Thứ 2-4. Chưa bắt đầu dự án thật.

**Focus:** SQL modeling, constraints, indexes, transaction, auth/authz, cache/queue/logging/security/deploy overview.

**Outputs**
- [ ] SQL/DB notes
- [ ] Schema and constraint mini lab
- [ ] Transaction/lock lab
- [ ] Security mini lab
- [ ] Production primitives lab notes

---

## Tuần 4: Project kickoff: API skeleton, public catalog và request pipeline

**Phase:** Project Delivery

**Mode:** Học mới buổi đầu tuần, áp dụng ngay vào project cuối tuần.

**Focus:** NestJS project setup, public APIs, validation, error contract, pagination, request id, Swagger.

**Outputs**
- [ ] Running NestJS app
- [ ] Public catalog API
- [ ] Swagger
- [ ] Error contract
- [ ] curl/log evidence

---

## Tuần 5: PostgreSQL implementation, migrations, indexes và query review

**Phase:** Project Delivery

**Mode:** DB theory nâng cao + implement schema thật.

**Focus:** Entities, migrations, seed, ERD, constraints, index strategy, EXPLAIN, N+1 prevention.

**Outputs**
- [ ] ERD
- [ ] Migrations
- [ ] Seed data
- [ ] Index notes
- [ ] EXPLAIN evidence

---

## Tuần 6: Authentication, authorization, RBAC và security hardening

**Phase:** Project Delivery

**Mode:** Security theory + implement auth boundary.

**Focus:** Register/login, password hashing, JWT/refresh token, RBAC, guards, decorators, security baseline.

**Outputs**
- [ ] Auth flow
- [ ] RBAC matrix
- [ ] Security checklist
- [ ] Deny tests
- [ ] curl evidence

---

## Tuần 7: Critical consistency: seat hold, booking, ticket và idempotency

**Phase:** Project Delivery

**Mode:** Transaction/concurrency theory + implement critical flow.

**Focus:** State machine, transaction boundary, SELECT FOR UPDATE, unique constraints, idempotency, race tests.

**Outputs**
- [ ] State diagrams
- [ ] Transaction design
- [ ] Race test/logs
- [ ] E2E flow
- [ ] Audit logs

---

## Tuần 8: Cache, queue, payment/webhook integration và semantic search

**Phase:** Project Delivery

**Mode:** Async/integration theory + implement selected production features.

**Focus:** Redis cache, BullMQ jobs, retry/timeout, payment provider abstraction, webhook idempotency, semantic search.

**Outputs**
- [ ] Cache strategy
- [ ] Job design
- [ ] Webhook replay evidence
- [ ] Semantic search docs
- [ ] Integration logs

---

## Tuần 9: Observability, monitoring mindset, resilience và deployment

**Phase:** Project Delivery

**Mode:** Operations theory + harden/deploy project.

**Focus:** Structured logging, correlation id, health/readiness, timeout/retry, rate limit, Docker/CI, deploy guide, runbook.

**Outputs**
- [ ] Log schema
- [ ] Health checks
- [ ] Rate limit/timeout policy
- [ ] Deploy guide
- [ ] Runbook evidence

---

## Tuần 10: System design capstone, final evidence và mock interview

**Phase:** Capstone

**Mode:** Final synthesis at maximum intensity.

**Focus:** System design doc, final README, ERD/state diagrams, test/evidence pack, load sanity, release notes, mock interview.

**Outputs**
- [ ] System design doc
- [ ] Final README
- [ ] Evidence pack
- [ ] Release notes
- [ ] Mock interview answers
