# Evidence Portfolio V2

Cuối khóa, repo phải chứng minh được bạn không chỉ học để biết mà đã xây một backend có thể review như sản phẩm thật.

---

## 1. Evidence bắt buộc

| STT | Evidence | Nội dung | Vị trí khuyến nghị |
|---:|---|---|---|
| 1 | README Portfolio | Setup, architecture, core flows, screenshots/logs, tech highlights | `README.md` |
| 2 | API Docs | Swagger/OpenAPI và mô tả endpoint chính | Swagger UI, `docs/api/` |
| 3 | ERD & DB Notes | ERD, constraints, indexes, migration notes | `docs/db/erd.md` |
| 4 | State Machines | Seat hold, booking, payment, ticket check-in | `docs/design/state-machines.md` |
| 5 | Race-condition Evidence | Double seat hold test/log, lock strategy | `docs/evidence/seat-race-condition.md` |
| 6 | Test Output | Unit/e2e/build/coverage logs | `docs/evidence/test-output.md` |
| 7 | Docker Demo | Clean setup bằng Docker Compose | `docs/evidence/docker-compose-demo.md` |
| 8 | payOS Flow | Payment link, webhook verify, idempotency, replay handling | `docs/integrations/payos-flow.md` |
| 9 | AI Search Design | Embedding documents, pgvector query, SQL filters, mock provider | `docs/ai/semantic-search.md` |
| 10 | AI Admin Workflow | Draft/validate/apply boundary, human approval | `docs/ai/admin-content-workflow.md` |
| 11 | Integration Logs | Ví dụ log payOS/AI/job failure và cách debug | `docs/evidence/integration-logs.md` |
| 12 | Release Notes | Scope hoàn thành, known limitations, future improvements | `docs/release/v1.0.0.md` |
| 13 | Interview Notes | 3-minute pitch và deep-dive Q&A | `docs/interview/backend-interview-notes.md` |

---

## 2. Evidence hằng ngày

Mỗi ngày nên có tối thiểu:

- Issue link hoặc task note.
- PR/commit link.
- Test/curl/Swagger/log.
- 3-5 dòng giải thích quyết định kỹ thuật.

---

## 3. Evidence không đạt

Không tính là evidence nếu chỉ có:

- Screenshot code editor.
- Link docs đã đọc.
- Ghi chú lý thuyết không mapping vào project.
- "Đã hiểu" nhưng không có log/test/API response.

---

## 4. Final demo path

Demo cuối khóa nên chạy theo flow:

```text
Fresh setup
-> seed data
-> guest search movie/showtime
-> customer login
-> hold seat
-> create booking
-> create payment link or mock confirm
-> webhook/payment confirm
-> ticket generated
-> staff check-in
-> semantic search
-> admin AI content draft and apply
```
