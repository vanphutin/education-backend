# Data Ownership, Database Boundaries & State Machines

Tài liệu này đặc tả data ownership của các service, database PostgreSQL riêng và state machine nghiệp vụ. **Không có shared database, cross-service foreign key hoặc ORM relation xuyên boundary.**

---

## 1. Database ownership

| Service | Database owner | Source of truth | Consumer/read model được phép |
|---|---|---|---|
| Identity Service | `identity_db` | users, roles, refresh_tokens | actor/role claim tối thiểu qua token/internal contract |
| Catalog Service | `catalog_db` | movies, trailers, cinemas, screens, seat layout, showtimes, embedding docs | Booking snapshot từ event; không truy cập bảng trực tiếp |
| Booking Service | `booking_db` | showtime seat snapshot, holds, bookings, booking seats, payments, tickets, check-in, idempotency/inbox/outbox | Gateway/API query; event-derived projections |
| Worker | Không là owner business DB | relay/outbox/job state/DLQ theo owner service hoặc hạ tầng queue | Không trở thành source of truth booking/catalog |

## 2. Danh sách Entities theo owner

### Identity Service — `identity_db`

| Entity | Trách nhiệm |
|---|---|
| `users` | Thông tin tài khoản Customer/Admin/Staff |
| `roles` | Phân quyền: Role và permission tương ứng |
| `refresh_tokens` | Quản lý refresh token (hash, trạng thái thu hồi, ngày hết hạn) |

### Catalog Service — `catalog_db`

| Entity | Trách nhiệm |
|---|---|
| `movies` | Thông tin chi tiết phim (Tiêu đề, tóm tắt, đạo diễn, diễn viên,...) |
| `movie_trailers` | Đường dẫn trailer URL và metadata (không tạo video AI) |
| `cinemas` | Thông tin hệ thống rạp |
| `screens` | Thông tin các phòng chiếu trực thuộc rạp |
| `seats` | Danh sách ghế cố định thuộc một phòng chiếu |
| `showtimes` | Suất chiếu phim (Movie, screen, start/end time, pricing) |

### Booking Service — `booking_db`

| Entity | Trách nhiệm |
|---|---|
| `showtime_seat_snapshots` | Snapshot showtime/seat layout từ Catalog event; trạng thái Available/Held/Sold thuộc Booking |
| `seat_holds` | Lệnh tạm giữ ghế và expiry |
| `bookings` | Hóa đơn đặt vé và snapshot dữ liệu catalog cần thiết |
| `booking_seats` | Ghế trong booking |
| `payments` | Giao dịch payment theo Booking contract/provider reference |
| `tickets` | Vé/check-in sau booking CONFIRMED |
| `idempotency_records` | Outcome của command retryable |
| `inbox_events` | Dedup/event outcome cho Catalog/webhook replay |
| `outbox_events` | Event phải publish sau local transaction |
| `audit_logs` | Audit thuộc Booking actor/action/state change |
| `integration_logs` | Provider/webhook logs đã redact |

### Catalog Service AI entities — `catalog_db`

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

## 3. State Machines (Vòng đời trạng thái)

### Trạng thái ghế snapshot thuộc Booking (`Showtime Seat Status`)
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

## 4. Đồng bộ giữa boundary

Catalog ghi `catalog.showtime.published.v1`/`cancelled.v1` vào outbox cùng transaction local. Booking consume idempotently để tạo/cập nhật snapshot ghế. Transaction giữ ghế, booking, payment record và ticket chỉ nằm trong `booking_db`; không yêu cầu distributed transaction với Catalog hoặc Identity.
