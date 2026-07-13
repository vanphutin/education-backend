# Tuần 3 - Database, security, transaction và production thinking foundation

**Giai đoạn:** Deep Foundation + Mini Labs  
**Chế độ học:** Thứ 2-4 học chuyên sâu theo mental model. Thứ 5-7 dùng mini lab độc lập để kiểm chứng giả thuyết. Chưa bắt đầu dự án thật.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Biến yêu cầu thành mô hình dữ liệu có invariant rõ; lý giải được hiệu năng và tính đúng đắn khi có đồng thời; nhận diện trust boundary và thiết kế đường đi an toàn từ request đến background work và production signals. |
| Data foundation | Requirement → facts/rules/access patterns → conceptual model → logical ERD/cardinality/keys/normalization/NULL → physical PostgreSQL types/constraints/index hypotheses → migration evolution. |
| Consistency foundation | B-tree/index/query plan/N+1; ACID/transaction boundary; isolation anomalies/MVCC/locks/deadlock; optimistic vs pessimistic concurrency; state machine. |
| Production foundation | Threat model/trust boundary; authentication/authorization; password hash/token/secrets; cache/queue delivery; idempotency/retry/backoff/DLQ/outbox; logs/metrics/traces, health/readiness và microservice boundary/data ownership. |
| Project rule | Không scaffold hoặc implement Movie Ticket Booking. Chỉ phân tích, mô hình hóa và làm mini lab có bằng chứng. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Loại buổi | Trọng tâm | Kết quả kiểm chứng |
|---|---|---|---|
| Thứ 2 | Theory Deep Dive | Requirement → conceptual/logical/physical model: ERD, cardinality/optionality, keys, normalization, NULL, constraints, invariant và migration evolution | Requirement map, conceptual map, logical ERD và physical constraint/migration record |
| Thứ 3 | Theory Deep Dive | Hiệu năng và consistency: B-tree, selectivity, composite index, query plan, N+1, ACID, transaction boundary, isolation/MVCC/locks/deadlock, concurrency strategy và state machine | Một index hypothesis, transaction timeline và concurrency decision table |
| Thứ 4 | Theory Deep Dive | Security, reliable production và microservice foundation: trust boundary, service ownership, no shared DB, sync/async contract, authn/authz, outbox/inbox, observability và deploy health | Service-boundary map, ownership matrix, delivery/failure map và signal/health matrix |
| Thứ 5 | Mini Lab | PostgreSQL: schema/constraints/migration, seed đủ lớn, EXPLAIN, N+1, rollback, lock và optimistic concurrency | DDL/seed/query scripts cùng evidence trước-sau và invariant checks |
| Thứ 6-7 | Mini Lab + Foundation Gate | Node security/reliability simulation: hash/JWT, redacted logs, cache/rate-limit, reliable job retry/idempotency/DLQ/outbox, metrics/traces/readiness; sau đó làm design gate trên domain Equipment Lending độc lập | Failure tests chạy lại được và bộ design artifacts đạt gate; không dùng unmanaged fire-and-forget hoặc project thật |

## 3. Output bắt buộc

- Requirement-to-data map: assumptions, facts, business rules, access patterns và invariants
- ERD có cardinality/optionality, key choices, NULL/constraint decisions và migration evolution plan
- Query/index hypothesis với `EXPLAIN (ANALYZE, BUFFERS)` trước/sau, kèm giải thích khi Seq Scan là hợp lý
- Transaction/state-machine design, rollback evidence, lock timeline và optimistic-vs-pessimistic decision
- Threat model/trust-boundary diagram và authn/authz/secrets checklist
- Service-boundary/ownership map: Gateway, Identity, Catalog, Booking, Worker; database owner, sync API, async event và invariant owner
- Reliable-delivery evidence: idempotent replay, bounded retry/backoff, DLQ và outbox recovery
- Structured logs đã redact, metrics/traces correlation và liveness/readiness matrix
- Foundation Gate packet cho Equipment Lending: requirement map, conceptual/logical/physical model, state/concurrency, threat/reliable-delivery và production-signal decisions

## 4. Exit gate trước tuần 4

Học viên chỉ hoàn thành tuần khi có thể:

1. Đi từ một requirement mơ hồ tới ERD, keys, constraints và invariant mà không bắt đầu bằng ORM entity.
2. Đọc các node/estimate/actual/buffer chính của query plan và bảo vệ được quyết định tạo hoặc không tạo index.
3. Chỉ ra transaction boundary, anomaly có thể xảy ra và chọn optimistic hoặc pessimistic concurrency bằng trade-off.
4. Vẽ state transition hợp lệ, từ chối transition sai và giải thích lớp bảo vệ ở app/DB.
5. Vẽ trust boundary, phân biệt authn/authz, không đưa credential/secret vào code hoặc log.
6. Chia một domain thành service owner và database owner; giải thích vì sao không shared DB/cross-service transaction.
7. Giải thích vì sao retry cần idempotency; mô phỏng transient/permanent failure, DLQ và outbox replay.
8. Chọn log/metric/trace/health signal đủ để phát hiện và chẩn đoán failure mà không lộ dữ liệu nhạy cảm.
9. Chuyển các mental model sang một domain mới từ trang trắng, đạt Foundation Gate mà không scaffold hoặc code project thật.

## 5. Foundation Gate cuối tuần

Gate dùng **Equipment Lending**, một mini domain độc lập với Mini Commerce và Movie Ticket Booking. Đây là bài design/open-book, không scaffold API, không tạo database và không implement application.

Học viên phải tự tạo:

1. Requirement/assumption/access-pattern/invariant map với invalid examples.
2. Conceptual model, logical ERD và physical decision table tách rõ; có keys, cardinality, NULL, normalization, constraints, index hypotheses và migration evolution.
3. State machine và transaction boundary cho hold/checkout; timeline hai request cùng hold một thiết bị; quyết định optimistic-vs-pessimistic.
4. Threat/trust/authn-authz-ownership/secrets model.
5. Reminder delivery model có failure windows, idempotency, bounded retry/backoff, DLQ và outbox.
6. Logs/metrics/traces/health/deploy matrix nối failure với operator action.

Chấm theo rubric chi tiết trong [study/tuan-3/thu-6-7.md](../../study/tuan-3/thu-6-7.md): pass từ 80/100 và không vi phạm hard gate về secret leakage, invariant concurrent chỉ bảo vệ ở app, fire-and-forget hoặc claim không có boundary/evidence.

## 6. Interview drill

- Requirement nào phải trở thành DB constraint, requirement nào nên ở application service?
- Composite index phụ thuộc access pattern và selectivity như thế nào?
- Transaction bảo vệ invariant nào; isolation level và lock có đánh đổi gì?
- Vì sao `fire-and-forget` trong request process không tương đương một durable queue?
- Retry, idempotency key, DLQ và outbox giải quyết những failure window khác nhau nào?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [PostgreSQL Docs - Data Definition](https://www.postgresql.org/docs/current/ddl.html) | [PostgreSQL Docs - Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) |
| Tue | [PostgreSQL Docs - Indexes](https://www.postgresql.org/docs/current/indexes.html) | [PostgreSQL Docs - Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html) |
| Wed | [OWASP - Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Microservices](https://martinfowler.com/articles/microservices.html) | [OWASP - Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [Transactional Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html) |
| Thu | [PostgreSQL Docs - Transactions Tutorial](https://www.postgresql.org/docs/current/tutorial-transactions.html) | [PostgreSQL Docs - Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) |
| Fri-Sat | [OpenTelemetry - Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/) | [Google SRE Book - Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/) |
