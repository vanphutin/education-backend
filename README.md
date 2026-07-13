# Education Backend - 10-week High-intensity Backend Program

Đừng học backend bằng cách học framework trước. Framework chỉ là công cụ. Backend thật sự nằm ở HTTP, API design, database, authentication, authorization, transaction, cache, queue, logging, monitoring, security, scalability và deployment. Framework có thể đổi; tư duy backend thì đi theo bạn cả sự nghiệp.

Dự án này là workspace cho chương trình **Backend NestJS 10 tuần cường độ cao** thông qua project xuyên suốt **Movie Ticket Booking Microservices**.

Triết lý học:

```text
Foundation first
-> framework second
-> project delivery
-> evidence
-> system design explanation
```

## Nhịp 10 tuần

- Tuần 1-3: chưa bắt đầu dự án thật. Thứ 2-4 học chuyên sâu, Thứ 5-7 làm mini labs tương ứng với kiến thức vừa học.
- Tuần 4: bắt đầu kickoff Movie Ticket Booking Microservices với Gateway và Catalog Service.
- Tuần 4-10: 7 tuần liên tiếp vừa học topic mới vừa tách dần service ownership, local database, event/worker và vận hành; tuần nào cũng có evidence.

## Bản đồ thư mục

```text
├── chuong-trinh-dao-tao/     # Khung chương trình 10 tuần, roadmap, design notes và hướng dẫn học
├── study/                    # Nhật ký học tập theo tuần/ngày, daily tickets và mini labs
├── docs/                     # Product backlog, database docs, traceability matrix và evidence
├── tien-do-hoc-tap/          # JSON DB lưu tiến độ cá nhân cho tracker app
├── tracker-app/              # Web app local để theo dõi tiến độ và daily check-in
└── mentor/                   # Chỉ thị cho Mentor AI khi review quá trình học
```

Kiến trúc dự án: [Gateway, Identity, Catalog, Booking và Worker](chuong-trinh-dao-tao/thiet-ke/microservice-architecture.md).

## Chạy progress tracker

```bash
cd tracker-app
npm run dev
```
