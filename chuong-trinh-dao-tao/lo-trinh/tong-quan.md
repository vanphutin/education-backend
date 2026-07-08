# Tổng quan lộ trình V2 - Movie Ticket Booking Backend

Khóa này không còn đi theo kiểu "đọc docs cho biết", nhưng cũng không bỏ qua lý thuyết. Từ  trở đi, mỗi tuần có hai nhịp rõ ràng:

```text
Thứ 2 -> Thứ 4: Theory sprint cường độ cao
Thứ 5 -> Thứ 7: Project mapping sprint trên Movie Ticket Booking
```

Đầu tuần học hết phần kiến thức trọng tâm của tuần đó, có ghi chú, câu hỏi kiểm tra và mini lab nhỏ. Cuối tuần mới dùng kiến thức đó để phân tích, thiết kế, implement, test và tạo evidence cho dự án Movie Ticket Booking.

Mục tiêu không phải là "biết NestJS", mà là xây được một backend có thể giải thích trước team lead, reviewer và nhà tuyển dụng.

---

## 1. Nguyên tắc 

Một tuần học phải đi qua flow:

```text
Theory sprint
-> concept map
-> mini lab / notes
-> project mapping
-> implementation
-> verification/evidence
-> interview explanation
```

Không tính là hoàn thành nếu chỉ đọc docs mà không có ghi chú/mini lab/câu trả lời kiểm tra. Cũng không tính là hoàn thành nếu code project chạy được nhưng không giải thích được lý thuyết phía sau.

---

## 2. Cường độ mặc định

| Loại ngày | Cường độ | Output bắt buộc |
|---|---:|---|
| Thứ 2-4 | 3-5 giờ/ngày | Theory notes, concept map, mini lab, câu hỏi kiểm tra |
| Thứ 5 | 3-5 giờ | Mapping lý thuyết vào Movie Ticket Booking, design/API/DB plan |
| Thứ 6-7 | 5-6 giờ | Implement, test, evidence, PR review, mock interview |
| Chủ nhật | 60-90 phút (Optional) | Weekly review, backlog triage, plan tuần sau (Không tính vào progress chính 40 tasks) |

Thứ 2-4 được phép tập trung học lý thuyết rất nặng. Nhưng mỗi buổi vẫn phải có output: ghi chú, sơ đồ, mini lab, hoặc câu trả lời interview drill.

---

## 3. Template thứ 2-4: Theory Sprint

```md
# Theory Sprint: <Chủ đề>

## 1. Learning Objectives
- Hôm nay phải hiểu được gì?
- Khái niệm nào là bắt buộc?

## 2. Core Concepts
- Concept:
- Why it matters:
- Common mistakes:

## 3. Mini Lab
- Mục tiêu lab:
- Code thử:
- Kết quả:

## 4. Project Bridge
- Kiến thức này sẽ dùng ở đâu trong Movie Ticket Booking?

## 5. Interview Drill
- Question:
- My answer:
```

---

## 4. Template thứ 5-7: Project Mapping Sprint

Từ thứ 5 đến thứ 7 mới chuyển sang daily delivery ticket:

```md
# Ticket: [Tên ticket]

## 1. Business Scenario
- Actor là ai?
- Người dùng/admin/staff cần làm việc gì?
- Tại sao hệ thống cần tính năng này?

## 2. System Analysis
- Input/output chính.
- State liên quan.
- Edge cases.
- Failure cases.
- Security hoặc data consistency risk.

## 3. Design Before Code
- API contract.
- DB impact.
- Service/module boundary.
- Transaction, permission, logging, validation concern.

## 4. Implementation Checklist
- [ ] ...

## 5. Verification
- Unit test.
- E2E/manual curl.
- Migration/test log.
- Swagger evidence.

## 6. Evidence
- PR:
- Issue:
- Logs/screenshots:

## 7. Interview Drill
- Giải thích tradeoff và lý do thiết kế.
```

---

## 5. Bản đồ 8 tuần theo flow dự án

| Tuần | Chủ đề  | Theory sprint thứ 2-4 | Project mapping thứ 5-7 |
|---:|---|---|---|
| 1 | Foundation, OOP, NestJS basics | HTTP/REST, TypeScript OOP, NestJS module/controller/provider/DI | Public catalog API, Swagger, README, ADR |
| 2 | Production API behavior | Node runtime, async, stream/buffer, request pipeline, validation/error/logging | Filter/pagination, request id, error contract, tests |
| 3 | Database design | SQL fundamentals, normalization, constraints, TypeORM, migration, index | ERD, migrations, seeds, showtime seat snapshot |
| 4 | Auth/RBAC/concurrency | Auth theory, JWT, password hashing, RBAC, transaction, lock, isolation | Auth APIs, RBAC guard, seat hold transaction, race evidence |
| 5 | Booking/testing/CI/Docker | State machine, test pyramid, mocking, CI, Docker fundamentals | Booking/ticket/check-in flow, e2e, CI, Docker Compose |
| 6 | Integration/async/AI search | Payment/webhook, idempotency, queue/job, embeddings, pgvector | payOS, BullMQ expiry, semantic search with mock provider |
| 7 | AI admin workflow/operations | AI boundaries, schema validation, human approval, observability, hardening | Admin AI draft/apply, failure handling, demo slice |
| 8 | Release/interview/system design | Release engineering, regression, portfolio docs, system design storytelling | Final demo, evidence pack, mock interview |

---

## 6. Chuẩn issue hằng ngày

Mỗi ngày nên tạo issue theo mẫu:

```md
## Problem
Mô tả business problem.

## Scope
- In:
- Out:

## Acceptance Criteria
- [ ] API contract rõ.
- [ ] Validation/error cases rõ.
- [ ] Test hoặc manual evidence có log.
- [ ] Docs/Swagger cập nhật nếu API thay đổi.

## Risks
- Data consistency:
- Security:
- Integration:
```

---

## 7. Chuẩn PR hằng ngày

Một PR tốt không chỉ có code. PR phải trả lời được:

- Tính năng này giải quyết business scenario nào?
- API contract thay đổi ra sao?
- DB/migration có ảnh hưởng dữ liệu cũ không?
- Edge cases nào đã xử lý?
- Test nào chứng minh behavior chính?
- Evidence nằm ở đâu?
- Có tradeoff nào cần reviewer biết không?

---

## 8. Chuẩn evidence

Tối thiểu mỗi ngày phải có một trong các loại evidence:

- Output `npm test`, `npm run test:e2e`, `npm run build`.
- Log migration/seed.
- Screenshot Swagger hoặc curl response.
- Link PR/commit.
- ADR ngắn cho quyết định kỹ thuật.
- Diagram state machine/sequence/ERD.

---

## 9. Tiêu chuẩn mentor review

Mentor không chấm theo số lượng docs đã đọc. Mentor chấm theo:

- Lý thuyết thứ 2-4 có nắm chắc không.
- Requirement có hiểu đúng không.
- Thiết kế có bám domain Movie Ticket Booking không.
- API có predictable và consistent không.
- DB có constraint để bảo vệ dữ liệu không.
- Transaction có bảo vệ invariant không.
- Test có bắt được bug thật không.
- Evidence có đủ để người khác verify không.
- Người học có giải thích được tradeoff không.

---

## 10. Cách dùng docs

Docs chỉ được dùng theo nguyên tắc:

```text
Gặp requirement -> cần quyết định kỹ thuật -> mở docs đúng phần -> áp dụng vào project -> ghi lại evidence.
```

Không học lan man. Nhưng trong theory sprint, phải học đủ sâu để cuối tuần mapping vào Movie Ticket Booking không bị hổng nền.
