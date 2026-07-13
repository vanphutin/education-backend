# Audit lab Tuần 1–3: objective → TypeScript → evidence

## Quy ước

- **Baseline tự động:** code starter trong repository đã chạy và có test/smoke test.
- **Bài học viên:** phần cố ý chưa giải sẵn; phải được học viên implement hoặc ghi evidence.
- **Hard gate:** thiếu phần này thì ticket chưa Done dù baseline xanh.

## Ma trận coverage

| Lab | Baseline TypeScript đã bảo vệ | Bài học viên còn phải làm | Hard gate |
|---|---|---|---|
| T1 HTTP/CORS | typed HTTP server, status/network distinction, delay/cancel signal, ETag, cookie, CORS allow/deny/preflight | chạy sáu experiment, ghi hypothesis/raw evidence, browser Network/Console, curl timing | phân biệt đúng HTTP/network/CORS/timeout và giải thích bằng evidence |
| T1 API contract | lifecycle guard, optimistic version, idempotency replay/key conflict, negative stock, stable cursor pagination | hoàn thiện contract 8 use case, schemas, 10+ errors, conditional request và decision log | mọi endpoint trace về actor/use case/invariant; ít nhất 8 decision có trade-off |
| T2 TS/OOP | Email Result + exception wrapper, immutable value equality, User identity/invariant, port/test double, Map directory | đủ matrix 14 case, compile-time negative evidence, safe refactor before/after | không bypass invariant; giải thích Result vs exception và Array vs Map |
| T2 Nest mental model | runtime token, Clock override, Users repository port/adapter, typed 404/503 category, DTO mapping, unit/e2e | missing-provider experiment, provider override integration test, 503 e2e, graph/ADR | domain/application không import HTTP; thay adapter không sửa use case |
| T3 PostgreSQL | exact schema contract, named constraints, SQLSTATE negative cases, rollback, optimistic conflict, two-session lock timeout | seed 1k/50k/100k, EXPLAIN/buffers before-after, N+1, migration evolution, optional deadlock | raw plan + final data/timeline; không kết luận từ table nhỏ hoặc ép planner |
| T3 security/production | bcrypt/JWT/redaction, limiter/cache fake clock, outbox states, bounded retry/backoff, idempotency, DLQ/manual replay, readiness | expiry/issuer tests, fire-and-forget crash, file persistence/restart, metrics/correlation evidence | không lộ secret; không claim exactly-once/durable queue từ mock |

## Nhận định tải học

Nhịp cũ không thiếu chữ nhưng thiếu executable depth ở vài starter, nên người học có thể hoàn thành sớm mà chưa va vào failure thật. Nhịp mới phù hợp mức cường độ cao nếu tuân thủ:

- ngày lý thuyết 5,5–6,5 giờ, trong đó 45–75 phút là TypeScript micro exercise;
- ngày lab 5–7 giờ, tối thiểu một negative case và một failure injection;
- không tính code starter đã có là output của học viên;
- không đọc toàn bộ reference tuyến tính: đọc section trả lời câu hỏi đang có, sau đó closed-book recall;
- stretch chỉ mở khi hard gate đã đạt.

## Khi nào nhịp đang quá chậm

- hơn 90 phút chỉ highlight docs mà chưa tạo model/decision/test;
- chạy lại sample không thay input hay inject failure;
- viết nhiều notes nhưng không trả lời được “invariant nào, owner nào, evidence nào”;
- dành thời gian trang trí project/framework trong ba tuần nền tảng.

## Khi nào nhịp đang quá nhanh

- bỏ advanced/reference vì basic example chạy được;
- test chỉ happy path;
- gọi status DONE khi chưa có raw output/log/query plan;
- dùng AI điền phần giải thích hoặc evidence mà học viên chưa tự kiểm chứng.
