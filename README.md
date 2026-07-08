# Education Backend - NestJS V2 Movie Ticket Booking Program

Dự án này là không gian làm việc và ghi chép tiến độ đào tạo Backend NestJS trong 8 tuần thông qua dự án **Movie Ticket Booking Backend API**.

V2 chuyển trọng tâm từ "học để biết" sang "deliver như backend engineer trong team sản phẩm":

```text
business scenario
-> system analysis
-> API/DB/service design
-> implementation
-> verification
-> evidence
-> interview explanation
```

---

## 🗺️ Bản đồ thư mục dự án (Workspace Directory Structure)

```text
├── chuong-trinh-dao-tao/     # Khung chương trình chi tiết, đặc tả API, database và business rules
├── study/                    # Nhật ký học tập hàng ngày và mã nguồn các bài thực hành nhỏ (mini labs)
├── tien-do-hoc-tap/          # Cơ sở dữ liệu JSON lưu trữ tiến độ cá nhân (progress.json)
├── tracker-app/              # Ứng dụng web cục bộ dùng để theo dõi tiến độ và tạo daily check-in
└── mentor/                   # Cấu hình chỉ thị cho Mentor AI hỗ trợ học tập
```

---

## 🚀 Hướng dẫn khởi chạy ứng dụng Theo dõi Tiến độ (Local Progress Tracker)

Để xem tiến độ trực quan, tạo các daily check-in copy gửi Mentor AI, và làm các bài ôn tập phỏng vấn hàng ngày:

1.  Khởi động server cục bộ:
    ```bash
    node tracker-app/server.js
    ```
2.  Mở trình duyệt truy cập:
    ```text
    http://localhost:3900
    ```

---

## 🐙 Cấu hình gợi ý khi đẩy lên GitHub (GitHub Metadata Recommendations)

Khi bạn khởi tạo repository này trên GitHub cá nhân, bạn có thể tham khảo các thông tin cấu hình sau:

### 1. Tên Repository (Repository Name)
*   `education-backend` (Hoặc nếu muốn đặt tên chuyên nghiệp theo dự án: `movie-ticket-booking-api`)

### 2. Mô tả ngắn (Description)
Chọn một trong các mô tả dưới đây (đã được tối ưu dưới 350 ký tự để hiển thị đẹp trên GitHub):

*   **Option 1 (Chuyên nghiệp - Khuyên dùng):**
    > A NestJS backend for movie ticket booking featuring secure seat holding transactions, payOS payment links with webhook idempotency, AI-powered semantic search via PostgreSQL pgvector, BullMQ background jobs, RBAC, and automated Jest tests.
*   **Option 2 (Ngắn gọn, công nghệ trọng tâm):**
    > Production-ready NestJS movie ticket booking backend: Transaction-safe seat holding, payOS payment integration, AI semantic search (pgvector), Redis/BullMQ background jobs, and Dockerized dev environment.
*   **Option 3 (Tiếng Việt):**
    > Backend API đặt vé xem phim thực chiến bằng NestJS & PostgreSQL: Giữ ghế bằng transaction, thanh toán payOS qua webhook, tìm kiếm ngữ nghĩa AI (pgvector), hàng đợi BullMQ và môi trường Docker.

### 3. Chủ đề gợi ý (Topics / Tags)
Thêm các tags này vào mục Settings của repository để tăng khả năng tiếp cận và làm đẹp Portfolio:
`nestjs`, `postgresql`, `typescript`, `payos`, `pgvector`, `bullmq`, `redis`, `docker`, `backend-training`, `semantic-search`, `jest`, `rest-api`
