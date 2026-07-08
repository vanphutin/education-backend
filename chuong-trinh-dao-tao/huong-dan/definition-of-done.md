# Tiêu chuẩn hoàn thành (Definition of Done) theo milestone

Tài liệu này đặc tả các tiêu chuẩn kỹ thuật bắt buộc phải đạt được trước khi đánh dấu một chức năng hoặc cột mốc là hoàn thành (Done).

---

## 1. Feature Backend (Tổng quan)

- [ ] Các API endpoints phải có đầy đủ lớp validation đầu vào thông qua DTO (Data Transfer Object) và class-validator.
- [ ] Cấu trúc phản hồi lỗi (Error Response) phải thống nhất trên toàn hệ thống (sử dụng global Exception Filter).
- [ ] Phải cung cấp tập tin migration SQL đầy đủ khi có thay đổi cấu trúc Database (không bật `synchronize: true` trong TypeORM ở production).
- [ ] Có đầy đủ Unit test và E2E test cho các nghiệp vụ cốt lõi (Core Business Logic) như auth, giữ ghế, booking.
- [ ] API được mô tả chi tiết bằng Swagger OpenAPI docs.
- [ ] Ghi đầy đủ Audit logs cho các hành động quản trị quan trọng (xóa showtime, cập nhật vai trò,...) và Integration logs khi gọi dịch vụ ngoài.

---

## 2. Dịch vụ thanh toán (Payment Feature)

- [ ] Không hard-code các thông tin bí mật (Client ID, API Key, Checksum Key) của payOS vào mã nguồn. Sử dụng config service đọc từ `.env`.
- [ ] Viết lớp trừu tượng (Abstraction/Interface Provider) cho Payment Service để dễ dàng chuyển đổi hoặc mock.
- [ ] Bắt buộc phải thực hiện verify signature cho payOS Webhook.
- [ ] Xử lý tính trùng lặp Webhook (Idempotency), tránh tạo vé trùng lặp hoặc cập nhật sai trạng thái.
- [ ] So sánh khớp chính xác số tiền (`amount`), mã hóa đơn (`orderCode`) và ID giao dịch (`paymentLinkId`) trước khi chuyển trạng thái thành công.
- [ ] Viết test suite giả lập (mock provider) cho cổng thanh toán.
- [ ] Tài liệu hóa hướng dẫn thanh toán và lưu ý sử dụng giao dịch thật giá trị nhỏ khi demo.

---

## 3. Dịch vụ AI (AI Feature)

- [ ] Sử dụng mock provider trong môi trường kiểm thử (Unit test/CI) để không phát sinh chi phí và tăng tốc độ test.
- [ ] Lưu đầy đủ AI request logs (Prompt, raw response, model name, tokens count, latency).
- [ ] Kết quả phản hồi từ AI phải đi qua lớp DTO validation trước khi lưu hoặc xử lý tiếp.
- [ ] Không gửi các dữ liệu nhạy cảm của hệ thống hoặc người dùng vào prompt của AI.
- [ ] Triển khai cơ chế xử lý lỗi và fallback khi AI provider bị lỗi/timeout (đảm bảo dịch vụ chính không bị sập).
- [ ] Tài liệu hóa cấu trúc prompt đầu vào và đầu ra mẫu.
- [ ] Tự động cập nhật hoặc đánh dấu thay đổi trạng thái của embeddings khi dữ liệu phim thay đổi.

---

## 4. Tìm kiếm ngữ nghĩa (Semantic Search)

- [ ] Triển khai migration kích hoạt extension `vector` trong PostgreSQL.
- [ ] Có bảng `movie_embedding_documents` để lưu trữ dữ liệu text profile và vector tương ứng.
- [ ] Sử dụng content hashing để phát hiện sự thay đổi nội dung phim, tránh tạo lại embedding trùng lặp vô ích.
- [ ] Thực hiện truy vấn độ tương đồng vector (Cosine similarity hoặc L2 distance).
- [ ] Cho phép kết hợp linh hoạt bộ lọc SQL truyền thống (ví dụ: suất chiếu ngày hôm nay, còn vé trống) song song với truy vấn vector.
- [ ] Có unit test với mock embedding vector.
- [ ] Tài liệu giải thích và so sánh hiệu quả giữa Tìm kiếm từ khóa (Keyword search) và Tìm kiếm ngữ nghĩa (Semantic search).
