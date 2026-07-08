# Definition of Done V2 - Backend Delivery Standard

Một task không được xem là Done chỉ vì code chạy trên máy cá nhân. Done nghĩa là người khác có thể review, chạy lại, kiểm chứng và hiểu quyết định kỹ thuật của bạn.

---

## 1. Theory Sprint Done (Thứ 2-4)

- [ ] Có learning objectives rõ cho buổi học.
- [ ] Có core concepts và giải thích bằng lời của người học.
- [ ] Có concept map, bảng so sánh hoặc sequence/state diagram nếu chủ đề phù hợp.
- [ ] Có mini lab hoặc ví dụ code nhỏ kiểm chứng lý thuyết.
- [ ] Có mục "Project Bridge": kiến thức này dùng ở đâu trong Movie Ticket Booking.
- [ ] Có câu trả lời interview drill.
- [ ] Không chỉ dán link docs hoặc copy định nghĩa.

---

## 2. Project Mapping Sprint Done (Thứ 5-7)

- [ ] Có business scenario rõ: actor nào, cần làm gì, vì sao cần.
- [ ] Có API contract hoặc design note trước khi code nếu task thay đổi behavior.
- [ ] Có edge cases và failure cases.
- [ ] Có implementation bám đúng module boundary.
- [ ] Có validation/error handling phù hợp.
- [ ] Có ít nhất một loại verification: unit test, e2e, curl, Swagger hoặc log.
- [ ] Có evidence gắn vào PR/study note.
- [ ] Có câu trả lời interview drill ngắn về tradeoff chính.

---

## 3. Backend Feature Done

- [ ] API endpoints có DTO validation.
- [ ] Error response thống nhất.
- [ ] Controller không chứa business logic nặng.
- [ ] Service/provider có trách nhiệm rõ.
- [ ] Nếu có DB change, phải có migration, không dùng `synchronize: true`.
- [ ] Constraint quan trọng được đặt ở DB khi cần bảo vệ dữ liệu.
- [ ] Swagger cập nhật.
- [ ] Có test cho happy path và ít nhất một edge case quan trọng.
- [ ] Có audit/integration log nếu feature là admin/payment/AI/job.

---

## 4. Database Done

- [ ] Có ERD hoặc schema note.
- [ ] Migration chạy được từ trạng thái clean DB.
- [ ] Seed idempotent nếu cần dữ liệu demo.
- [ ] Có foreign key/unique/not-null/check constraint phù hợp.
- [ ] Có index cho query chính và giải thích vì sao.
- [ ] Có evidence migration/seed/query.

---

## 5. Transaction/Critical Flow Done

Áp dụng cho seat hold, booking, payment confirm, ticket check-in.

- [ ] Có state machine hoặc sequence diagram.
- [ ] Có invariant được viết rõ, ví dụ: một showtime seat không thể active hold bởi hai customer.
- [ ] Có transaction hoặc locking strategy.
- [ ] Có test/evidence cho race/duplicate/replay case.
- [ ] Có audit log cho action quan trọng.
- [ ] Có rollback/error behavior rõ.

---

## 6. Payment Done

- [ ] Không hard-code secrets.
- [ ] Có `PaymentProvider` abstraction để mock/test.
- [ ] Tạo payment link lưu đủ metadata.
- [ ] Webhook verify signature.
- [ ] Webhook idempotent.
- [ ] Đối soát amount/orderCode/paymentLinkId.
- [ ] Replay webhook không tạo ticket trùng.
- [ ] Có integration logs.
- [ ] Có docs payOS flow.

---

## 7. AI Feature Done

- [ ] Có provider abstraction và mock provider trong test.
- [ ] Prompt/response schema được validate.
- [ ] AI không tự thay đổi core booking/payment.
- [ ] Admin/human approval trước khi apply content quan trọng.
- [ ] Có fallback khi provider timeout/error.
- [ ] Có AI request/integration logs.
- [ ] Không gửi dữ liệu nhạy cảm không cần thiết vào prompt.
- [ ] Có docs giải thích boundary AI.

---

## 8. PR Done

- [ ] PR nhỏ, scope rõ.
- [ ] Description nêu problem, solution, test, evidence.
- [ ] Không trộn refactor lớn với feature nếu không cần.
- [ ] Không để console/debug log bừa.
- [ ] Build/test pass.
- [ ] Reviewer có thể chạy lại theo hướng dẫn.

---

## 9. Weekly Milestone Done

- [ ] Thứ 2-4 có đủ theory notes/mini lab/interview answers.
- [ ] Thứ 5-7 có project mapping, implementation hoặc evidence.
- [ ] Weekly deliverables hoàn thành hoặc có lý do scope cut rõ.
- [ ] Có mentor review.
- [ ] Có backlog cập nhật cho tuần sau.
- [ ] Có mock interview hoặc written explanation cho chủ đề khó nhất tuần.
