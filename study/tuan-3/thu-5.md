# Mini Lab Ticket: Database lab: schema nhỏ, constraints, indexes, EXPLAIN, transaction rollback và lock behavior

- **Tuần**: 3
- **Ngày**: Thứ 5
- **Issue**: [#14](https://github.com/vanphutin/education-backend/issues/14)
- **Giai đoạn**: Deep Foundation + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [PostgreSQL Docs - Transactions Tutorial](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- **Nâng cao:** [PostgreSQL Docs - Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html), [Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html)
- **Tra cứu:** [PostgreSQL Docs - Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html), [Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)

## 1. Lab Goal

Dùng PostgreSQL để kiểm chứng bốn mental models đã học, không dùng ORM hoặc application framework:

1. Database constraint từ chối invalid state dù write path nào tạo dữ liệu.
2. Query plan phụ thuộc query shape, statistics, selectivity và data volume; index không bảo đảm Index Scan.
3. Transaction rollback bảo vệ invariant qua nhiều statements.
4. Lock và version check tạo behavior quan sát được khi hai session cùng sửa một state.

Lab dùng mini commerce schema độc lập, không dùng Movie Ticket Booking và không phát triển project thật.

## 2. Safety và Lab Contract

- Chỉ chạy trên database/schema lab có thể xóa và tạo lại; không dùng shared/staging/production data.
- Toàn bộ DDL/seed/query phải nằm trong script text có thể chạy lại. Screenshot chỉ là phụ trợ.
- Trước mỗi experiment, ghi **Hypothesis**; sau khi chạy ghi **Observed** và **Explanation**.
- Ghi PostgreSQL version, máy/local container và seed size để kết quả có ngữ cảnh.
- `EXPLAIN ANALYZE` thực sự chạy statement. Nếu thử `UPDATE/DELETE`, bọc trong `BEGIN ... ROLLBACK`.
- Hai session phải có nhãn A/B và `lock_timeout` hữu hạn để không để lab treo vô hạn.

## 3. Lab Files

Mọi orchestration, seed và assertion được viết bằng TypeScript trong `src/run-lab.ts`. SQL vẫn giữ ở `schema.sql`/`queries.sql` vì SQL chính là ngôn ngữ cần học; không dùng ORM để che constraint hoặc query plan.

```powershell
cd labs/tuan-3/db-lab
npm install
npm run typecheck
$env:DATABASE_URL='postgresql://postgres:postgres@localhost:5432/backend_lab'
npm run lab
```

Chỉ dùng database local có thể xóa. Script reset các bảng của lab.

Điền vào các file có sẵn; có thể tách thêm file evidence `.md/.txt` trong lúc học nhưng không thay đổi mục tiêu lab:

- `labs/tuan-3/db-lab/schema.sql`: drop/create schema, tables, constraints, seed và `ANALYZE`.
- `labs/tuan-3/db-lab/queries.sql`: negative cases, plan experiments, rollback và concurrency commands.

Mỗi script bắt đầu bằng comment mô tả thứ tự chạy và expected failure nào là chủ đích.

## 4. Phase 0 — Viết Hypotheses trước khi chạy

Tạo bảng dự đoán sau:

| Experiment | Hypothesis | Signal sẽ quan sát | Điều gì bác bỏ giả thuyết? |
|---|---|---|---|
| Constraint | ... | SQLSTATE/message + dữ liệu sau lỗi | invalid row vẫn tồn tại |
| Selective query | ... | plan node, rows, buffers, time | plan/rows khác dự đoán |
| Low-selectivity query | ... | Seq/Index/Bitmap + buffers | planner chọn cách khác |
| Rollback | ... | balance/payment trước-sau | partial update còn lại |
| Row lock | ... | wait/timeout/timeline | B không chờ như dự đoán |
| Optimistic version | ... | affected rows/returned version | cả hai stale writes cùng thắng |

Không sửa hypothesis sau khi đã thấy kết quả; ghi hypothesis mới ở lượt chạy kế tiếp.

## 5. Phase 1 — Schema, Constraints và Negative Cases

### 5.1 Schema tối thiểu

Thiết kế các bảng sau bằng type phù hợp; tự viết SQL thay vì copy solution:

| Table | Columns/relationship tối thiểu | Invariant bắt buộc |
|---|---|---|
| `users` | id, email, balance, created_at | email `NOT NULL` + unique; balance chính xác theo decimal và `>= 0` |
| `orders` | id, user_id, status, amount, version, created_at | FK tới user; amount `> 0`; status thuộc tập cho phép; version `>= 0`; timestamp bắt buộc |
| `order_items` | id hoặc composite identity, order_id, sku, quantity, unit_price | FK; quantity `> 0`; unit_price `>= 0`; một SKU không lặp trong cùng order nếu đó là rule đã chọn |
| `payments` | id, order_id, idempotency_key, amount, created_at | một successful payment/order; idempotency key unique; amount `> 0` |

Phải ghi rõ quyết định `ON DELETE` (`RESTRICT`, `CASCADE`, `SET NULL` hay giữ history) cho từng FK. Không dùng `float/double` cho tiền. Nếu dùng surrogate ID, vẫn phải có business uniqueness.

### 5.2 Constraint matrix

Trước khi viết negative SQL, map tối thiểu 8 rules:

| Rule | Constraint / transaction / app | Invalid input | Expected outcome |
|---|---|---|---|
| email không trùng | `UNIQUE` | cùng email hai user | DB reject |
| balance không âm | `CHECK` | `-0.01` | DB reject |
| ... | ... | ... | ... |

Phải chạy và giữ evidence cho ít nhất các failure sau:

1. Duplicate email.
2. `NULL` ở cột bắt buộc.
3. Negative balance hoặc non-positive amount/quantity.
4. Orphan `order.user_id` hoặc `order_item.order_id`.
5. Duplicate `(order_id, sku)` nếu đã chọn uniqueness đó.
6. Hai payment cho cùng order hoặc duplicate idempotency key.

Sau mỗi expected failure, query lại để chứng minh invalid row không tồn tại. Ghi constraint name/SQLSTATE; không chỉ chụp message.

### 5.3 Invariant không vừa một-row constraint

Chứng minh bằng note, không cần trigger:

- `CHECK (status IN (...))` không ngăn `PAID → DRAFT`.
- `CHECK (balance >= 0)` ngăn số âm tại commit nhưng không tự nối debit với payment/order transition.
- “Order có ít nhất một item khi submit” và “payment amount bằng order amount” cần transaction/application rule hoặc thiết kế khác.

Viết một conditional transition dạng `UPDATE ... WHERE id = ? AND status = ?` và kiểm affected-row count để minh họa guard.

## 6. Phase 2 — Seed đủ lớn và cập nhật Statistics

Seed bằng `generate_series` hoặc script SQL deterministic:

- Ít nhất **1,000 users**.
- Ít nhất **50,000 orders**; mỗi user có nhiều orders.
- Ít nhất **100,000 order_items**.
- Status có phân bố lệch có chủ đích, ví dụ khoảng 70–85% một status và phần còn lại chia cho các status khác.
- Có một số user “hot” nhiều order hơn user thường để kiểm tra data skew.

Sau seed:

1. Query `COUNT(*)`, số distinct, min/max và phân bố status để lưu evidence.
2. Chạy `ANALYZE` (hoặc `VACUUM (ANALYZE)` nếu phù hợp) trước khi so plan.
3. Ghi seed size và distribution thật, không chỉ mục tiêu dự kiến.

Nếu máy yếu, có thể giảm seed nhưng phải tăng dần đến khi plan khác biệt có ý nghĩa và ghi lý do. Không được kết luận hiệu năng từ vài chục rows.

## 7. Phase 3 — Index Hypotheses và `EXPLAIN (ANALYZE, BUFFERS)`

### 7.1 Query shapes bắt buộc

1. **Latest orders:** 20 order mới nhất của một user, sort `created_at DESC`.
2. **Latest orders by status:** cùng query nhưng thêm status.
3. **Low-selectivity:** lấy một status chiếm phần lớn bảng, không `LIMIT` nhỏ.
4. **Join:** orders với users hoặc order_items theo FK.

Với từng query:

- Chạy baseline khi chưa có candidate index ngoài PK/unique bắt buộc.
- Lưu nguyên text của `EXPLAIN (ANALYZE, BUFFERS)`.
- Ghi node, estimated rows, actual rows, loops, rows removed, sort, heap fetch (nếu có), shared hit/read và execution time.
- Tạo một candidate index bắt nguồn từ hypothesis; chạy `ANALYZE` nếu cần và đo lại cùng input.
- Thử ít nhất một composite index, giải thích column order theo equality/filter/sort/range.
- Ghi write/storage cost và xem index có trùng prefix với index khác không trước khi quyết định giữ.

### 7.2 Không hứa Index Scan

Plan hợp lệ có thể là Seq Scan, Index Scan, Index Only Scan hoặc Bitmap Scan. Với low-selectivity query hoặc table/cache nhỏ, Seq Scan có thể rẻ hơn. Nếu planner không dùng index:

1. Không dùng `enable_seqscan = off` để làm “bằng chứng chiến thắng”.
2. Kiểm data volume, distribution/selectivity, `ANALYZE`, query/index column order và estimate-vs-actual.
3. Giải thích lựa chọn bằng rows/buffers/cost; nếu chưa đủ evidence, ghi “chưa kết luận”.

Mục tiêu là dự đoán và giải thích planner, không phải ép output có chữ `Index Scan`.

### 7.3 N+1 experiment

Với page N = 20:

1. Viết query lấy 20 orders rồi mô tả/ghi lại 20 query lấy items theo từng `order_id`: tổng `1 + N = 21` round trips.
2. Viết phương án batch `WHERE order_id IN (...)` và phương án JOIN/preload; tổng query count dự kiến.
3. So plan, số rows trả về và duplication. Giải thích vì sao JOIN một-nhiều có thể làm sai pagination nếu limit sau khi nhân rows.
4. Lập bảng query count cho N = 1, 20, 100; không chỉ so execution time trên localhost.

## 8. Phase 4 — Transaction Rollback Evidence

Tạo một payment đã tồn tại để có idempotency key trùng. Sau đó chạy transaction có ít nhất hai thay đổi:

```text
BEGIN
  đọc balance/order state hiện tại
  debit balance hợp lệ
  insert payment với duplicate idempotency key → expected failure
  order transition (sẽ không được commit)
ROLLBACK
```

Yêu cầu:

1. Capture balance, payment count và order status trước transaction.
2. Statement đầu phải thành công; statement sau phải vi phạm constraint có chủ đích.
3. Quan sát transaction ở aborted state; không tiếp tục giả vờ success.
4. `ROLLBACK`, query lại và chứng minh cả ba giá trị trở về trạng thái trước.
5. Chạy success path với idempotency key mới và `COMMIT`; chứng minh invariant đúng.

Thêm một experiment `SAVEPOINT` là optional; phải giải thích business boundary trước khi dùng partial rollback.

## 9. Phase 5 — Concurrency bằng hai Session

### 9.1 Lock-wait timeline

Mở Session A và B, ghi timestamp/từng statement. Đặt `lock_timeout` hữu hạn ở B (ví dụ vài giây) để experiment tự kết thúc an toàn.

| Step | Session A | Session B | Expected observation |
|---|---|---|---|
| 1 | `BEGIN`; lock user row bằng `FOR UPDATE` |  | A giữ row lock |
| 2 | giữ transaction mở | `BEGIN`; update cùng row | B chờ rồi timeout, hoặc chờ tới A commit ở lượt thử khác |
| 3 | query lock/wait signal nếu có quyền | ghi start/end/error | B chưa thay đổi row khi đang chờ |
| 4 | `COMMIT` hoặc `ROLLBACK` | retry trong transaction mới | behavior phụ thuộc outcome của A |

Chạy hai lượt:

- Lượt 1: để B hit `lock_timeout`, rollback sạch hai session.
- Lượt 2: A commit trước timeout và quan sát B tiếp tục; capture final balance.

Evidence phải là timeline có thời điểm, transaction state và final data; cụm “cửa sổ bị treo” chưa đủ.

### 9.2 Optimistic concurrency timeline

1. A và B cùng đọc một order với `version = v`.
2. A chạy conditional update `... WHERE id = ? AND version = v`, đồng thời tăng version; commit và ghi affected rows/returned version.
3. B dùng version cũ cho conditional update; expected affected rows = 0.
4. B phải detect conflict và chọn reload/reject/bounded retry; không báo success.

So bảng này với `FOR UPDATE`: thời gian chờ, số conflict, retry cost và trường hợp phù hợp.

### 9.3 Deadlock (optional stretch)

Trong database lab riêng, A lock row 1 rồi đợi row 2; B lock row 2 rồi đợi row 1. Capture transaction bị PostgreSQL chọn làm victim, rollback cả hai, rồi viết rule “lock resources theo cùng thứ tự” và bounded retry. Không chạy nếu chưa biết cách cleanup session.

## 10. Phase 6 — Migration Evolution Exercise

Mô phỏng thêm `orders.external_reference` cuối cùng phải unique và `NOT NULL` trong khi old writer chưa gửi field:

1. **Expand:** thêm nullable column, chưa phá old app.
2. **Dual-read/write plan:** mô tả old/new app và schema compatibility; new writer tạo value.
3. **Backfill:** cập nhật theo batch/deterministic rule; đo remaining `NULL` và duplicate.
4. **Validate/enforce:** thêm unique mechanism và `NOT NULL` chỉ sau verification; ghi lock/risk của cách chọn.
5. **Contract:** bỏ fallback/old path ở deploy sau.
6. Ghi roll-forward khi backfill dừng giữa chừng; không mặc định drop column để rollback.

Artifact phải có compatibility matrix old/new app × schema phase và verification query ở mỗi phase.

## 11. Evidence Checklist

- [ ] `schema.sql` chạy lại được trên lab database sạch.
- [ ] Seed counts/distribution, PostgreSQL version và `ANALYZE` evidence.
- [ ] Constraint matrix + ít nhất 6 expected failures + query chứng minh invalid rows không tồn tại.
- [ ] Baseline/after plan text cho 4 query shapes; annotate estimates/actual/loops/buffers.
- [ ] Ít nhất một case giải thích hợp lý vì sao planner không chọn Index Scan.
- [ ] N+1 query-count table và hai phương án sửa có trade-off.
- [ ] Failure transaction rollback và success transaction commit với before/after data.
- [ ] Lock-wait timeline hai lượt và optimistic-version timeline có affected rows.
- [ ] Migration phase/compatibility/verification/roll-forward plan.
- [ ] `lab-report.md`: Hypothesis → Observed → Explanation → Decision cho từng experiment.

## 12. Reflection / Common Mistakes

- Constraint nào bảo vệ từng row, constraint nào bảo vệ business operation nhiều row?
- Vì sao FK không tự động đồng nghĩa index phù hợp với mọi read query?
- Plan thay đổi vì index, vì statistics/data distribution hay vì cache? Evidence nào phân biệt?
- Vì sao `CHECK status` không bảo vệ state transition?
- Transaction có đang giữ lock trong lúc chờ user/network không?
- Nếu B timeout/deadlock, retry có idempotent và bounded không?

Không chấp nhận các kết luận sau nếu thiếu evidence:

- “Có index nên chắc chắn nhanh/Index Scan.”
- “Execution Time thấp hơn một lần là đủ.”
- “Transaction nghĩa là không có race condition.”
- “Session chờ là database bị treo.”
- “Version column tự hoạt động” dù code không kiểm affected-row count.

## 13. Self-check / Exit Criteria

- [ ] Tôi chạy được lab từ database sạch và expected failures không làm script mất kiểm soát.
- [ ] Invalid state bị DB từ chối và rollback không để lại partial business change.
- [ ] Seed đủ để planner có lựa chọn có ý nghĩa, statistics đã cập nhật.
- [ ] Tôi giải thích scan bằng selectivity/rows/buffers, không ép planner.
- [ ] Tôi nhận diện N+1 bằng query growth, không chỉ bằng “cảm giác chậm”.
- [ ] Timeline ghi rõ read/write/wait/commit/rollback của từng session.
- [ ] Stale optimistic write ảnh hưởng 0 row và được coi là conflict.
- [ ] Migration không phá old writer ở phase đầu và có verification/roll-forward.

## 14. Interview Drill

- Question: Một index có thể tồn tại nhưng PostgreSQL vẫn chọn Seq Scan vì sao?
- Follow-ups:
  - `estimated rows`, `actual rows`, `loops` và buffers giúp chẩn đoán gì?
  - Transaction rollback trong lab đã bảo vệ invariant cụ thể nào?
  - MVCC và `FOR UPDATE` ảnh hưởng hai session khác nhau ra sao?
  - Optimistic concurrency phát hiện stale write bằng tín hiệu nào?
  - N+1 khác một query SQL chậm ở mô hình tăng trưởng nào?
- My answer:
  - ...
