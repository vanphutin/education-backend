# Tuần 7 - Booking Service: critical consistency, seat hold, ticket và idempotency

**Giai đoạn:** Project Delivery  
**Nhịp học:** Transaction/concurrency theory + implement critical flow.

State machine, transaction boundary, SELECT FOR UPDATE, unique constraints, idempotency, race tests.

Roadmap chi tiết: [chuong-trinh-dao-tao/lo-trinh/tuan-7.md](../../chuong-trinh-dao-tao/lo-trinh/tuan-7.md)

**Chuẩn job-ready bắt buộc:** [Booking consistency playbook](job-ready-playbook.md) · [Executable tests tuần 5–10](../../labs/project-delivery/README.md)

## Daily tickets

- [Thứ 2 - State machine: seat hold, booking, payment, ticket, check-in transitions](thu-2.md) (Issue #31)
- [Thứ 3 - Concurrency deep dive: race condition, row lock, isolation, deadlock, retry](thu-3.md) (Issue #32)
- [Thứ 4 - Idempotency: duplicate request, client retry, webhook replay, unique key strategy](thu-4.md) (Issue #33)
- [Thứ 5 - Map Catalog event → Booking DB/API/local transaction boundary](thu-5.md) (Issue #34)
- [Thứ 6-7 - Implement Booking Service, seat hold/ticket and race/idempotency evidence](thu-6-7.md) (Issue #35)

> Scope: Booking owns seat snapshots, hold, booking, payment record and ticket. Core consistency stays inside `booking_db`.
