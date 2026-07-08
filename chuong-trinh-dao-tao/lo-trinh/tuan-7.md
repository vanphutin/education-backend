# Tuần 7 - AI product workflow và admin operations

Tuần 7 làm như sprint thật: không thêm feature bừa, mà harden các luồng đã có và xây admin workflow có human approval cho AI.

---

## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Business goal | Admin dùng AI để draft nội dung phim nhưng con người duyệt trước khi apply; staff/admin có công cụ vận hành. |
| Engineering goal | Admin AI content draft, approval boundary, search filters, operational logs, hardening payment/AI. |
| System thinking | AI không được tự sửa dữ liệu production nếu chưa validate/approve; tách assistant khỏi core transaction. |
| Deliverables | 3-5 PR nhỏ, API docs, admin AI workflow, payment/AI hardening, demo evidence. |
| Interview focus | AI boundary, human-in-the-loop, operational debugging, PR slicing. |

---

## 2. Kế hoạch học tập theo ngày

Thứ 2-4 là theory sprint. Thứ 5-7 mới mapping vào project.

| Ngày | Loại buổi | Trọng tâm | Output bắt buộc |
|---|---|---|---|
| Thứ 2 | Theory sprint | Product operations: backlog triage, scope cut, PR slicing, reviewability | Sprint planning notes, issue slicing exercise |
| Thứ 3 | Theory sprint | AI product safety: schema validation, human approval, prompt/output boundary, fallback | AI boundary notes, invalid output handling plan |
| Thứ 4 | Theory sprint | Observability and hardening: integration logs, failure simulation, operational debugging | Failure-mode table, log/debug checklist |
| Thứ 5 | Project mapping | Map AI admin workflow and hardening gaps vào project hiện tại | Sprint board, admin AI design, hardening checklist |
| Thứ 6-7 | Project sprint | Implement admin AI draft/apply, failure handling, demo slice, mentor review | 3-5 PRs, demo script, failure simulation logs |

---

## 3. API scope tuần 7

```text
POST /admin/movies/:id/ai/content-draft
POST /admin/movies/:id/ai/trailer-description
POST /admin/movies/:id/ai-content/apply
GET /admin/integration-logs
GET /staff/showtimes/:id/check-ins
```

Stretch only if core is stable:

```text
POST /ai/chat/sessions
POST /ai/chat/sessions/:id/messages
GET /ai/chat/sessions/:id
```

---

## 4. Acceptance criteria

- [ ] Mỗi PR nhỏ, reviewable, có mục tiêu rõ.
- [ ] AI output phải validate trước khi lưu/apply.
- [ ] Admin approve trước khi content thay đổi.
- [ ] Provider failure không làm sập core booking.
- [ ] Integration logs đủ debug.
- [ ] Có demo script end-to-end.

---

## 5. Interview drill

- Vì sao AI nên nằm ngoài core booking/payment boundary?
- Human-in-the-loop cần ở điểm nào?
- Làm sao debug một lỗi webhook/payment ngoài production?
- Nếu AI trả JSON sai schema, backend nên xử lý thế nào?
