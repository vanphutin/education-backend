# Tuần 5 - Catalog Service database ownership, migrations, indexes và event publication

**Giai đoạn:** Project Delivery  
**Nhịp học:** DB theory nâng cao + implement schema thật.

Entities, migrations, seed, ERD, constraints, index strategy, EXPLAIN, N+1 prevention.

Roadmap chi tiết: [chuong-trinh-dao-tao/lo-trinh/tuan-5.md](../../chuong-trinh-dao-tao/lo-trinh/tuan-5.md)

**Chuẩn job-ready bắt buộc:** [PostgreSQL ownership playbook](job-ready-playbook.md) · [Executable tests tuần 5–10](../../labs/project-delivery/README.md)

## Daily tickets

- [Thứ 2 - Catalog ownership: movie/cinema/screen/showtime relations and constraints](thu-2.md) (Issue #21)
- [Thứ 3 - Catalog migration, seed và outbox strategy](thu-3.md) (Issue #22)
- [Thứ 4 - Catalog index/query review](thu-4.md) (Issue #23)
- [Thứ 5 - Map Catalog DB to Gateway APIs and showtime events](thu-5.md) (Issue #24)
- [Thứ 6-7 - Implement catalog migrations, queries, outbox and query-plan evidence](thu-6-7.md) (Issue #25)

> Scope: chỉ Catalog Service truy cập `catalog_db`. Event `catalog.showtime.published.v1` là đầu vào cho Booking Service tuần 7.
