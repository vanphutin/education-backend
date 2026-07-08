# 3. MVP Scope

---

## 3.1. In Scope (Bắt buộc trong MVP)

Các tính năng sau đây **phải có** trong phiên bản MVP. Không được cắt giảm.

### Public Catalog
- Danh sách phim với filter theo genre, status (NOW_SHOWING / COMING_SOON).
- Chi tiết phim, trailer đã published.
- Danh sách rạp và chi tiết rạp.
- Danh sách suất chiếu theo phim/rạp/ngày.
- Seat map realtime với trạng thái ghế (AVAILABLE / HELD / SOLD).

### Authentication & Authorization
- Đăng ký customer (email + password).
- Đăng nhập trả JWT access token + refresh token.
- Refresh token rotation.
- Logout (revoke refresh token).
- RBAC guard: Guest / Customer / Staff / Admin.
- Password hashing bằng bcrypt.

### Seat Hold & Booking
- Customer giữ một hoặc nhiều ghế cho suất chiếu (seat hold).
- Concurrency control bằng `SELECT ... FOR UPDATE` — chống double-booking.
- Seat hold tự động hết hạn sau 5 phút (configurable).
- Tạo booking từ seat hold còn hiệu lực.
- Booking tự động expire nếu không thanh toán trong 15 phút.
- Hủy booking (nếu còn ở PENDING_PAYMENT).

### Payment Integration
- Tạo payOS payment link cho booking.
- Nhận và xử lý payOS webhook.
- Verify webhook signature.
- Idempotent webhook processing.
- Đối soát amount/orderCode/paymentLinkId.
- Khi payment PAID: booking → CONFIRMED, showtime_seats → SOLD, tạo tickets.

### Ticket & Check-in
- Tạo ticket tự động khi booking CONFIRMED.
- Customer xem danh sách vé và chi tiết vé.
- Staff tra cứu vé bằng ticket code.
- Staff check-in vé (chỉ cho suất chiếu đúng và chưa check-in).

### Admin Management
- CRUD phim (tạo, cập nhật).
- Quản lý trailer (cập nhật URL, publish/unpublish).
- CRUD rạp, phòng chiếu, layout ghế.
- Tạo suất chiếu (snapshot seat map từ screen seats).
- Cập nhật/hủy suất chiếu (không có booking CONFIRMED).
- Xem toàn bộ bookings và payments.
- Sync payment status thủ công.

### Background Jobs
- BullMQ job expire seat hold.
- BullMQ job expire pending booking.
- BullMQ job generate movie embeddings.
- Retry strategy + error logging cho mọi job.

### AI Semantic Search
- AI semantic movie search bằng natural language query.
- Movie embedding documents với pgvector.
- Mock embedding provider cho test/CI.
- Real embedding provider (OpenAI) cho demo.
- Admin rebuild embeddings (đơn lẻ + hàng loạt).

### Admin AI Content
- AI gợi ý synopsis, short description, tags cho phim.
- AI gợi ý mô tả trailer.
- Draft → Apply/Reject flow với human approval bắt buộc.
- AI request logging.

### Logging & Operations
- Audit log cho mọi hành động quan trọng (ai, làm gì, lúc nào).
- Integration log cho payOS và AI provider (request/response).
- Global error handling với error response format thống nhất.
- Request ID tracking xuyên suốt request lifecycle.

### Infrastructure
- Docker Compose cho full stack (app + PostgreSQL + Redis).
- GitHub Actions CI: lint → test → build.
- Swagger/OpenAPI documentation cho toàn bộ API.
- Database migrations (không dùng synchronize: true).
- Seed data cho demo.

---

## 3.2. Out of Scope (Không làm trong MVP)

Các tính năng sau đây **hoàn toàn không nằm trong phạm vi** dự án này:

| Tính năng | Lý do loại bỏ |
|---|---|
| Frontend / Mobile app | Dự án chỉ focus backend API |
| Email/SMS notification | Tăng complexity integration không cần thiết cho portfolio |
| Multiple payment gateways | Chỉ tích hợp payOS |
| User profile avatar upload | File upload không phải core business |
| Social login (Google, Facebook) | Chỉ cần email/password auth |
| Multi-language / i18n | API responses chỉ tiếng Anh/Việt cố định |
| Real-time WebSocket seat map | Polling seat map đủ cho MVP |
| Coupon / promotion / discount | Pricing logic đơn giản cho MVP |
| Microservices architecture | Monolith NestJS phù hợp cho learning |
| Kubernetes / cloud deployment | Docker Compose local đủ cho portfolio |
| Rate limiting nâng cao / WAF | Basic rate limiting nếu có, không cần WAF |
| Admin UI / dashboard | Chỉ có API, dùng Swagger/curl để demo |
| Reporting / analytics | Không phải core booking flow |
| Seat pricing tiers (VIP, Standard) | Giá đồng nhất cho MVP, mở rộng sau |
| Multi-cinema chain / franchise | Đơn giản hóa: một hệ thống rạp |

---

## 3.3. Stretch Goals (Làm nếu core ổn định)

Các tính năng chỉ triển khai khi **toàn bộ MVP đã hoàn thành, test pass, evidence đầy đủ**:

| # | Stretch Goal | Điều kiện tiên quyết | Giá trị portfolio |
|--:|---|---|---|
| S-1 | AI Recommendations (gợi ý phim theo mood, genre, lịch sử) | AI semantic search hoạt động | Cao — thể hiện AI integration depth |
| S-2 | AI Recommendation Feedback | AI Recommendations hoạt động | Trung bình — feedback loop |
| S-3 | AI Chat Sessions (tư vấn phim) | AI Recommendations hoạt động | Cao — conversational AI |
| S-4 | Movie Reviews (customer viết review) | Booking flow hoàn chỉnh | Trung bình — CRUD cơ bản |
| S-5 | AI Review Summary (AI tóm tắt reviews) | Movie Reviews + AI content flow | Cao — batch AI processing |
| S-6 | Customer movie preferences | Auth + profile hoàn chỉnh | Trung bình — personalization data |
| S-7 | Admin sync payment thủ công nâng cao | payOS integration ổn định | Thấp — edge case handling |
| S-8 | Seat pricing tiers (VIP, Standard, Couple) | Booking flow hoàn chỉnh | Trung bình — business logic complexity |

> **Nguyên tắc:** Stretch goal chỉ được bắt đầu khi tất cả backlog item Priority Must đã Done và có evidence đầy đủ. Không được hy sinh chất lượng core để làm stretch.
