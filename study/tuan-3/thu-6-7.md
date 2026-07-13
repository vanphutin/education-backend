# Mini Lab Ticket: Security/production lab: password hashing, JWT mock, rate limit idea, queue/cache/logging simulation

- **Tuần**: 3
- **Ngày**: Thứ 6-7
- **Issue**: [#15](https://github.com/vanphutin/education-backend/issues/15)
- **Giai đoạn**: Deep Foundation + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [OpenTelemetry - Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/), [OWASP - Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- **Nâng cao:** [Google SRE Book - Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/), [OWASP - Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)

## 1. Lab Goal

Dùng các script Node nhỏ, deterministic và có failure injection để kiểm chứng:

1. Password hash/compare và token verify đúng ở cả success lẫn failure path.
2. Secret được inject ngoài source; token tamper/expiry/wrong-secret bị từ chối; log không lộ credential.
3. Rate limit và cache có policy, TTL/invalidation, signal và giới hạn rõ.
4. Fire-and-forget mất work khi process dừng; một worker mock có retry/backoff, idempotency, DLQ và outbox state mới là mental model phù hợp hơn.
5. Logs/metrics/traces correlation và liveness/readiness giúp phát hiện, chẩn đoán, deploy an toàn.

Không gọi email/payment thật, không dùng Movie Ticket Booking và không phát triển production service trong lab này.

### TypeScript verification loop

```powershell
cd labs/tuan-3/security-lab
npm install
npm run typecheck
npm test
```

Baseline chỉ minh họa các invariant nhỏ. Học viên vẫn phải mở rộng các case expiry/wrong issuer, TTL/invalidation, permanent failure/DLQ, persisted outbox và health/readiness đúng theo các phase dưới đây.

## 2. Lab Contract và Safety

- Dùng project TypeScript strict mode ở `labs/tuan-3/security-lab`; dependencies hiện có là `bcrypt` và `jsonwebtoken`. Rate limit/cache/worker mock dùng Node built-ins.
- JWT signing secret phải đến từ `process.env`; thiếu secret thì script fail fast. Không hardcode secret, không commit `.env` và không đưa giá trị secret/token/password/hash vào evidence.
- Dữ liệu credential trong lab chỉ là test fixture cục bộ; logger vẫn phải redact như production.
- Không dùng network hoặc dịch vụ bên ngoài. Failure được inject theo input để test lặp lại được.
- Retry dùng fake clock hoặc delay rất ngắn có giới hạn; không để `setTimeout` dài làm bài test nondeterministic.
- “In-memory/file worker” chỉ mô phỏng state machine và failure windows, không được tuyên bố là durable queue production.

## 3. Test Matrix trước khi code

Điền expected outcome trước khi chạy:

| Area | Case | Expected result | Safe evidence |
|---|---|---|---|
| Password | correct / wrong | `true` / `false` | boolean + duration, không raw/hash |
| Token | valid | verified claims tối thiểu | claim names, không full token |
| Token | tampered / expired / wrong secret / missing secret | reject theo error class an toàn | error code/class đã sanitize |
| Logger | nested secret/header | mọi sensitive value thành `[REDACTED]` | JSON log fixture |
| Rate limit | N rồi N+1 | N allow, N+1 deny + retry hint | counters/status |
| Cache | miss/hit/expire/invalidate | source-load count theo dự đoán | cache metrics |
| Worker | transient 2 lần rồi success | attempts 3, một effect | state + counters |
| Worker | duplicate replay | effect count vẫn 1 | idempotency outcome |
| Worker | permanent failure | DLQ sau max attempts | attempt history + DLQ reason |
| Health | thiếu required config/dependency | not ready; process vẫn có thể live | health object |

## 4. Phase 1 — Password Hashing

Hoàn thiện/mở rộng `src/hash.ts`:

1. Hash một test password bằng bcrypt với cost phù hợp cho lab (ví dụ 10); không tự tạo/reuse salt cố định.
2. Tạo hai hash từ cùng password và chứng minh hash string khác nhau nhưng cả hai compare đúng.
3. Compare correct password và wrong password; expected `true`/`false`.
4. Đo thời gian hash/compare ở mức quan sát; giải thích cost cao hơn là security/performance trade-off, không benchmark production từ một laptop.
5. Error/log output chỉ chứa event, outcome, duration; không chứa raw password, hash hoặc salt.

Artifact: bảng `case → expected → observed` và 3–5 câu giải thích salt, adaptive cost, vì sao encryption/fast hash không thay thế password hashing.

## 5. Phase 2 — JWT, Secret Injection, Tamper và Expiry

Hoàn thiện/mở rộng `src/jwt.ts`:

### 5.1 Config boundary

- Đọc signing secret từ `process.env.JWT_SECRET`; validate tồn tại trước khi sign/verify.
- Không in secret khi config lỗi. Evidence chỉ ghi `JWT_SECRET configured: true/false`.
- Chỉ định algorithm allow-list khi verify; thêm `issuer` và `audience` cố định cho lab để kiểm claims.

### 5.2 Test cases bắt buộc

1. Sign access token ngắn hạn với claims tối thiểu như subject/user id, role, issuer, audience và expiry; không để PII/secret trong payload.
2. Decode riêng để chứng minh payload đọc được; ghi conclusion “signed không có nghĩa encrypted”, không lưu full token.
3. Verify valid token thành công.
4. Sửa một ký tự ở signature/token rồi verify: bị từ chối.
5. Tạo token đã hết hạn hoặc dùng fake clock/expiry ngắn rồi verify: bị từ chối vì expiry.
6. Verify bằng wrong secret: bị từ chối.
7. Chạy khi thiếu `JWT_SECRET`: fail fast trước khi tạo token.
8. Optional: wrong audience/issuer và `nbf` chưa tới; ghi error mapping an toàn.

Không assert nguyên văn message phụ thuộc version nếu error class/code đủ rõ. Không coi `jwt.decode()` là authentication.

### 5.3 Token lifecycle note

Viết 1 trang ngắn: access token TTL, refresh/revocation choice, key rotation old/new overlap, stolen-valid-token residual risk và authorization freshness. Đây là design artifact, không cần implement refresh endpoint.

## 6. Phase 3 — Structured Logging và Redaction

Hoàn thiện/mở rộng `src/logger.ts` thành logger JSON tối thiểu:

- Field ổn định: timestamp, level, event, service, requestId/traceId, safe actor/resource id, outcome, durationMs, error class/code.
- Viết redaction recursive cho key nhạy cảm không phân biệt hoa thường: `password`, `passphrase`, `token`, `authorization`, `cookie`, `secret`, `apiKey`, `connectionString` và nested equivalents.
- Test object có nested credentials, array, header `Authorization: Bearer ...` và error; output không được chứa fixture secret ở bất kỳ vị trí nào.
- Không dùng email/IP đầy đủ làm metric label. Nếu log security event cần IP, ghi rõ privacy/retention decision hoặc mask/hash theo policy giả định.
- Mang `requestId → eventId/jobId` sang worker logs để correlation không mất ở async boundary.

Viết negative assertion đơn giản: serialize toàn bộ log evidence rồi kiểm không chứa từng secret fixture. “Tôi không thấy bằng mắt” chưa đủ.

## 7. Phase 4 — Rate Limit và Cache Simulation

Có thể tạo file mới trong lab khi học, dùng `Map` và fake clock; không cần thêm package.

### 7.1 Rate limit

1. Chọn policy rõ: subject key, window, limit/burst và behavior khi vượt.
2. Ví dụ deterministic: 3 attempts/window được phép, attempt thứ 4 bị từ chối với `retryAfter` hợp lý; advance fake clock sang window mới rồi cho phép lại.
3. Test hai subjects độc lập; key phải có tenant/account/IP decision rõ.
4. Emit counters `allowed_total`, `denied_total` và safe log event; không label bằng raw user ID vô hạn.
5. Reflection: local-memory limiter sai/không đồng bộ thế nào khi có nhiều process; account-only/IP-only có abuse trade-off gì?

### 7.2 Cache-aside

1. Tạo fake source-of-truth loader có counter.
2. First read: miss → source load → cache. Second read trước TTL: hit, source counter không tăng.
3. Advance fake clock quá TTL: miss/reload.
4. Mutation source-of-truth rồi invalidate key; next read phải lấy value mới.
5. Key gồm tenant + resource + version/locale nếu domain giả định cần; test hai tenant cùng numeric id không đọc nhầm nhau.
6. Emit `cache_hit_total`, `cache_miss_total`, `cache_invalidate_total`; ghi behavior khi cache unavailable.

Cache chỉ là optimization trong lab. Không sửa source-of-truth bằng cách chỉ update Map cache.

## 8. Phase 5 — Fire-and-forget là Phản ví dụ

Tạo một script phản ví dụ riêng, không dùng nó làm implementation cuối:

```text
request handler
  → setTimeout/mockSendReceipt
  → trả accepted
  → process exit trước callback
```

Yêu cầu experiment:

1. Schedule callback rồi chủ động kết thúc process trước khi callback chạy.
2. Evidence cho thấy request đã “accepted” nhưng effect không tồn tại.
3. Liệt kê các capability còn thiếu: persistence, ACK/reservation, retry state, backpressure, idempotency, visibility, DLQ và restart recovery.

Kết luận bắt buộc: unmanaged Promise/`setTimeout` không phải queue. Không để code phản ví dụ được gọi từ success path của worker mock.

## 9. Phase 6 — Deterministic Worker Mock: Retry, Idempotency, DLQ, Outbox

### 9.1 Phạm vi mô phỏng

Dùng state persisted cục bộ (ví dụ một JSON lab-state file ghi bằng Node built-ins) để có thể chạy producer và worker ở hai process/lần chạy khác nhau. State tối thiểu:

```text
businessRecords
outbox[eventId, idempotencyKey, type, status, attempts, nextAttemptAt, safePayloadRef]
processed[idempotencyKey, outcome]
effects[]
deadLetters[eventId, reason, attempts, timestamps]
```

Một lần ghi state mô phỏng “business change + outbox record cùng transaction” cho mục đích học. Phải ghi rõ file JSON **không** cung cấp transaction/durability/concurrency guarantees của PostgreSQL hoặc queue thật.

### 9.2 Producer/outbox behavior

1. Command có `idempotencyKey` tạo business record và outbox event `PENDING` trong cùng lần persist mô phỏng.
2. Chạy producer rồi dừng process trước khi worker chạy; restart worker vẫn thấy event pending.
3. Gửi lại cùng command/key: trả lại recorded outcome hoặc no-op, không tạo hai logical effects.
4. Payload chỉ giữ dữ liệu tối thiểu; không ghi token/password/secret vào outbox/DLQ.

### 9.3 Worker state machine

```text
PENDING/RETRYABLE
  → reserve PROCESSING
  → execute injected behavior
     ├─ success: persist effect + processed key → DONE/ACK
     ├─ transient: attempts++, nextAttemptAt = backoff → RETRYABLE
     └─ permanent/maxAttempts: persist reason/history → DEAD/DLQ
```

Yêu cầu:

- `maxAttempts` hữu hạn, ví dụ 3.
- Exponential backoff có cap và jitter deterministic/fake random; log `nextAttemptAt`, không sleep dài.
- Failure injector theo event id/type: một job success ngay, một job fail transient đúng 2 lần rồi success, một job permanent fail.
- Duplicate replay sau success phải thấy `processed[idempotencyKey]` và không thêm effect.
- Unknown/unexpected error không được ACK như success.
- DLQ có reason class, attempts, first/last failure time và replay eligibility; tạo manual replay command cho case đã sửa, không auto-loop vô hạn.
- Worker shutdown: ngừng reserve job mới, hoàn tất hoặc trả job đang xử lý về retryable trước timeout giả lập.

### 9.4 Failure windows phải giải thích

| Window | Risk | Control / residual risk |
|---|---|---|
| DB/business commit trước enqueue | mất event | outbox cùng transaction |
| Worker nhận job rồi crash trước effect | retry | reservation visibility/lease; mock chỉ mô tả |
| Effect thành công rồi crash trước ACK | duplicate | idempotency/provider key; external effect vẫn cần hỗ trợ |
| Poison message | retry storm | classification, bounded retry, DLQ |

Không tuyên bố “exactly once”. Với email/provider thật, database của ta không thể atomic cùng external side effect; cần provider idempotency/deduplication hoặc chấp nhận residual risk rõ ràng.

## 10. Phase 7 — Metrics, Trace Correlation và Health

### 10.1 Signals

Từ các script, tổng hợp counter/gauge/histogram mock:

- auth: verify success/failure theo low-cardinality reason; hash duration;
- rate limit: allow/deny;
- cache: hit/miss/invalidate;
- worker: processed/retry/DLQ, queue depth, age of oldest pending;
- latency: request/job duration buckets giả lập.

Mỗi producer command tạo `requestId`/`traceId`; outbox mang `eventId` và trace context tối thiểu; worker log/span nối lại các ID đó. Không dùng full token, email hoặc idempotency secret làm trace attribute.

### 10.2 Health matrix

Viết hàm/fixture trả health object an toàn và test ít nhất:

| Scenario | Live | Ready | Reason |
|---|---:|---:|---|
| process bình thường, required config/state writable | true | true | nhận work an toàn |
| thiếu JWT secret lúc startup | process fail fast hoặc false | false | required config thiếu |
| cache optional down | true | true nếu có safe fallback | degraded, metric/alert |
| outbox/state required không đọc/ghi được | true | false | không nhận command làm mất work |
| backlog cao nhưng worker còn tiến triển | true | tùy policy | alert bằng queue-age, không restart mù quáng |

Liveness không kiểm mọi dependency. Readiness không luôn 200. Ghi deploy sequence: config validation → compatible migration → startup → readiness → traffic; shutdown: not-ready → drain → release/retry work → exit có timeout.

## 11. Evidence Checklist

- [ ] Test matrix có expected và observed cho mọi case bắt buộc.
- [ ] Hai bcrypt hash khác nhau; compare đúng/sai đúng; evidence không chứa password/hash.
- [ ] JWT valid/tampered/expired/wrong-secret/missing-secret; không log full token/secret.
- [ ] Automated redaction assertion qua nested/header fixtures.
- [ ] Rate limit N/N+1/reset và hai subjects; cache miss/hit/expiry/invalidation/tenant isolation.
- [ ] Fire-and-forget crash experiment chứng minh accepted nhưng lost work.
- [ ] Producer restart recovery và worker state transitions được lưu bằng text/JSON đã sanitize.
- [ ] Transient job success sau bounded retry; replay không lặp effect; permanent job vào DLQ.
- [ ] Failure-window table và outbox/idempotency limitation note.
- [ ] Structured logs + metrics + correlation IDs; health/deploy matrix có success/degraded/failure cases.
- [ ] `lab-report.md`: Hypothesis → Failure injection → Observed → Control → Residual risk.

## 12. Common Mistakes / Anti-patterns

- Hardcode JWT secret “vì chỉ là lab”, commit `.env`, in token/password/hash khi debug.
- So sánh password hash bằng string equality hoặc dùng fast general-purpose hash.
- `decode()` token rồi tin claims; không verify expiry/algorithm/audience/issuer.
- Redact top-level field nhưng để secret trong nested object/header/error stack/context.
- Rate limit local memory rồi tuyên bố hoạt động chính xác trên nhiều instances.
- Cache không TTL/invalidation/tenant key; update cache nhưng quên source of truth.
- Dùng `setTimeout`/unawaited Promise rồi gọi đó là background queue.
- Retry vô hạn/không backoff; ACK khi unknown error; đưa job vào DLQ nhưng không có owner/replay procedure.
- Idempotency chỉ check trước effect nhưng record kết quả sau ở boundary không atomic.
- Tuyên bố exactly-once trong khi external side effect vẫn có crash window.
- Metric label chứa ID tùy ý; health luôn 200 hoặc liveness phụ thuộc mọi downstream.

## 13. Self-check / Exit Criteria của Lab

- [ ] Mọi test chạy lại cho cùng outcome, không phụ thuộc sleep dài hoặc network.
- [ ] Không credential/secret/full token/hash xuất hiện trong source hardcoded hoặc evidence.
- [ ] Tôi phân biệt signed token với encrypted payload và verify với decode.
- [ ] Cache/rate limit có policy và limitation, không chỉ một `Map` demo.
- [ ] Tôi có evidence thực nghiệm cho lost fire-and-forget work.
- [ ] Retry bounded, backoff, idempotency và DLQ đều có state quan sát được.
- [ ] Outbox mock được mô tả đúng là simulation, không claim durability/exactly-once.
- [ ] Logs/metrics/traces/health map về failure và operator action cụ thể.

## 14. Foundation Gate cuối Tuần — Equipment Lending Domain

Đây là bài **design độc lập**, làm từ trang trắng sau hai lab. Không dùng lại mini commerce artifacts, không dùng Movie Ticket Booking, không scaffold API/database và không code project thật. Có thể dùng tài liệu đã học nhưng phải tự tạo lập luận cho domain mới.

### 14.1 Requirement seed

- Thành viên đang active có thể giữ chỗ một thiết bị đang available trong 15 phút.
- Một thiết bị tại một thời điểm chỉ có tối đa một hold/loan active; một member có tối đa 3 loan active.
- Staff xác nhận checkout; thiết bị phải đi qua lifecycle hợp lệ: `AVAILABLE → HELD → CHECKED_OUT → RETURNED`, hoặc hold `HELD → EXPIRED/CANCELLED → AVAILABLE`.
- Hai request hold cùng thiết bị có thể đến đồng thời; chỉ một request được thắng.
- Mỗi reminder sắp đến hạn phải được xử lý đáng tin cậy; duplicate delivery không được tạo hai logical reminder cùng loại/loan/day.
- Member chỉ xem loan của mình; staff có scope rộng hơn. Token/header/input đều đi qua untrusted boundary.
- Cần tìm thiết bị available theo category và xem loan overdue theo thời gian; history đã checkout/return phải giữ để audit.
- Hệ thống cần deploy mà không nhận traffic khi required store/config chưa sẵn sàng; operator phải phát hiện reminder backlog và failed jobs.

### 14.2 Câu hỏi mơ hồ phải làm rõ

Không tự thêm assumption im lặng. Liệt kê tối thiểu 8 câu hỏi, gồm:

- Hold hết hạn chính xác theo clock/timezone nào và ai chuyển trạng thái?
- “Active loan” có gồm overdue không?
- Thiết bị mất/hỏng và staff override đi theo transition nào?
- Reminder delivery là at-least-once hay mất/duplicate ở mức nào chấp nhận được?
- Category/filter distribution và volume dự kiến là gì?
- Khi member bị deactivate trong lúc đang mượn, history/quyền xem thay đổi ra sao?

### 14.3 Artifacts bắt buộc

1. **Requirement map:** actor, use case, fact, rule, assumption, access pattern, invariant và invalid example.
2. **Conceptual model:** vocabulary, entities/value/relationships/lifecycle; chưa có SQL type/table.
3. **Logical model:** ERD có cardinality/optionality, candidate/primary/foreign/composite keys, functional dependency, normalization và NULL semantics.
4. **Physical model:** PostgreSQL type/constraint decisions, invariant placement, ít nhất 3 index hypotheses và một migration evolution plan expand/backfill/enforce/contract.
5. **State machine:** command/guard/next/side effect; tối thiểu 5 valid và 4 forbidden transitions.
6. **Correctness:** transaction boundary cho hold/checkout; timeline hai concurrent holds; chọn optimistic hoặc pessimistic với affected-row/lock/retry behavior.
7. **Threat/trust model:** asset, boundaries, authn/authz/ownership, secret/token handling, 5 threats với prevent/detect/recover/residual risk.
8. **Reliable reminder:** delivery semantics, idempotency key, retry/backoff, DLQ, outbox states và timeline “effect success nhưng ACK fail”.
9. **Production signals:** structured safe log fields, metrics/alert, trace correlation, liveness/readiness/deploy matrix.
10. **Decision record:** 3 trade-offs bị bác bỏ hoặc còn uncertainty; nêu evidence cần thu thập ở tuần sau.
11. **Microservice context:** chia Gateway, Identity, Catalog-like, Lending/Booking-like và Worker theo capability/data/invariant owner; chỉ ra database nào không được shared, một HTTP flow và một outbox/event flow.

### 14.4 Rubric và Hard Gates

| Nhóm | Điểm | Điều phải chứng minh |
|---|---:|---|
| Requirement → conceptual/logical/physical model | 30 | traceability, cardinality/keys/NULL/normalization/constraints/migration |
| Transaction/concurrency/state | 25 | invariant boundary, race timeline, strategy và forbidden transition |
| Threat/auth/secrets | 20 | trust boundary, object authorization, token/secret lifecycle |
| Reliable delivery | 15 | failure windows, idempotency, bounded retry, DLQ/outbox |
| Observability/deploy health | 10 | failure-to-signal/operator mapping, live/ready semantics |

Service/data ownership phải xuất hiện trong phần Requirement → conceptual/logical/physical model: không có owner rõ hoặc dùng shared database/cross-service transaction như shortcut thì không đạt phần correctness.

Pass khi đạt **≥ 80/100** và không vi phạm hard gate nào:

- Không hardcode/log secret, token, password/hash hoặc sensitive payload.
- Không dùng app-only check để bảo vệ invariant concurrent quan trọng mà không giải thích DB/transaction layer.
- Không dùng unmanaged fire-and-forget như reliable delivery.
- Không tuyên bố index/Exactly-once/health behavior mà không nêu boundary và evidence.
- Tất cả artifacts là design cho Equipment Lending, không copy tên bảng/flow của project thật.

### 14.5 Oral Self-check (10–15 phút)

Không nhìn định nghĩa, tự trình bày:

1. Đi từ một câu requirement đến conceptual relationship, logical key và physical constraint.
2. Vẽ timeline hai hold request và chỉ đúng điểm một request phải thua.
3. Chỉ ra một state hợp lệ nhưng transition sai.
4. Chỉ ra trust boundary và object-level authorization check.
5. Vẽ ba crash windows của reminder và control tương ứng.
6. Nêu signal giúp phát hiện backlog trước khi user báo lỗi và readiness khi store bắt buộc down.

## 15. Interview Drill

- Question: Vì sao fire-and-forget không phải durable queue, và mock worker đã thêm những state/capability nào?
- Follow-ups:
  - JWT tamper, expiry, wrong secret và stolen-valid-token khác nhau ra sao?
  - Idempotency check phải atomic với effect ở boundary nào?
  - Retry/backoff/DLQ/outbox giải quyết failure window nào?
  - Cache key và invalidation sai có thể thành security/correctness bug thế nào?
  - Logs, metrics, traces và readiness sẽ cho biết worker backlog ra sao?
- My answer:
  - ...
