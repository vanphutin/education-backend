# Tuần 3 - Database, security, transaction và production thinking foundation

**Giai đoạn:** Deep Foundation + Mini Labs  

**Nhịp bắt buộc:** xem [kế hoạch đọc và TypeScript lab tuần 1-3](../../chuong-trinh-dao-tao/huong-dan/reading-va-lab-plan-tuan-1-3.md). TypeScript điều khiển lab; SQL vẫn được dùng trực tiếp ở DB lab để không che data model/query plan.
**Nhịp học:** Thứ 2-4 xây mental model và trả lời guided questions. Thứ 5-7 kiểm chứng bằng mini labs có failure evidence. Chưa bắt đầu dự án thật.

Roadmap chi tiết: [chuong-trinh-dao-tao/lo-trinh/tuan-3.md](../../chuong-trinh-dao-tao/lo-trinh/tuan-3.md)

## Chuỗi kiến thức

```text
Requirement
  → facts / rules / access patterns / invariants
  → ERD / keys / NULL / constraints / migrations
  → query plan / index
  → transaction / concurrency / state
  → trust boundary / reliable delivery
  → logs / metrics / traces / deploy health
  → service ownership / data boundary / HTTP-event contract
```

## Daily tickets

- [Thứ 2 - Theory Deep Dive: SQL and data modeling: table, relation, normalization, constraints, migration mindset](thu-2.md) (Issue #11)
- [Thứ 3 - Theory Deep Dive: Database performance and consistency: index, query plan, transaction, isolation, locking, N+1](thu-3.md) (Issue #12)
- [Thứ 4 - Theory Deep Dive: Security and production primitives: auth/authz, password hashing, token, cache, queue, logging, monitoring, deployment](thu-4.md) (Issue #13)
- [Thứ 5 - Mini Lab: Database lab: schema nhỏ, constraints, indexes, EXPLAIN, transaction rollback và lock behavior](thu-5.md) (Issue #14)
- [Thứ 6-7 - Mini Lab: Security/production lab: password hashing, JWT mock, rate limit idea, queue/cache/logging simulation](thu-6-7.md) (Issue #15)

## Definition of done

- Mỗi theory ticket có knowledge map do học viên tự hoàn thiện, câu trả lời guided questions và một design decision có trade-off.
- Mỗi lab có giả thuyết trước khi chạy, script có thể chạy lại, kết quả quan sát được và reflection sau khi chạy.
- Evidence phải chứa cả success path lẫn failure path; screenshot không thay thế script/log dạng text.
- Không dùng project chính, không dùng `synchronize: true` thay migration và không coi unmanaged Promise/`setTimeout` là queue.
- Trước tuần 4 phải vẽ được Gateway/Identity/Catalog/Booking/Worker context, database owner và một event flow; xem [kiến trúc microservice](../../chuong-trinh-dao-tao/thiet-ke/microservice-architecture.md).

> Tuần 3 xây nền cho API/DB ở tuần 4-5, auth ở tuần 6, concurrency ở tuần 7, cache/queue ở tuần 8 và observability/deploy ở tuần 9.
