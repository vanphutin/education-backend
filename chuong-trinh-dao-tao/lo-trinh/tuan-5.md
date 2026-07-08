# Tuần 5 - PostgreSQL implementation, migrations, indexes và query review

**Giai đoạn:** Project Delivery  
**Chế độ học:** DB theory nâng cao + implement schema thật.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Chuyển từ mock sang PostgreSQL thật và có evidence cho schema/query. |
| Focus | Entities, migrations, seed, ERD, constraints, index strategy, EXPLAIN, N+1 prevention. |
| Project rule | Catalog/showtime DB implementation. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Schema refinement: movie/cinema/screen/seat/showtime relations and constraints |
| Thứ 3 | Migration and seed strategy: clean DB, idempotent seed, production safety |
| Thứ 4 | Index/query review: EXPLAIN, composite index, N+1, query builder tradeoff |
| Thứ 5 | Map DB into project APIs and admin workflows |
| Thứ 6-7 | Implement migrations/entities/seeds, public queries and query-plan evidence |

## 3. Output bắt buộc

- ERD
- Migrations
- Seed data
- Index notes
- EXPLAIN evidence

## 4. Interview drill

- Index khi nào làm chậm write?
- Migration production cần tránh gì?
- N+1 xuất hiện thế nào trong ORM?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [TypeORM Docs - Entities](https://typeorm.io/entities) | [PostgreSQL Docs - Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) |
| Tue | [TypeORM Docs - Migrations](https://typeorm.io/migrations) | [Martin Fowler - Evolutionary Database Design](https://martinfowler.com/articles/evodb.html) |
| Wed | [PostgreSQL Docs - Indexes](https://www.postgresql.org/docs/current/indexes.html) | [PostgreSQL Docs - Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) |
| Thu | [TypeORM Docs - Select Query Builder](https://typeorm.io/select-query-builder) | [PostgreSQL Docs - Indexes and ORDER BY](https://www.postgresql.org/docs/current/indexes-ordering.html) |
| Fri-Sat | [TypeORM Docs - Relations](https://typeorm.io/relations) | [PostgreSQL Docs - Performance Tips](https://www.postgresql.org/docs/current/performance-tips.html) |
