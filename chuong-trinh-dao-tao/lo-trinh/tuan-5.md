# Tuần 5 - Catalog Service database ownership, migrations, indexes và event publication

**Giai đoạn:** Project Delivery  
**Chế độ học:** DB theory nâng cao + implement schema thật.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Catalog Service sở hữu database của mình, chạy migration/seed độc lập và publish lifecycle event cho Booking tương lai. |
| Focus | Catalog ERD, migrations, seed, constraints, index strategy, EXPLAIN, N+1 prevention, outbox event. |
| Project rule | Chỉ Catalog Service truy cập `catalog_db`; chưa tạo shared schema cho Booking. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Catalog ownership: movie/cinema/screen/showtime model, data classification, publishable showtime boundary |
| Thứ 3 | Catalog migration/seed strategy and outbox schema: clean DB, idempotent seed, additive evolution |
| Thứ 4 | Catalog index/query review: EXPLAIN, composite index, N+1, query builder and service-local read model |
| Thứ 5 | Map Catalog DB into Gateway APIs and `catalog.showtime.published/cancelled` event contract |
| Thứ 6-7 | Implement catalog migrations/entities/seeds, public queries, outbox publisher stub and query-plan evidence |

## 3. Output bắt buộc
- Hoàn thành [Job-ready PostgreSQL playbook](../../study/tuan-5/job-ready-playbook.md) và tests tuần 5 trong [`labs/project-delivery`](../../labs/project-delivery/README.md).

- Catalog ERD/data dictionary and explicit ownership record
- Catalog-only migrations/seed data/index notes/EXPLAIN evidence
- PostgreSQL integration tests, migration N-1 compatibility và N+1/query-count evidence.
- Versioned showtime event schema + outbox/inbox design note
- Proof that no other service database is imported or joined

## 4. Interview drill

- Vì sao một migration Catalog không được tự đổi Booking schema?
- Outbox giải quyết gap nào giữa catalog commit và event publication?
- Consumer có thể nhận event trùng/out-of-order thì contract cần gì?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [TypeORM Docs - Entities](https://typeorm.io/entities) | [PostgreSQL Docs - Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) |
| Tue | [TypeORM Docs - Migrations](https://typeorm.io/migrations) | [Martin Fowler - Evolutionary Database Design](https://martinfowler.com/articles/evodb.html) |
| Wed | [PostgreSQL Docs - Indexes](https://www.postgresql.org/docs/current/indexes.html) | [PostgreSQL Docs - Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) |
| Thu | [TypeORM Docs - Select Query Builder](https://typeorm.io/select-query-builder) | [PostgreSQL Docs - Indexes and ORDER BY](https://www.postgresql.org/docs/current/indexes-ordering.html) |
| Fri-Sat | [TypeORM Docs - Relations](https://typeorm.io/relations) | [PostgreSQL Docs - Performance Tips](https://www.postgresql.org/docs/current/performance-tips.html) |
