# Tuần 3 - Database, security, transaction và production thinking foundation

**Giai đoạn:** Deep Foundation + Mini Labs  
**Chế độ học:** Thứ 2-4 học chuyên sâu. Thứ 5-7 làm mini labs từ kiến thức Thứ 2-4. Chưa bắt đầu dự án thật.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Xây nền chuyên sâu về dữ liệu, tính đúng đắn, bảo mật, lỗi và vận hành trước khi bắt đầu project ở tuần 4. |
| Focus | SQL modeling, constraints, indexes, transaction, auth/authz, cache/queue/logging/security/deploy overview. |
| Project rule | Không code, không scaffold, không implement Movie Ticket Booking trong tuần này. Chỉ học sâu và làm mini lab độc lập. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Loại buổi | Trọng tâm |
|---|---|---|
| Thứ 2 | Theory Deep Dive | SQL and data modeling: table, relation, normalization, constraints, migration mindset |
| Thứ 3 | Theory Deep Dive | Database performance and consistency: index, query plan, transaction, isolation, locking, N+1 |
| Thứ 4 | Theory Deep Dive | Security and production primitives: auth/authz, password hashing, token, cache, queue, logging, monitoring, deployment |
| Thứ 5 | Mini Lab | Database lab: schema nhỏ, constraints, indexes, EXPLAIN, transaction rollback và lock behavior |
| Thứ 6-7 | Mini Lab | Security/production lab: password hashing, JWT mock, rate limit idea, queue/cache/logging simulation |

## 3. Output bắt buộc

- SQL/DB notes
- Schema and constraint mini lab
- Transaction/lock lab
- Security mini lab
- Production primitives lab notes

## 4. Interview drill

- Vì sao DB constraint quan trọng hơn app validation trong critical data?
- Transaction bảo vệ invariant nào?
- Cache/queue/logging giải quyết vấn đề gì?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [PostgreSQL Docs - Data Definition](https://www.postgresql.org/docs/current/ddl.html) | [PostgreSQL Docs - Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) |
| Tue | [PostgreSQL Docs - Indexes](https://www.postgresql.org/docs/current/indexes.html) | [PostgreSQL Docs - Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) |
| Wed | [OWASP - Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) | [OWASP - Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html) |
| Thu | [PostgreSQL Docs - Transactions Tutorial](https://www.postgresql.org/docs/current/tutorial-transactions.html) | [PostgreSQL Docs - Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) |
| Fri-Sat | [OpenTelemetry - Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/) | [Google SRE Book - Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) |
