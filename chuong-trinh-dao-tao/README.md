# Khung đào tạo Backend NestJS V2 - 10 tuần cường độ cao

Đừng học backend bằng cách học framework trước. Framework chỉ là công cụ. Backend thật sự nằm ở HTTP, API design, database, authentication, authorization, transaction, cache, queue, logging, monitoring, security, scalability và deployment. Framework có thể đổi; tư duy backend thì đi theo bạn cả sự nghiệp.

Tài liệu này là lộ trình đào tạo Backend trong **10 tuần** thông qua project xuyên suốt: **Movie Ticket Booking Backend API**.

Mục tiêu không phải trở thành Senior sau 10 tuần. Mục tiêu là có nền tảng backend chắc: biết hệ thống hoạt động qua mạng như thế nào, dữ liệu được bảo vệ ở đâu, request lỗi thì chuyện gì xảy ra, transaction/cache/queue/logging/deploy dùng để giải quyết vấn đề gì, và vì sao mình thiết kế như vậy.

## Cấu trúc 10 tuần

| Giai đoạn | Tuần | Nhịp học |
|---|---:|---|
| Core theory + mini labs | 1-2 | 5-7 giờ/ngày, Thứ 2-4 học sâu, Thứ 5-7 mini labs, không làm project thật |
| Deep foundation + mini labs | 3 | 5-7 giờ/ngày, DB/security/transaction/production primitives, mini labs, không làm project thật |
| Project delivery | 4-10 | 6-8 giờ/ngày, học topic mới rồi áp dụng vào Movie Ticket Booking |
| Capstone emphasis | 10 | Tổng hợp, evidence, system design, mock interview |

## Lộ trình học tập theo tuần

* [Tuần 1 - Backend mindset, Internet, HTTP và API fundamentals](lo-trinh/tuan-1.md)
* [Tuần 2 - TypeScript/OOP, NestJS mental model và backend code organization](lo-trinh/tuan-2.md)
* [Tuần 3 - Database, security, transaction và production thinking foundation](lo-trinh/tuan-3.md)
* [Tuần 4 - Project kickoff: API skeleton, public catalog và request pipeline](lo-trinh/tuan-4.md)
* [Tuần 5 - PostgreSQL implementation, migrations, indexes và query review](lo-trinh/tuan-5.md)
* [Tuần 6 - Authentication, authorization, RBAC và security hardening](lo-trinh/tuan-6.md)
* [Tuần 7 - Critical consistency: seat hold, booking, ticket và idempotency](lo-trinh/tuan-7.md)
* [Tuần 8 - Cache, queue, payment/webhook integration và semantic search](lo-trinh/tuan-8.md)
* [Tuần 9 - Observability, monitoring mindset, resilience và deployment](lo-trinh/tuan-9.md)
* [Tuần 10 - System design capstone, final evidence và mock interview](lo-trinh/tuan-10.md)

## Nguyên tắc bắt buộc

- Tuần 1-3 không code, scaffold hoặc deliver Movie Ticket Booking; chỉ học sâu và làm mini labs.
- Không học NestJS trước khi hiểu HTTP/API.
- Không dùng ORM trước khi hiểu SQL, constraint, index và transaction.
- Không làm auth trước khi phân biệt authentication và authorization.
- Không dùng cache/queue nếu chưa chỉ ra vấn đề cụ thể.
- Không gọi là Done nếu không có evidence: notes, lab, curl, test, log, diagram hoặc design explanation.

## Thiết kế hệ thống

* [Đặc tả API Endpoints](thiet-ke/api-spec.md)
* [Cấu trúc Database & State Machines](thiet-ke/database.md)
* [Thiết kế AI & Semantic Search](thiet-ke/semantic-search.md)
* [Business Rules](thiet-ke/business-rules.md)
