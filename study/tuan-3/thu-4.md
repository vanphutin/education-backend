# Theory Deep Dive: Security and production primitives: auth/authz, password hashing, token, cache, queue, logging, monitoring, deployment

- **Tuần**: 3
- **Ngày**: Thứ 4
- **Issue**: [#13](https://github.com/vanphutin/education-backend/issues/13)
- **Giai đoạn**: Deep Foundation + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [OWASP - Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)
- **Nâng cao:** [OWASP - Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- **Production mental model:** [OpenTelemetry - Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/), [Google SRE Book - Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- **Microservice foundation:** [Martin Fowler & James Lewis - Microservices](https://martinfowler.com/articles/microservices.html), [Transactional Outbox Pattern](https://microservices.io/patterns/data/transactional-outbox.html)

## 1. Learning Objectives

Sau buổi học, học viên có thể:

1. Lập threat model nhỏ từ asset → actor → entry point → trust boundary → abuse/failure case → preventive/detective/recovery control → residual risk.
2. Phân biệt authentication (ai), authorization (được làm gì) và ownership/tenant scope; chỉ ra nơi mỗi kiểm tra phải xảy ra.
3. Giải thích password hashing thích nghi, per-password salt, pepper/secret và cost; không nhầm hashing với encryption hoặc encoding.
4. Phân tích token theo signature, claims, expiry, audience/issuer, rotation/revocation; chứng minh signed JWT không phải encrypted data.
5. Thiết kế vòng đời secret gồm injection, least privilege, rotation, redaction và incident response; không hardcode hoặc đưa secret vào artifact.
6. So sánh cache-aside, TTL/invalidation và source of truth; nhận diện stale data, stampede và cache key/tenant leak.
7. Mô tả at-most-once/at-least-once delivery, ack, retry/backoff/jitter, poison message, DLQ, idempotency và outbox bằng failure window cụ thể.
8. Chứng minh unmanaged `Promise`/`setTimeout` trong request process không phải durable queue và có thể mất việc khi process crash.
9. Chọn logs, metrics, traces, liveness/readiness và deploy checks để phát hiện, chẩn đoán và phục hồi failure mà không lộ dữ liệu nhạy cảm.
10. Chia được Gateway, Identity, Catalog, Booking và Worker theo service/data/invariant ownership; chỉ ra khi nào dùng HTTP, event và khi nào không được dùng shared database.

## 2. Threat Model / Trust Model

### 2.1 Chuỗi suy luận

```text
Asset cần bảo vệ
  → actor hợp lệ và attacker capability
  → entry point + data flow
  → trust boundary
  → threat / abuse case / failure
  → prevent + detect + recover
  → residual risk + owner
```

“Có JWT” không phải threat model. Cần chỉ rõ dữ liệu nào đi qua boundary nào và thành phần nào được phép tin điều gì.

### 2.2 Trust boundaries của mini commerce domain

```text
[Untrusted client]
      | credentials / token / input
      v
[HTTP boundary] -----> [Application policy] -----> [Database]
      |                       |
      |                       +---- outbox row (same transaction)
      v                                      |
[Rate limiter/cache]                         v
                                      [Worker/queue] ----> [Email/payment provider]
                                                           external trust boundary
```

Mỗi mũi tên cần trả lời: dữ liệu có được xác thực format không, identity lấy từ đâu, authorization dựa trên resource nào, secret nào được dùng, log gì và retry có làm lặp side effect không.

### 2.3 Threat-control worksheet

| Asset/flow | Threat hoặc failure | Prevent | Detect | Recover | Residual risk |
|---|---|---|---|---|---|
| Login credential | brute force / credential stuffing | adaptive hash, rate limit, MFA policy | failed-login metric theo actor/IP | cooldown/reset | distributed attack vẫn có thể né IP limit |
| Order ownership | user A đọc order user B | authorization theo owner/tenant ở server | denied-access audit event | revoke/fix policy | admin path cần policy riêng |
| JWT | tamper/replay/stolen token | verify signature/claims, short TTL, secure transport/storage | invalid-token/reuse signal | key/token revocation plan | access token còn hiệu lực trong cửa sổ ngắn |
| Receipt job | duplicate/lost delivery | outbox + at-least-once + idempotency | lag/retry/DLQ metrics | replay/DLQ runbook | downstream có thể không hỗ trợ idempotency |

## 3. Security Mental Models

### 3.1 Authentication, authorization và ownership

- **Authentication:** chứng minh/thiết lập principal; thất bại thường là `401` hoặc không có session hợp lệ.
- **Authorization:** policy quyết định principal có action trên resource/context này không; thất bại thường là `403` hoặc che giấu resource theo policy.
- **Ownership/tenant scope:** không lấy `userId` từ body rồi tin nó; derive identity từ verified credential và filter resource theo principal/tenant.
- **Validation không phải authorization:** input đúng schema vẫn có thể là hành động bị cấm.

### 3.2 Password hashing

```text
password + random salt
  → adaptive password-hashing function (cost được cấu hình)
  → stored hash
```

- Salt khác nhau cho từng password và thường lưu cùng hash; salt chống precomputed/rainbow lookup, không phải secret.
- Pepper là secret dùng thêm ở cấp hệ thống nếu có thiết kế vận hành phù hợp; phải ở secret store và có rotation/recovery plan.
- Hàm phải chậm có kiểm soát và nâng cost theo hardware; lab dùng bcrypt để quan sát, production lựa chọn theo guidance hiện hành và khả năng vận hành.
- Không log password, hash, reset token hoặc credential. Encryption hai chiều không phải lựa chọn mặc định để lưu password.

### 3.3 Token

- JWT signed bảo vệ integrity/authenticity theo key; payload vẫn đọc được, nên không chứa secret/PII không cần thiết.
- Verify không chỉ là decode: kiểm signature, algorithm allow-list, `exp`, và khi thiết kế yêu cầu thì `iss`, `aud`, `nbf`, `jti`.
- Token phải có expiry và key rotation; refresh/revocation là lifecycle decision, không được giải quyết chỉ bằng access JWT stateless.
- Authorization không “đóng băng” hoàn toàn trong role claim dài hạn nếu quyền/resource có thể đổi; phải quyết định freshness.

### 3.4 Secret lifecycle

| Giai đoạn | Câu hỏi |
|---|---|
| Inject | Secret đến process bằng environment/secret manager nào; app fail fast nếu thiếu không? |
| Use | Component nào thật sự cần; scope/key có least privilege không? |
| Observe | Logger/error/APM có redact header, token, password, cookie, connection string không? |
| Rotate | Có chấp nhận old/new key trong cửa sổ chuyển tiếp không; ai trigger? |
| Revoke/respond | Khi lộ secret, làm sao revoke, audit, rotate và đánh giá ảnh hưởng? |

## 4. Cache và Rate-limit Mental Models

### 4.1 Cache không phải source of truth

```text
read key
  → hit: kiểm TTL/freshness → return
  → miss: load source of truth → cache → return

write source of truth
  → commit
  → invalidate/update cache theo strategy
```

Với mỗi cache cần ghi: key gồm tenant/version nào, value owner, TTL/staleness budget, invalidation trigger, behavior khi cache down và metric hit/miss/eviction. Cache sai có thể trả dữ liệu cũ hoặc rò dữ liệu giữa tenant; cache down không nên âm thầm biến thành outage nếu nó chỉ là optimization.

Stampede xảy ra khi nhiều request cùng miss/expire và cùng tải source. Có thể cân nhắc request coalescing/single-flight, jittered TTL, stale-while-revalidate hoặc capacity protection; không áp dụng mù quáng.

### 4.2 Rate limit là policy, không chỉ counter

Xác định subject (IP, account, API key, tenant), endpoint/cost, window/burst, response/retry hint, shared-store requirement và false-positive behavior. Login cần tránh vừa cho brute-force không giới hạn vừa tạo cơ chế attacker khóa tài khoản người khác.

## 5. Reliable Async / Delivery Mental Models

### 5.1 Delivery semantics

| Semantics | Điều có thể xảy ra | Consumer cần làm gì? |
|---|---|---|
| At-most-once | Có thể mất, không retry sau uncertain failure | Chỉ dùng khi mất job chấp nhận được |
| At-least-once | Không muốn mất nhưng duplicate có thể xảy ra | Idempotency/deduplication và side effect an toàn |
| “Exactly once” | Thường chỉ đúng trong một boundary hẹp; external side effect vẫn có failure window | Nói rõ boundary và chứng minh, không dùng như khẩu hiệu |

### 5.2 Worker lifecycle

```text
enqueue/persist
  → worker reserve
  → process
     ├─ success: persist effect/idempotency → ACK
     ├─ transient: NACK/retry + exponential backoff + jitter
     └─ permanent/max attempts: DLQ + alert/context
```

- Retry phải bounded, phân loại transient/permanent, có timeout và backoff; retry ngay lập tức có thể khuếch đại outage.
- Idempotency key đại diện cho một logical operation; record key + outcome phải nằm trong boundary đủ atomic với business effect.
- DLQ không phải thùng rác. Cần reason, payload reference đã bảo vệ dữ liệu, attempt history, owner, alert và replay/runbook.
- Queue delay/lag, age of oldest message, retry rate và DLQ count là signals quan trọng hơn chỉ log “job failed”.

### 5.3 Dual-write gap và transactional outbox

Phản ví dụ:

```text
COMMIT order PAID
process crash
enqueue receipt chưa chạy
```

Outbox ghi business change và event record trong cùng DB transaction. Một relay/worker publish/process outbox sau commit; duplicate vẫn có thể xảy ra nên consumer cần idempotency. Outbox thu hẹp “DB commit nhưng không enqueue”, không tự giải quyết ordering, poison message, cleanup hoặc downstream duplicate.

### 5.4 Vì sao fire-and-forget không phải queue

`sendEmail().then(...)` hoặc `setTimeout(...)` không có durable persistence, ownership, retry state, visibility, backpressure, DLQ hay recovery sau restart. Request trả `202` chỉ hợp lý khi work đã được nhận vào một boundary đáng tin cậy, không phải khi một Promise còn nằm trong memory của process.

## 6. Observability và Deploy Health

### 6.1 Logs, metrics, traces trả lời câu hỏi khác nhau

| Signal | Tốt cho | Field tối thiểu / ví dụ |
|---|---|---|
| Structured log | Chi tiết discrete event/failure | timestamp, level, event, service, request/trace/job id, safe actor/resource id, outcome, error class |
| Metric | Xu hướng, alert, saturation/SLO | request rate/error/latency, DB pool, queue lag/retry/DLQ, cache hit/miss |
| Trace | Đường đi và latency qua boundary | trace/span id, parent, operation, status, duration; không gắn PII tùy ý |

Correlation ID phải đi từ request → transaction/outbox → job log/trace để truy vết. Redaction diễn ra trước sink; blacklist vài field top-level là chưa đủ nếu secret nằm trong nested object/header/error.

### 6.2 Health và deploy

| Check | Ý nghĩa | Không nên làm |
|---|---|---|
| Liveness | Process có kẹt và cần restart không? | Phụ thuộc mọi downstream rồi tạo restart loop |
| Readiness | Instance hiện có nhận traffic an toàn không? | Trả ready trước config/migration/dependency bắt buộc |
| Startup (nếu dùng) | Cho app thời gian khởi động/migrate/warm-up | Dùng để che startup vô hạn |

Deploy checklist: validate config/secret trước nhận traffic; schema change tương thích old/new app; readiness chỉ bật khi dependencies bắt buộc sẵn sàng; graceful shutdown ngừng nhận request, chờ in-flight có timeout, release lock/job đúng semantics; rollback app không được giả định rollback data luôn an toàn.

### 6.3 Microservice foundation: boundary trước deployment

Microservice không phải chia controller thành nhiều repository. Một service cần sở hữu **business capability, data source of truth, transaction boundary và operational responsibility**.

| Boundary | Sở hữu | Không được làm | Contract với phần còn lại |
|---|---|---|---|
| Gateway | External HTTP contract, routing, edge rate limit, request/trace ID | Chứa booking rule hoặc query database service khác | Forward actor context đã xác minh, timeout/error mapping rõ |
| Identity | Credential, session/refresh token, role/permission claim | Sở hữu booking/movie | Auth/refresh API, token/public-key contract |
| Catalog | Movie, cinema, showtime metadata, search | Hold/booking/ticket | Read/write API, publish showtime event |
| Booking | Seat snapshot, hold, booking, payment record, ticket | Canonical catalog administration, password/session | Command/query API, consume catalog event, publish booking event |
| Worker | Relay outbox, delayed/retryable work, provider adapter | Source of truth business state | At-least-once event/job contract + DLQ/runbook |

Rules phải mang vào project:

- Mỗi service có database/schema/credential riêng. Không `JOIN`, foreign key hay ORM entity xuyên service.
- Invariant “một ghế chỉ được hold/sold một lần” phải nằm hoàn toàn trong Booking Service và transaction local của nó.
- Catalog publish showtime; Booking consume idempotently để tạo snapshot đặt ghế. Eventual consistency là thiết kế được nhìn thấy và quan sát được, không phải lỗi bị che đi.
- HTTP phù hợp cho query/command cần câu trả lời ngay; event phù hợp cho integration sau commit. Không dùng event để che một invariant cần consistency tức thì.
- Không có distributed transaction. State change + outbox là local transaction; consumer inbox/dedup bảo vệ duplicate event.

Artifact bắt buộc trước tuần 4: vẽ service context, ownership matrix, một synchronous flow và một asynchronous event flow cho Movie Ticket Booking. Xem [Kiến trúc Microservice](../../chuong-trinh-dao-tao/thiet-ke/microservice-architecture.md).

## 7. Worked Example và Anti-example

### Ví dụ có failure model

Command `payOrder(orderId, idempotencyKey)`:

1. HTTP boundary verify token và derive `userId`; authorization kiểm order thuộc user.
2. Transaction kiểm state/balance/idempotency, cập nhật wallet/order/payment và insert `receipt.requested` vào outbox.
3. Request trả kết quả theo record đã commit; không gọi email trong transaction.
4. Worker xử lý outbox at-least-once, dedupe theo event/idempotency key, retry transient failure và đưa permanent failure vào DLQ.
5. Log dùng `requestId`, `orderId`, `eventId`, không có token/email/password; metric theo latency, retry, DLQ và outbox age.

### Phản ví dụ

- Payload JWT chứa password/email nhạy cảm vì “đã ký nên an toàn”.
- Controller tin `role: admin` hoặc `userId` từ request body.
- JWT secret hardcode và logger dump toàn bộ headers khi verify lỗi.
- Cache key chỉ là `order:123`, thiếu tenant; write DB nhưng không invalidate cache.
- Sau commit gọi `setTimeout(sendReceipt)`; crash làm mất job, retry request làm gửi trùng.
- `/health` luôn trả 200 dù app thiếu secret hoặc không truy cập được dependency bắt buộc.

## 8. Guided Questions

1. Asset quan trọng nhất là gì; attacker/user nội bộ có capability nào; trust boundary nằm ở đâu?
2. Identity nào lấy từ verified token, field nào vẫn là untrusted input? Ownership được kiểm trước hay sau query?
3. Salt, pepper và encryption khác nhau ở threat nào? Cost quá thấp/quá cao gây gì?
4. Tamper, expiry, wrong issuer/audience và stolen-valid-token cần control khác nhau thế nào?
5. Nếu signing key lộ, rotation/revocation và evidence review diễn ra theo thứ tự nào?
6. Cache key/TTL/invalidation nào bảo vệ freshness và tenant isolation? Khi cache down hệ thống degrade ra sao?
7. Rate-limit subject nào phù hợp cho login; distributed instances chia counter thế nào?
8. Failure xảy ra trước enqueue, sau enqueue trước ACK, và sau side effect trước ACK tạo lost/duplicate nào?
9. Idempotency record nằm đâu để không có khoảng trống giữa “đã gửi” và “đánh dấu đã xử lý”?
10. Retry nào transient, retry nào vô ích; max attempts/backoff/DLQ owner là gì?
11. Signal nào phát hiện queue bị kẹt trước khi user report? Log/metric/trace liên kết bằng ID nào?
12. Liveness và readiness phản ứng khác nhau khi cache optional down, DB required down và worker backlog cao thế nào?

## 9. Artifacts / Evidence

- Data-flow/trust-boundary diagram có ít nhất 3 boundaries và đánh dấu untrusted/authenticated/authorized data.
- Threat-control table có ít nhất 6 cases; mỗi case có prevent, detect, recover và residual risk.
- Authn/authz/ownership decision matrix cho 4 actions, gồm một object-level authorization failure.
- Password/token/secret lifecycle note gồm tamper, expiry, missing/wrong secret và rotation scenario.
- Cache/rate-limit design table: source of truth, key, TTL, invalidation, failure behavior và metrics.
- Ba delivery timelines: lost-before-enqueue, duplicate-after-side-effect-before-ACK và poison message; kèm control tương ứng.
- Retry policy + idempotency record + DLQ schema/runbook + outbox state transitions.
- Signal matrix nối failure → log → metric/alert → trace field → operator action; liveness/readiness cases riêng.

## 10. Mini Lab Preparation cho Thứ 6-7

Trước khi code, viết test table cho:

- password đúng/sai; không log raw input/hash;
- token valid/tampered/expired/wrong-secret/missing-secret;
- logger redact secret ở nested object và header;
- rate limit cho phép N request rồi từ chối N+1; cache hit/miss/expiry/invalidation;
- job success, transient fail rồi success, duplicate replay và permanent fail → DLQ;
- process dừng trước `setTimeout` để chứng minh fire-and-forget mất work;
- readiness false khi thiếu dependency/config bắt buộc, liveness vẫn phản ánh process còn sống.

## 11. Common Mistakes

- Gộp authentication và authorization; tin role/user id do client gửi hoặc chỉ bảo vệ route mà không bảo vệ object.
- Dùng SHA-256 trực tiếp cho password, dùng salt cố định, log hash/token hoặc hardcode secret “cho lab”.
- Gọi `decode()` là verify; không giới hạn algorithm/expiry/audience/issuer; cho access token sống quá lâu mà không có revocation model.
- Coi cache là database, dùng key thiếu tenant/version, không định nghĩa staleness hoặc stampede behavior.
- Coi rate limit theo local memory là chính xác khi chạy nhiều instance.
- Nói queue “exactly once”, retry mọi lỗi ngay lập tức hoặc không kiểm affected/idempotency outcome.
- ACK trước khi effect bền vững; retry sau uncertain side effect mà không có idempotency.
- Có DLQ nhưng không alert, owner, context hoặc replay procedure.
- Log toàn request/error object; metric label chứa user/order ID gây cardinality explosion.
- Health endpoint luôn 200, hoặc liveness phụ thuộc downstream gây restart loop.

## 12. Self-check / Exit Criteria

- [ ] Threat model của tôi bắt đầu từ asset/flow và có residual risk, không bắt đầu từ danh sách công cụ.
- [ ] Tôi phân biệt authn, action authorization và object/tenant ownership bằng ví dụ.
- [ ] Tôi giải thích được vì sao JWT signed vẫn đọc được và cách xử lý tamper/expiry/key rotation.
- [ ] Không secret, token, password/hash hoặc raw authorization header xuất hiện trong evidence.
- [ ] Cache có source of truth, staleness budget, invalidation và failure behavior rõ.
- [ ] Tôi vẽ được các failure window làm mất hoặc lặp job và map sang outbox/idempotency/retry/DLQ.
- [ ] Tôi chứng minh được fire-and-forget không durable bằng một crash timeline.
- [ ] Signal matrix giúp cả phát hiện lẫn chẩn đoán; health checks có semantics riêng.

## 13. Interview Drill

- Question: Vì sao retry cần idempotency, và outbox/DLQ giải quyết các failure window nào khác nhau?
- Follow-ups:
  - Authentication khác authorization và object ownership thế nào?
  - Signed JWT bảo vệ gì và không bảo vệ gì?
  - Cache invalidation/freshness được quyết định theo business tolerance ra sao?
  - At-least-once delivery ảnh hưởng consumer thế nào?
  - Log, metric và trace mỗi loại giúp trả lời câu hỏi gì?
  - Liveness khác readiness khi DB bị mất kết nối như thế nào?
- My answer:
  - ...
