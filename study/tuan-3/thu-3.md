# Theory Deep Dive: Database performance and consistency: index, query plan, transaction, isolation, locking, N+1

- **Tuần**: 3
- **Ngày**: Thứ 3
- **Issue**: [#12](https://github.com/vanphutin/education-backend/issues/12)
- **Giai đoạn**: Deep Foundation + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [PostgreSQL Docs - Indexes](https://www.postgresql.org/docs/current/indexes.html), [Transactions Tutorial](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- **Nâng cao:** [PostgreSQL Docs - Using EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html), [Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)
- **Tra cứu khi làm bài:** [PostgreSQL Docs - Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html)

## 1. Learning Objectives

Sau buổi học, học viên có thể:

1. Giải thích B-tree bằng đường đi root → internal page → leaf, nêu được lợi ích đọc và chi phí write/storage/vacuum thay vì kết luận “có index là nhanh”.
2. Từ access pattern, cardinality, selectivity, filter, sort và range để đề xuất thứ tự cột của composite index; viết được ít nhất ba index hypotheses có điều kiện kiểm chứng.
3. Đọc `EXPLAIN (ANALYZE, BUFFERS)` ở các điểm: node, cost, estimated/actual rows, loops, filter, sort và buffers; chấp nhận Seq Scan khi đó là lựa chọn hợp lý.
4. Nhận diện N+1 từ số query tăng theo số parent record và đề xuất join, batch load hoặc preloading phù hợp, không “fix” bằng cache theo phản xạ.
5. Đặt transaction boundary quanh một business invariant; giải thích atomicity, consistency, isolation, durability bằng failure cụ thể.
6. Vẽ timeline cho lost update, non-repeatable read, phantom/write skew; liên hệ isolation, MVCC snapshot, row lock và retry.
7. So sánh optimistic concurrency (`version`/compare-and-swap) với pessimistic lock (`FOR UPDATE`) theo contention, conflict cost, latency và failure recovery.
8. Biểu diễn lifecycle bằng state machine gồm command, guard, transition và side effect; từ chối transition sai ngay cả khi target status thuộc tập giá trị hợp lệ.

## 2. Knowledge Map / Mental Models

### 2.1 Từ access pattern tới bằng chứng hiệu năng

```text
Access pattern + data distribution
  → query shape (filter / join / sort / limit)
  → index hypothesis
  → planner statistics
  → estimated plan
  → EXPLAIN ANALYZE + BUFFERS
  → đo và giải thích
  → giữ / sửa / bỏ index
```

Index không phải requirement độc lập. Một đề xuất hợp lệ phải nói rõ query nào, phân bố dữ liệu nào, vì sao thứ tự cột hỗ trợ filter/sort, và metric nào sẽ xác nhận hoặc bác bỏ.

### 2.2 B-tree, selectivity và composite index

| Concept | Mental model cần tự diễn giải | Câu hỏi kiểm chứng |
|---|---|---|
| B-tree | Cấu trúc có thứ tự giúp thu hẹp vùng tìm kiếm; leaf giữ key và tham chiếu row, nhưng heap fetch vẫn có thể cần | Query dùng equality/range/sort nào? Write amplification và dung lượng tăng bao nhiêu? |
| Cardinality | Số giá trị khác nhau trong cột | `status` có 4 giá trị khác `external_reference` gần như duy nhất thế nào? |
| Selectivity | Tỷ lệ row query dự kiến lấy ra | Nếu lấy 40% bảng, random index lookup có còn tốt hơn đọc tuần tự không? |
| Composite index | Thứ tự cột phục vụ prefix, equality/range và sort cụ thể | `(user_id, status, created_at DESC)` hỗ trợ query nào; query chỉ theo `status` thì sao? |
| Covering/index-only | Index có thể chứa đủ dữ liệu, nhưng visibility map và update pattern ảnh hưởng heap fetch | Plan thực tế có `Heap Fetches` không? Lợi ích có đáng write/storage cost? |
| Statistics | Planner ước lượng từ thống kê, không biết dữ liệu thật theo trực giác của developer | Estimated rows lệch actual rows bao nhiêu? Có cần `ANALYZE`, thống kê tốt hơn hay viết lại query? |

### 2.3 Đọc query plan theo thứ tự

1. Đọc từ node con vào node cha để biết dữ liệu được lấy và kết hợp thế nào.
2. So `rows` ước lượng với `actual rows × loops`; lệch lớn thường quan trọng hơn một nhãn “Seq Scan”.
3. Tìm row bị loại ở `Filter`, kiểu join, sort có tràn đĩa và node bị lặp nhiều lần.
4. Đọc `shared hit/read/dirtied` trong `BUFFERS`; execution time một lần chưa đại diện cold/warm cache hay tải production.
5. So cùng query, cùng seed, cùng điều kiện; ghi cả planning time, execution time và plan shape.

> `EXPLAIN ANALYZE` thực sự chạy câu lệnh. Với write query, phải dùng transaction rồi `ROLLBACK` nếu chỉ muốn quan sát.

### 2.4 N+1 là mô hình tăng trưởng query

```text
1 query lấy N orders
+ N query lấy line items của từng order
= N + 1 round trips
```

Ví dụ: trang trả 20 orders nhưng tạo 21 query; khi page size thành 100 thì thành 101 query. Một JOIN không luôn là đáp án duy nhất: batch `WHERE order_id IN (...)`, eager loading có kiểm soát hoặc DataLoader cũng có trade-off về row duplication, memory và pagination.

### 2.5 Transaction boundary theo invariant

Với invariant “debit wallet và đánh dấu order PAID phải cùng thành công hoặc cùng thất bại”:

```text
BEGIN
  lock/check current state
  verify balance and idempotency
  debit wallet
  record payment
  transition order
COMMIT
```

Không đặt boundary theo số dòng code hoặc một repository method. Nếu commit debit trước rồi update order thất bại, atomicity của từng statement vẫn không bảo vệ business invariant.

| ACID | Câu hỏi thực tế |
|---|---|
| Atomicity | Failure ở statement thứ ba có để lại nửa nghiệp vụ không? |
| Consistency | Invariant nào đúng trước và sau commit; ai enforce? |
| Isolation | Hai transaction đồng thời có thể quan sát/can thiệp nhau ở điểm nào? |
| Durability | Sau khi báo thành công, crash có làm mất commit không; external side effect đã nằm trong DB transaction chưa? |

### 2.6 MVCC, anomaly, lock và deadlock

- **MVCC:** reader thường đọc snapshot/version phù hợp thay vì chặn writer; version cũ tạo dead tuples và cần vacuum. MVCC giảm một số blocking nhưng không tự loại mọi race condition.
- **Lost update:** hai request đọc cùng giá trị rồi ghi đè kết quả của nhau.
- **Non-repeatable read:** cùng row được đọc hai lần nhưng thấy hai giá trị đã commit khác nhau.
- **Phantom:** chạy lại predicate query và thấy tập row thay đổi.
- **Write skew:** hai transaction cùng thấy điều kiện hợp lệ rồi cập nhật hai row khác nhau, làm invariant nhiều-row bị phá.
- **Lock:** `FOR UPDATE` khóa row được chọn để serialize critical section; transaction phải ngắn và lock đúng thứ tự.
- **Deadlock:** T1 giữ A đợi B, T2 giữ B đợi A. DB hủy một transaction; application vẫn phải retry có giới hạn và idempotent.

### 2.7 Chọn chiến lược concurrency

| Tiêu chí | Optimistic (`WHERE id=? AND version=?`) | Pessimistic (`SELECT ... FOR UPDATE`) |
|---|---|---|
| Giả định | Conflict hiếm | Conflict có khả năng cao hoặc hậu quả lớn |
| Khi conflict | `UPDATE` ảnh hưởng 0 row; reload/reject/retry | Request đợi lock hoặc timeout/deadlock |
| Chi phí | Retry và UX xử lý stale write | Blocking, giữ connection/transaction lâu |
| Hợp với | Chỉnh sửa profile, back-office form | Trừ số lượng/balance trong critical section ngắn |
| Không giải quyết một mình | Side effect lặp, multi-row invariant phức tạp | External call trong lock, retry không idempotent |

### 2.8 State machine thay cho “set status tùy ý”

| Current | Command | Guard | Next | Side effect sau commit |
|---|---|---|---|---|
| `DRAFT` | submit | có ≥ 1 item | `PENDING_PAYMENT` | tạo payment intent |
| `PENDING_PAYMENT` | pay | đủ balance, payment key chưa dùng | `PAID` | enqueue receipt |
| `PENDING_PAYMENT` | cancel | chưa thanh toán | `CANCELLED` | release reservation |

`CHECK (status IN (...))` chỉ bảo vệ tập trạng thái, không bảo vệ đường chuyển. Câu lệnh có điều kiện như `UPDATE ... WHERE status = 'PENDING_PAYMENT'` cộng transaction/lock hoặc version mới bảo vệ transition trước concurrent request.

## 3. Worked Example và Anti-example

### Ví dụ có lập luận

Access pattern: “lấy 20 order mới nhất của một user, tùy chọn lọc status”. Hypotheses cần tách:

- Không filter status: thử `(user_id, created_at DESC)` để filter + sort + limit.
- Có filter status thường xuyên: thử `(user_id, status, created_at DESC)`.
- Nếu một status chiếm phần lớn dữ liệu, đo lại selectivity; không khẳng định index thứ hai luôn thắng.

Payment command dùng `payment_idempotency_key` duy nhất, transaction ngắn và conditional transition. Receipt chỉ được ghi vào outbox trong transaction; worker gửi sau commit.

### Phản ví dụ

```text
SELECT balance;
if balance đủ:
  gọi payment/email bên ngoài
  UPDATE wallet;
  UPDATE order SET status = 'PAID';
```

Đoạn này có stale read/lost update, external side effect nằm ngoài khả năng rollback, không có idempotency và có thể để wallet/order lệch nhau. Thêm index hoặc bọc riêng từng `UPDATE` trong transaction không sửa được boundary sai.

## 4. Guided Questions

Trả lời bằng timeline, query shape hoặc decision table; không chép định nghĩa:

1. Query nào của domain Thứ 2 cần equality, range, join, sort và limit? Dữ liệu dự kiến phân bố ra sao?
2. Tại sao index `(status, user_id)` và `(user_id, status)` không tương đương cho các access pattern đã nêu?
3. Khi plan vẫn chọn Seq Scan sau khi tạo index, ba giả thuyết hợp lý là gì? Evidence nào phân biệt chúng?
4. Nếu estimated rows là 10 nhưng actual rows là 100,000, planner có thể chọn sai join/scan thế nào?
5. ORM code nào có thể phát sinh N+1? Query count tăng theo N ra sao và cách sửa có ảnh hưởng pagination không?
6. Transaction thanh toán bắt đầu/kết thúc ở đâu? Invariant nào phải đúng tại commit?
7. Vẽ hai session tạo lost update. Read Committed, `FOR UPDATE`, version check thay đổi timeline thế nào?
8. MVCC cho phép reader/writer cùng tiến triển ra sao? Vì sao transaction dài gây hại vacuum và giữ snapshot cũ?
9. Hai code path lấy lock khác thứ tự có thể deadlock thế nào? Chính sách lock ordering và retry là gì?
10. Với pay/cancel cùng lúc, optimistic hay pessimistic phù hợp hơn? Conflict frequency và cost nào dẫn tới quyết định?
11. Status value hợp lệ nhưng transition nào vẫn sai? DB, application service và worker mỗi lớp bảo vệ gì?

## 5. Artifacts / Evidence

- `query-index-hypotheses.md`: ít nhất 3 access patterns; mỗi dòng có data distribution, query shape, candidate index, expected plan, write/storage cost và điều kiện bác bỏ.
- Hai plan text được annotate: node, estimated/actual rows, loops, filter, buffers; có ít nhất một giải thích khi Seq Scan hợp lý.
- `n-plus-one.md`: query-count equation cho N = 1, 20, 100; before/after query shape và trade-off của cách sửa.
- `transaction-boundary.md`: invariant, statements nằm trong transaction, failure point, rollback outcome và external side-effect boundary.
- Hai concurrency timelines: một lost update và một lock wait/deadlock hoặc write skew; mỗi timeline ghi read/write/commit theo thứ tự.
- Decision table optimistic-vs-pessimistic với ít nhất 4 tiêu chí và lựa chọn cho payment transition.
- State-transition table có tối thiểu 4 valid transitions và 3 forbidden transitions.

## 6. Mini Lab Preparation cho Thứ 5

Trước khi chạy SQL, viết dự đoán:

1. Với seed nhỏ và seed lớn, planner sẽ chọn scan nào? Không viết “chắc chắn Index Scan”.
2. Index nào phục vụ query “latest orders” và index nào thừa?
3. Constraint nào sẽ cố ý fail và giá trị nào phải được khôi phục sau `ROLLBACK`?
4. Trong hai session, statement nào chờ lock; dấu hiệu nào chứng minh đang chờ?
5. Với version ban đầu giống nhau, session thắng và session stale sẽ có row count thế nào?

## 7. Common Mistakes

- Tạo index cho mọi foreign key/filter mà không xét query, selectivity, write cost hoặc index trùng prefix.
- Benchmark vài chục row, không `ANALYZE`, so hai lần chạy ở cache state khác nhau rồi kết luận.
- Hứa rằng có index thì PostgreSQL phải dùng Index Scan; coi Seq Scan là lỗi.
- Chỉ đọc execution time, bỏ qua estimate-vs-actual, loops, removed rows và buffers.
- Che N+1 bằng cache trong khi query count vẫn tăng tuyến tính.
- Mở transaction quá sớm, gọi HTTP/email khi đang giữ lock hoặc quên rollback trong error path.
- Tin rằng MVCC nghĩa là “không có lock” hoặc isolation cao nghĩa là application không cần retry.
- Retry deadlock/serialization failure vô hạn, không backoff, không idempotency.
- Dùng optimistic concurrency nhưng không kiểm tra affected-row count.
- Chỉ validate enum status, cho phép `PAID → DRAFT` hoặc pay/cancel cùng thắng.

## 8. Self-check / Exit Criteria

- [ ] Tôi có thể giải thích một plan mà không chỉ nhìn tên scan và execution time.
- [ ] Mỗi index hypothesis truy ngược được về access pattern và có tiêu chí loại bỏ.
- [ ] Tôi chỉ ra được vì sao composite column order phù hợp hoặc không phù hợp.
- [ ] Tôi tính được query count của N+1 và nêu trade-off của ít nhất hai cách sửa.
- [ ] Transaction boundary bảo vệ một invariant được gọi tên; external side effect không nằm mơ hồ trong rollback.
- [ ] Timeline của tôi phân biệt MVCC snapshot, row lock, commit và retry.
- [ ] Tôi chọn optimistic/pessimistic bằng contention và conflict cost, không bằng sở thích.
- [ ] State machine có guards và forbidden transitions, không chỉ danh sách status.

## 9. Interview Drill

- Question: Transaction bảo vệ invariant nào, và vì sao từng statement atomic vẫn chưa đủ?
- Follow-ups:
  - Khi nào Seq Scan tốt hơn Index Scan?
  - Composite index order được quyết định bởi equality/range/sort như thế nào?
  - MVCC khác locking ở mental model nào?
  - Lost update được ngăn bằng version check và `FOR UPDATE` ra sao?
  - Deadlock đã được database phát hiện thì application còn phải làm gì?
- My answer:
  - ...
