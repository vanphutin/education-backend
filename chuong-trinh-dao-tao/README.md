# Khung đào tạo Backend NestJS V2 - 10 tuần cường độ cao

Đừng học backend bằng cách học framework trước. Framework chỉ là công cụ. Backend thật sự nằm ở HTTP, API design, database, authentication, authorization, transaction, cache, queue, logging, monitoring, security, scalability và deployment. Framework có thể đổi; tư duy backend thì đi theo bạn cả sự nghiệp.

Tài liệu này là lộ trình đào tạo Backend trong **10 tuần** thông qua project xuyên suốt: **Movie Ticket Booking Microservices**.

Mục tiêu không phải trở thành Senior sau 10 tuần. Mục tiêu là có nền tảng backend chắc: biết hệ thống hoạt động qua mạng như thế nào, dữ liệu được bảo vệ ở đâu, request lỗi thì chuyện gì xảy ra, transaction/cache/queue/logging/deploy dùng để giải quyết vấn đề gì, và vì sao mình thiết kế như vậy.

## Cấu trúc 10 tuần

| Giai đoạn | Tuần | Nhịp học |
|---|---:|---|
| Core theory + mini labs | 1-2 | 5-7 giờ/ngày, Thứ 2-4 học sâu, Thứ 5-7 mini labs, không làm project thật |
| Deep foundation + mini labs | 3 | 5-7 giờ/ngày, DB/security/transaction/production primitives, mini labs, không làm project thật |
| Project delivery | 4-10 | 6-8 giờ/ngày, tách dần Gateway, Identity, Catalog, Booking và Worker theo service ownership |
| Capstone emphasis | 10 | Tổng hợp, evidence, system design, mock interview |

## Trục tư duy của ba tuần nền tảng

Ba tuần đầu không chỉ cung cấp danh sách khái niệm. Mỗi tuần rèn một cách nhìn có thể tái sử dụng khi công nghệ thay đổi:

| Tuần | Trục tư duy | Câu hỏi người học phải trả lời được |
|---:|---|---|
| 1 | System, boundary, protocol, state và failure | Request đi qua đâu, contract là gì, state nào đổi và nó có thể hỏng ở bước nào? |
| 2 | Contract, invariant, dependency, pattern và test | Chia code theo trách nhiệm nào, dependency nên hướng về đâu và kiểm chứng behavior thế nào? |
| 3 | Data, concurrency, threat và operation | Invariant được bảo vệ ở app/DB nào, điều gì xảy ra khi chạy đồng thời hoặc dependency lỗi? |

Mỗi buổi theory phải tạo concept map, worked example, counterexample, sơ đồ/decision table, failure matrix và self-check. Xem [Tư duy code và mô hình hóa hệ thống](huong-dan/tu-duy-code-va-mo-hinh.md).

## Lộ trình học tập theo tuần

* [Tuần 1 - Backend mindset, Internet, HTTP và API fundamentals](lo-trinh/tuan-1.md)
* [Tuần 2 - TypeScript/OOP, NestJS mental model và backend code organization](lo-trinh/tuan-2.md)
* [Tuần 3 - Database, security, transaction và production thinking foundation](lo-trinh/tuan-3.md)
* [Tuần 4 - Microservice kickoff: Gateway, Catalog Service và request pipeline](lo-trinh/tuan-4.md)
* [Tuần 5 - Catalog database ownership, migrations, indexes và event publication](lo-trinh/tuan-5.md)
* [Tuần 6 - Identity Service, Gateway auth context, RBAC và security hardening](lo-trinh/tuan-6.md)
* [Tuần 7 - Booking Service: critical consistency, seat hold, ticket và idempotency](lo-trinh/tuan-7.md)
* [Tuần 8 - Outbox/worker, payment/webhook integration, cache và semantic search optional](lo-trinh/tuan-8.md)
* [Tuần 9 - Microservice observability, resilience và deployment](lo-trinh/tuan-9.md)
* [Tuần 10 - Distributed system capstone, final evidence và mock interview](lo-trinh/tuan-10.md)

## Nhịp học và lab ngoài

* [Nhịp học, Definition of Done mỗi ngày và nguồn lab ngoài](huong-dan/nhip-hoc-va-lab-ngoai.md)
* [Tư duy code và mô hình hóa hệ thống](huong-dan/tu-duy-code-va-mo-hinh.md)
* [Nhịp đọc và TypeScript lab tuần 1-3](huong-dan/reading-va-lab-plan-tuan-1-3.md)
* [Audit objective, TypeScript và evidence cho lab tuần 1-3](huong-dan/audit-lab-tuan-1-3.md)

## Nguyên tắc bắt buộc

- Tuần 1-3 không code, scaffold hoặc deliver **project Movie Ticket Booking thật**; được code trong mini lab độc lập để kiểm chứng lý thuyết.
- Không học NestJS trước khi hiểu HTTP/API.
- Không dùng ORM trước khi hiểu SQL, constraint, index và transaction.
- Không làm auth trước khi phân biệt authentication và authorization.
- Không dùng cache/queue nếu chưa chỉ ra vấn đề cụ thể.
- Không gọi là Done nếu không có evidence: notes, lab, curl, test, log, diagram hoặc design explanation.

## Thiết kế hệ thống

* [Đặc tả API Endpoints](thiet-ke/api-spec.md)
* [Cấu trúc Database & State Machines](thiet-ke/database.md)
* [Kiến trúc Microservice](thiet-ke/microservice-architecture.md)
* [Thiết kế AI & Semantic Search](thiet-ke/semantic-search.md)
* [Business Rules](thiet-ke/business-rules.md)
