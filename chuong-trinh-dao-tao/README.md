# Khung đào tạo Backend NestJS V2 - Movie Ticket Booking - 8 tuần

Tài liệu này là lộ trình đào tạo Backend trong 8 tuần thông qua một project xuyên suốt: **Movie Ticket Booking Backend API**.

V2 không học theo kiểu đọc docs cho biết. Mỗi ngày là một ticket dự án có business scenario, system analysis, design, implementation, verification và evidence. Mục tiêu là mô phỏng cách một backend engineer làm việc trong team sản phẩm.

Project được thiết kế để đủ mạnh đưa vào CV và đủ sâu để phục vụ phỏng vấn backend:

- Đặt vé xem phim với seat map, giữ ghế, booking và ticket.
- Thanh toán thật qua payOS bằng payment link và webhook.
- Tích hợp AI cho movie discovery, recommendation, admin content draft.
- Semantic search nâng cao bằng embeddings và PostgreSQL + pgvector.
- Auth/RBAC, transaction, background job, audit log, test, Docker, CI.

Không học theo kiểu xem khóa học cho xong. Mỗi tuần đều phải tạo artifact thật: issue, code, PR, test, migration, API docs, evidence chạy thử, ADR hoặc demo.

---

## 🗺️ Bản đồ tài liệu lộ trình

Để dễ dàng theo dõi và học tập, tài liệu được phân chia thành các phần chuyên biệt:

### 1. Lộ trình học tập theo tuần (`lo-trinh/`)
*   [Tổng quan giai đoạn & Cách học mỗi ngày](lo-trinh/tong-quan.md)
*   [Tuần 1 - Product foundation, OOP và public catalog API](lo-trinh/tuan-1.md)
*   [Tuần 2 - Production API behavior và request pipeline](lo-trinh/tuan-2.md)
*   [Tuần 3 - Database design, migrations và showtime seat snapshot](lo-trinh/tuan-3.md)
*   [Tuần 4 - Auth, RBAC và seat hold concurrency](lo-trinh/tuan-4.md)
*   [Tuần 5 - Booking state machine, ticket, testing, CI và Docker](lo-trinh/tuan-5.md)
*   [Tuần 6 - payOS, webhook idempotency, jobs và semantic search](lo-trinh/tuan-6.md)
*   [Tuần 7 - AI product workflow và admin operations](lo-trinh/tuan-7.md)
*   [Tuần 8 - Hardening, release, demo và interview](lo-trinh/tuan-8.md)

### 2. Thiết kế hệ thống (`thiet-ke/`)
*   [Đặc tả API Endpoints](thiet-ke/api-spec.md)
*   [Cấu trúc Database & State Machines](thiet-ke/database.md)
*   [Thiết kế AI & Semantic Search (pgvector)](thiet-ke/semantic-search.md)
*   [Các quy tắc nghiệp vụ (Business Rules) quan trọng](thiet-ke/business-rules.md)

### 3. Hướng dẫn & Tiêu chuẩn (`huong-dan/`)
*   [Tiêu chuẩn hoàn thành (Definition of Done)](huong-dan/definition-of-done.md)
*   [Evidence cần có cuối khóa](huong-dan/evidence-cuoi-khoa.md)
*   [Prompt sử dụng với Mentor AI](huong-dan/mentor-prompt.md)
*   [Daily Ticket Template V2](huong-dan/daily-ticket-template.md)

### 4. Nhật ký học tập & Mini Labs (`study/` nằm ở ngoài thư mục gốc)
*   [Thư mục ghi chép học tập chính](../../study/README.md)
*   Tài liệu ghi lý thuyết và code lab nhỏ hàng ngày từ Thứ 2 -> Thứ 7 cho từng tuần học.

---

## 1. Project vision

### Tên dự án

```text
Movie Ticket Booking Backend API
```

### Mô tả CV

```text
Built a NestJS backend for a movie ticket booking platform with cinema/showtime management, seat holding, booking transactions, payOS payment integration, webhook idempotency, ticket check-in, AI-powered semantic movie search, PostgreSQL pgvector embeddings, RBAC, Docker, CI, and automated tests.
```

### Mục tiêu học tập

| Hạng mục | Định hướng |
|---|---|
| Người học | Một người tự học tại nhà sau kỳ thực tập DevOps |
| Mục tiêu | Ứng tuyển Backend Intern/Fresher/Junior mạnh |
| Thời gian | 8 tuần |
| Project chính | Movie Ticket Booking Backend API |
| Stack chính | Node.js, TypeScript, NestJS, PostgreSQL, TypeORM |
| Stack nâng cao | Redis, BullMQ, payOS, pgvector, AI provider, Docker, GitHub Actions |
| Testing | Jest, Supertest, unit test, e2e test, race-condition test cơ bản |
| Output cuối | GitHub repo có README, Swagger, DB docs, AI docs, test evidence, Docker Compose, CI |

### Luồng giá trị chính

```text
Guest/Customer
-> tìm phim bằng filter hoặc AI semantic search
-> xem rạp, suất chiếu, trailer
-> xem seat map
-> giữ ghế trong thời gian ngắn
-> tạo booking
-> tạo payOS payment link
-> thanh toán
-> payOS webhook xác nhận
-> hệ thống confirm booking và tạo ticket
-> staff check-in ticket tại rạp
```

### Điểm mạnh để phỏng vấn

- Chống double-booking ghế bằng transaction và constraint.
- Tách seat hold, booking, payment và ticket thành state machine rõ ràng.
- Tích hợp payOS với webhook verification và idempotency.
- Dùng background job để expire seat hold và booking pending.
- Dùng semantic search embeddings để tìm phim theo ý định tự nhiên.
- Dùng mock provider trong test, provider thật khi demo.
- Có RBAC Admin/Staff/Customer.
- Có test, Docker, CI, Swagger và evidence.

---

## 2. Scope tổng thể

### Actors

| Actor | Vai trò |
|---|---|
| Guest | Xem phim, trailer, rạp, suất chiếu, seat map public |
| Customer | Đăng ký/login, giữ ghế, đặt vé, thanh toán, xem ticket |
| Staff | Tra cứu ticket, check-in vé tại rạp |
| Admin | Quản lý phim, trailer, rạp, phòng, ghế, suất chiếu, content AI |
| System | Expire hold, nhận webhook payOS, tạo embedding, ghi audit/integration log |

### Core modules

| Module | Trách nhiệm |
|---|---|
| `auth` | Register, login, refresh token, logout |
| `users` | User profile, role, permission |
| `movies` | Movie CRUD, trailer URL, publish/unpublish |
| `cinemas` | Cinema, screen, seat layout |
| `showtimes` | Showtime, pricing, seat map |
| `bookings` | Seat hold, booking, cancel, expire |
| `payments` | payOS payment link, payment status, manual sync |
| `webhooks` | payOS webhook handler |
| `tickets` | Ticket code/QR mock, check-in |
| `ai` | AI search, recommendation, admin content draft, embedding |
| `jobs` | Expire hold, expire booking, embedding sync |
| `audit-logs` | Log hành động quan trọng |
| `integration-logs` | Log payOS/AI provider request-response |

### MVP bắt buộc

- Auth + RBAC.
- Movie/cinema/screen/seat/showtime management.
- Trailer URL management, không dựng video AI trong backend.
- Seat map theo từng suất chiếu.
- Seat hold transaction.
- Booking flow.
- payOS payment link.
- payOS webhook verify + idempotency.
- Ticket generation + staff check-in.
- Background job expire seat hold.
- AI semantic movie search bằng embeddings.
- AI recommendation cơ bản.
- Admin AI content draft, admin duyệt mới áp dụng.
- Unit/e2e tests, Docker Compose, GitHub Actions, Swagger, README.

### Stretch goals

- Upload trailer file thật thay vì chỉ URL.
- AI chat assistant tư vấn phim.
- Review summary bằng AI.
- Promotion/discount code.
- Revenue report theo phim/rạp/ngày.
- Race-condition test nâng cao cho double-booking.
- Refund/cancel payment flow nâng cao.

### Không làm trong 8 tuần đầu

- Không làm microservices.
- Không làm Kubernetes.
- Không làm frontend lớn.
- Không để AI tự đặt vé hoặc tự thanh toán.
- Không dùng `returnUrl` của payOS làm nguồn xác nhận thanh toán.
- Không làm backend tạo video AI.
