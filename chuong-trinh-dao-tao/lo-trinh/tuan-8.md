# Tuần 8 - Hardening, release, demo và interview

Tuần 8 đưa project vào trạng thái portfolio: chạy được, test được, demo được, giải thích được và có evidence đủ tin cậy.

---

## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Business goal | Project có thể demo cho nhà tuyển dụng như một backend sản phẩm thật. |
| Engineering goal | Regression, race-condition evidence, docs hoàn chỉnh, release note, interview prep. |
| System thinking | Biết tradeoff, giới hạn scope, rủi ro còn lại và cách vận hành/debug hệ thống. |
| Deliverables | Final README, Swagger, ERD, test output, Docker evidence, payOS/AI docs, mock interview notes. |
| Interview focus | 3-minute project pitch, deep dive transaction/payment/AI/test/system design. |

---

## 2. Kế hoạch học tập theo ngày

Thứ 2-4 là theory sprint. Thứ 5-7 mới mapping vào project.

| Ngày | Loại buổi | Trọng tâm | Output bắt buộc |
|---|---|---|---|
| Thứ 2 | Theory sprint | Release engineering: regression, scope cut, known limitations, versioning | Release checklist, risk register |
| Thứ 3 | Theory sprint | System design storytelling: architecture, state machines, data consistency, tradeoffs | 3-minute pitch draft, deep-dive notes |
| Thứ 4 | Theory sprint | Interview deep dive: transaction, webhook, AI search, testing, Docker, operations | Mock Q&A notes, weak-point list |
| Thứ 5 | Project mapping | Map final docs/evidence gaps vào release plan | Final evidence checklist, docs links, demo route |
| Thứ 6-7 | Project sprint | Final regression, Docker demo, release note, mock interview, mentor final review | Final README, release notes, demo script, interview evidence |

---

## 3. Optional stretch APIs

Chỉ làm nếu core đã ổn định:

```text
POST /movies/:id/reviews
GET /movies/:id/reviews
POST /admin/movies/:id/reviews/ai-summary
GET /movies/:id/review-summary
```

---

## 4. Acceptance criteria

- [ ] Fresh clone/setup chạy theo README.
- [ ] Swagger đủ các API chính.
- [ ] ERD và state machines có trong docs.
- [ ] Full test/build pass.
- [ ] Docker Compose demo pass.
- [ ] Có evidence race condition và webhook replay.
- [ ] Có demo script và project pitch.
- [ ] Người học giải thích được tradeoff chính.

---

## 5. Interview drill

- Trình bày project trong 3 phút.
- Giải thích seat hold transaction từ request đến DB lock.
- Giải thích payment webhook idempotency.
- Giải thích semantic search và vì sao cần mock provider trong test.
- Nếu được làm production thật, bạn sẽ cải thiện gì đầu tiên?
