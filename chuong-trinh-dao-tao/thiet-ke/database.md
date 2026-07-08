# Cấu trúc Database & State Machines

Tài liệu này đặc tả thiết kế các bảng (Entities) trong cơ sở dữ liệu PostgreSQL và các trạng thái chuyển đổi (State Machines) của nghiệp vụ đặt vé.

---

## 1. Danh sách Entities

### Core Entities (Nghiệp vụ cốt lõi)

| Entity | Trách nhiệm |
|---|---|
| `users` | Thông tin tài khoản Customer/Admin/Staff |
| `roles` | Phân quyền: Role và permission tương ứng |
| `refresh_tokens` | Quản lý refresh token (hash, trạng thái thu hồi, ngày hết hạn) |
| `movies` | Thông tin chi tiết phim (Tiêu đề, tóm tắt, đạo diễn, diễn viên,...) |
| `movie_trailers` | Đường dẫn trailer URL và metadata (không tạo video AI) |
| `cinemas` | Thông tin hệ thống rạp |
| `screens` | Thông tin các phòng chiếu trực thuộc rạp |
| `seats` | Danh sách ghế cố định thuộc một phòng chiếu |
| `showtimes` | Suất chiếu phim (Movie, screen, start/end time, pricing) |
| `showtime_seats` | Trạng thái của từng ghế cho mỗi suất chiếu cụ thể (Available, Held, Sold) |
| `seat_holds` | Lệnh tạm giữ ghế của user (chứa thời gian giữ ghế và timeout) |
| `bookings` | Hóa đơn đặt vé xem phim của khách hàng |
| `booking_seats` | Danh sách ghế được mua trong một booking |
| `payments` | Giao dịch thanh toán nội bộ kết nối với metadata từ payOS |
| `tickets` | Vé xem phim được tạo sau khi booking CONFIRMED (dùng để check-in) |
| `audit_logs` | Ghi vết hành động của người dùng (Ai làm gì, vào lúc nào) |
| `integration_logs` | Ghi vết log tích hợp bên thứ ba (payOS request-response, AI API) |

### AI Entities (Phục vụ chức năng AI thông minh)

| Entity | Trách nhiệm |
|---|---|
| `movie_embedding_documents` | Chứa text profile của phim và vector embeddings tương ứng |
| `ai_request_logs` | Log chi tiết prompt gửi đi và response của AI provider |
| `ai_recommendation_feedback` | Lưu feedback của người dùng đối với các gợi ý phim từ AI |
| `movie_ai_content_drafts` | Bản thảo nội dung do AI đề xuất (chờ Admin phê duyệt) |
| `user_movie_preferences` | Lưu sở thích, thói quen xem phim của Customer |
| `ai_chat_sessions` | *Stretch goal:* Phiên chat tư vấn phim |
| `ai_chat_messages` | *Stretch goal:* Nội dung tin nhắn trong phiên chat |
| `movie_reviews` | *Stretch goal:* Đánh giá phim của khách hàng |
| `movie_review_summaries` | *Stretch goal:* Tóm tắt review phim do AI thực hiện và đã duyệt |

---

## 2. State Machines (Vòng đời trạng thái)

### Trạng thái ghế suất chiếu (`Showtime Seat Status`)
```text
AVAILABLE -> HELD -> SOLD
AVAILABLE -> BLOCKED
HELD -> AVAILABLE (nếu hết hạn 5 phút giữ ghế mà chưa thanh toán)
```

### Trạng thái đặt vé (`Booking Status`)
```text
PENDING_PAYMENT -> CONFIRMED
PENDING_PAYMENT -> EXPIRED
PENDING_PAYMENT -> CANCELLED
CONFIRMED -> CHECKED_IN (một phần hoặc toàn bộ vé của booking)
```

### Trạng thái thanh toán (`Payment Status`)
```text
PENDING -> PAID
PENDING -> CANCELLED
PENDING -> EXPIRED
PENDING -> FAILED
```

### Trạng thái nội dung AI đề xuất (`AI Content Status`)
```text
DRAFT -> APPLIED (áp dụng vào phim chính thức)
DRAFT -> REJECTED (từ chối bản nháp)
```

### Trạng thái Vector Embeddings (`Embedding Status`)
```text
PENDING -> READY
PENDING -> FAILED
READY -> PENDING (khi nội dung thông tin phim thay đổi, cần rebuild embedding)
```
