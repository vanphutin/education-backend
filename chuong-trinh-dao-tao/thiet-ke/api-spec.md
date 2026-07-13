# Đặc tả các API Endpoints (API Specification)

Tài liệu này tổng hợp external API qua **API Gateway** và service owner sẽ hiện thực contract trong Movie Ticket Booking Microservices. Client không gọi trực tiếp database hay internal service endpoint.

---

## 0. API Gateway và service ownership

| External route family | Owner xử lý | Gateway làm | Không được làm |
|---|---|---|---|
| `/auth/*`, `/me` | Identity Service | Route, edge rate-limit, request/trace ID, auth error mapping | Lưu credential/session hoặc query Identity DB |
| `/movies`, `/cinemas`, `/showtimes` | Catalog Service | Route public read; propagate correlation | Tạo booking/hold hoặc query Catalog DB |
| `/showtimes/:id/seats`, `/seat-holds`, `/bookings`, `/payments`, `/tickets`, `/staff/*` | Booking Service / payment worker contract | Route command/query; authenticate actor | Giữ DB transaction/seat rule tại Gateway |
| `/ai/*` | Catalog Service capability (stretch) | Route only sau khi Catalog core ổn định | Để AI tạo hold/booking/payment |

Gateway public contract ổn định; internal HTTP/event contract versioned riêng. Gateway truyền `requestId`/`traceId` và actor context đã xác minh, nhưng mỗi service vẫn tự bảo vệ authorization và input boundary theo trust model đã ghi.

---

## 1. Public APIs

Các API không yêu cầu đăng nhập, phục vụ cho Guest truy cập thông tin chung:

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/movies` | Danh sách phim, filter genre/status |
| GET | `/movies/:id` | Chi tiết phim, trailer published |
| GET | `/movies/:id/trailer` | Lấy trailer published |
| GET | `/cinemas` | Danh sách rạp |
| GET | `/cinemas/:id` | Chi tiết rạp |
| GET | `/showtimes` | Tìm suất chiếu theo movie/cinema/date |
| GET | `/showtimes/:id` | Chi tiết suất chiếu |
| GET | `/showtimes/:id/seats` | Seat map và trạng thái ghế |

---

## 2. Auth và Customer APIs

Các API bảo mật yêu cầu JWT token của Customer:

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/auth/register` | Đăng ký customer |
| POST | `/auth/login` | Login |
| POST | `/auth/refresh` | Refresh token |
| POST | `/auth/logout` | Logout/revoke refresh token |
| GET | `/me` | Profile hiện tại |
| PATCH | `/me/preferences` | Cập nhật sở thích phim |
| POST | `/showtimes/:id/seat-holds` | Giữ một hoặc nhiều ghế |
| DELETE | `/seat-holds/:id` | Hủy giữ ghế |
| POST | `/bookings` | Tạo booking từ seat hold |
| GET | `/bookings/my` | Lịch sử đặt vé của tôi |
| GET | `/bookings/:id` | Chi tiết booking |
| POST | `/bookings/:id/cancel` | Hủy booking nếu còn được phép |
| POST | `/bookings/:id/payments/payos` | Tạo payOS payment link |
| GET | `/payments/:id` | Xem trạng thái payment |
| GET | `/tickets/my` | Danh sách vé của tôi |
| GET | `/tickets/:id` | Chi tiết vé |

---

## 3. Admin APIs

Các API quản trị hệ thống, yêu cầu role `Admin`:

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/admin/movies` | Tạo phim |
| PATCH | `/admin/movies/:id` | Cập nhật phim |
| PATCH | `/admin/movies/:id/trailer` | Cập nhật trailer URL/metadata |
| POST | `/admin/movies/:id/trailer/publish` | Publish trailer |
| POST | `/admin/movies/:id/trailer/unpublish` | Ẩn trailer |
| POST | `/admin/cinemas` | Tạo rạp |
| PATCH | `/admin/cinemas/:id` | Cập nhật rạp |
| POST | `/admin/screens` | Tạo phòng chiếu |
| POST | `/admin/screens/:id/seats` | Tạo layout ghế |
| POST | `/admin/showtimes` | Tạo suất chiếu và snapshot seat map |
| PATCH | `/admin/showtimes/:id` | Cập nhật suất chiếu |
| POST | `/admin/showtimes/:id/cancel` | Hủy suất chiếu |
| GET | `/admin/bookings` | Quản lý booking |
| GET | `/admin/payments` | Quản lý payment |
| POST | `/admin/payments/:id/sync` | Sync payment status thủ công |
| GET | `/admin/audit-logs` | Xem audit logs |
| GET | `/admin/integration-logs` | Xem integration logs |

---

## 4. Staff APIs

Các API tại rạp dành cho nhân viên kiểm vé, yêu cầu role `Staff`:

| Method | Endpoint | Mục đích |
|---|---|---|
| GET | `/staff/tickets/:code` | Tra cứu vé bằng ticket code/QR mock |
| POST | `/staff/tickets/:id/check-in` | Check-in vé |
| GET | `/staff/showtimes/:id/check-ins` | Danh sách vé đã check-in |

---

## 5. payOS APIs và webhook

Tích hợp cổng thanh toán payOS:

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/bookings/:id/payments/payos` | Tạo payment link |
| POST | `/webhooks/payos` | Nhận webhook từ payOS |
| GET | `/payments/:id` | Xem trạng thái payment |
| POST | `/admin/payments/:id/sync` | Sync lại payment status khi cần |

### Luồng xác nhận thanh toán (Payment Confirmation Flow)

```text
Customer -> Gateway -> Booking Service tạo payment record PENDING + outbox payment.requested
-> Payment Worker gọi payOS, lưu provider reference bằng Booking contract
-> payOS trả checkoutUrl qua Gateway/client
-> customer thanh toán
-> payOS gọi webhook vào worker/adapter boundary
-> worker verify signature, amount/orderCode/paymentLinkId
-> Booking Service chạy transaction local:
   payment = PAID
   booking = CONFIRMED
   booking-owned showtime_seats = SOLD
   create tickets + booking outbox event
-> ticket/notification worker consume event idempotently
```

> [!IMPORTANT]
> `returnUrl` chỉ dùng để UI hiển thị kết quả. Backend không được tin `returnUrl` là nguồn xác nhận cuối cùng. Phải xác nhận thông qua webhook verify.

> Booking Service không join Catalog database khi xác nhận payment. Catalog information cần cho ticket/receipt phải là snapshot hoặc read model có source/event contract rõ.

---

## 6. AI và Semantic Search APIs

Tích hợp tính năng AI thông minh cho Customer và Admin:

### AI Customer APIs

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/ai/movie-search` | Tìm phim bằng ngôn ngữ tự nhiên + semantic search |
| POST | `/ai/recommendations` | Gợi ý phim/suất chiếu theo mood, genre, lịch sử, preference |
| POST | `/ai/recommendations/feedback` | User phản hồi gợi ý |
| POST | `/ai/chat/sessions` | Stretch: tạo phiên chat tư vấn phim |
| POST | `/ai/chat/sessions/:id/messages` | Stretch: gửi message cho AI assistant |
| GET | `/ai/chat/sessions/:id` | Stretch: lấy lịch sử chat |

#### Ví dụ Request `/ai/movie-search`:
```json
{
  "message": "Tối nay tôi muốn xem phim hành động nhưng không quá nặng, đi 2 người ở gần trung tâm",
  "city": "Ho Chi Minh",
  "date": "2026-07-08",
  "limit": 5
}
```

#### Ví dụ Response `/ai/movie-search`:
```json
{
  "intent": "MOVIE_DISCOVERY",
  "filters": {
    "genres": ["Action"],
    "mood": ["light", "entertaining"],
    "date": "2026-07-08",
    "partySize": 2
  },
  "results": [
    {
      "movieId": "uuid",
      "title": "Example Movie",
      "score": 0.87,
      "reason": "Phù hợp vì có yếu tố hành động nhẹ, suất chiếu tối và còn nhiều ghế."
    }
  ]
}
```

### AI Admin APIs

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/admin/movies/:id/ai/content-draft` | AI gợi ý synopsis, short description, tags |
| POST | `/admin/movies/:id/ai/trailer-description` | AI gợi ý mô tả trailer từ URL/metadata admin nhập |
| POST | `/admin/movies/:id/ai-content/apply` | Admin duyệt và áp dụng nội dung AI |
| POST | `/admin/movies/:id/embeddings/rebuild` | Rebuild embedding cho một phim |
| POST | `/admin/ai/embeddings/rebuild` | Rebuild embedding hàng loạt |
| GET | `/admin/ai/logs` | Xem AI request logs |
| GET | `/admin/ai/usage` | Xem usage/cost thống kê nếu có |

### Review Summary APIs (Stretch goal nếu còn thời gian)

| Method | Endpoint | Mục đích |
|---|---|---|
| POST | `/movies/:id/reviews` | Customer viết review |
| GET | `/movies/:id/reviews` | Danh sách review |
| POST | `/admin/movies/:id/reviews/ai-summary` | AI tóm tắt review |
| POST | `/admin/movies/:id/reviews/summary/publish` | Admin publish summary |
| GET | `/movies/:id/review-summary` | Public summary đã duyệt |
