# Theory Deep Dive: SQL and data modeling: table, relation, normalization, constraints, migration mindset

- **Tuần**: 3
- **Ngày**: Thứ 2
- **Issue**: [#11](https://github.com/vanphutin/education-backend/issues/11)
- **Giai đoạn**: Deep Foundation + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [PostgreSQL Docs - Data Definition](https://www.postgresql.org/docs/current/ddl.html)
- **Nâng cao:** [PostgreSQL Docs - Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- **Thực hành (Lab):** [Boot.dev - Learn SQL Lab](https://www.boot.dev/courses/learn-sql)

## 1. Learning Objectives

Sau buổi học, học viên có thể:

1. Tách requirement thành actor, use case, facts, business rules, access patterns, lifecycle và invariants trước khi nghĩ tới table hoặc ORM.
2. Tách ba mức mô hình: conceptual (business facts/relationships), logical (relational structure/keys/normalization) và physical (PostgreSQL types/constraints/index/migration); truy ngược mỗi quyết định về requirement.
3. Nhận diện entity, value, relationship; vẽ ERD có cardinality và optionality rõ ở cả hai đầu.
4. Chọn candidate/natural/surrogate/composite key và bổ sung business uniqueness thay vì chỉ dựa vào auto-increment ID.
5. Chuẩn hóa thực dụng tới 3NF, nhận biết update/insert/delete anomaly và chỉ denormalize khi có access pattern cùng evidence.
6. Phân biệt `NULL` với giá trị rỗng/0/`false`; dự đoán tác động của SQL three-valued logic lên filter, unique và check.
7. Map invariant vào `NOT NULL`, `UNIQUE`, `CHECK`, `FOREIGN KEY` hoặc transaction/application rule phù hợp.
8. Lập migration theo hướng expand → backfill → validate/enforce → contract, có compatibility và rollback/roll-forward plan.

## 2. Knowledge Map / Mental Models

### 2.1 Chuỗi suy luận bắt buộc

```text
Requirement
  → vocabulary + assumptions
  → facts that must persist
  → identity + lifecycle + ownership
  → relationship + cardinality + optionality
  → business invariants
  → read/write access patterns
  → conceptual model
  → logical relational model
  → physical PostgreSQL model + constraints/index hypotheses
  → migration/evolution plan
```

Không bắt đầu từ tên controller, JSON response hoặc ORM decorator. Schema là mô hình của các facts và rules cần tồn tại lâu hơn một request. Không trộn ba mức: conceptual model không nên bị chi phối bởi `BIGINT`/index; physical model không được xuất hiện mà thiếu logical key/cardinality.

### 2.2 Ba mức mô hình

| Mức | Câu hỏi chính | Không đưa vào quá sớm | Artifact |
|---|---|---|---|
| Conceptual | Business có fact/entity/value/relationship/lifecycle nào? | SQL type, index, ORM annotation | vocabulary + concept map có cardinality nghiệp vụ |
| Logical | Facts map thành relation/key/functional dependency và normalization nào? | PostgreSQL-specific storage tuning | ERD logical, candidate/PK/FK, NULL/normalization decisions |
| Physical | PostgreSQL lưu/enforce/evolve thế nào theo access pattern? | UI/controller shape | DDL decisions, constraints, index hypotheses, migration phases |

Một quyết định phải đi được cả hai chiều: requirement → model decision, và model element → requirement/invariant owner.

### 2.3 Bảng tự diễn giải

Không chép định nghĩa. Với mỗi hàng, học viên phải tự điền cột 2-4 bằng ví dụ của mini domain.

| Concept | Giải thích bằng lời của tôi | Ví dụ/counter-example của tôi | Điều gì có thể hỏng nếu hiểu sai? |
|---|---|---|---|
| Conceptual / logical / physical model | ... | ... | ... |
| Entity, value và relationship | ... | ... | ... |
| Cardinality và optionality | ... | ... | ... |
| Candidate/natural/surrogate/composite key | ... | ... | ... |
| Functional dependency; 1NF/2NF/3NF | ... | ... | ... |
| Intentional denormalization | ... | ... | ... |
| `NULL` và three-valued logic | ... | ... | ... |
| `NOT NULL` / `UNIQUE` / `CHECK` / `FOREIGN KEY` | ... | ... | ... |
| Business invariant | ... | ... | ... |
| Referential action khi update/delete | ... | ... | ... |
| Expand/backfill/enforce/contract migration | ... | ... | ... |

### 2.4 Ba lớp bảo vệ invariant

Với mỗi invariant, tự quyết định và giải thích:

| Lớp | Dùng cho điều gì? | Invariant của mini domain | Failure vẫn còn lại |
|---|---|---|---|
| API/input validation | ... | ... | ... |
| Application/transaction rule | ... | ... | ... |
| Database constraint | ... | ... | ... |

Một invariant quan trọng có thể cần nhiều lớp. App validation cho thông báo thân thiện nhưng không thay thế DB constraint khi nhiều code path hoặc request đồng thời cùng ghi dữ liệu.

### 2.5 Worked example và anti-example

Requirement: “email của user là duy nhất”.

```text
Conceptual: email là định danh liên hệ có business uniqueness của User
Logical: User(email), email là candidate key dù PK có thể là surrogate id
Physical: email NOT NULL + normalized-value uniqueness decision + migration/duplicate cleanup plan
```

Phản ví dụ: thêm `id BIGSERIAL PRIMARY KEY`, giữ `email TEXT` nullable và chỉ gọi `findByEmail()` trước `INSERT`. Hai request đồng thời vẫn có thể chèn duplicate; surrogate key không thay business uniqueness.

## 3. Guided Questions

Trả lời bằng quyết định cụ thể, không trả lời bằng định nghĩa:

1. Fact nào có identity và lifecycle riêng? Fact nào chỉ là value thuộc entity khác?
2. Quan hệ là 1-1, 1-N hay N-N? Mỗi đầu là bắt buộc hay tùy chọn? Bằng chứng nằm ở câu requirement nào?
3. Nếu dùng surrogate key, business rule nào vẫn cần candidate/unique key?
4. Thuộc tính nào phụ thuộc vào toàn bộ key, thuộc tính nào phụ thuộc bắc cầu? Có anomaly nào khi update một fact?
5. `NULL` trong từng cột nghĩa là “chưa biết”, “không áp dụng” hay “chưa thu thập”? Ba trạng thái đó có đang bị trộn không?
6. Dữ liệu nào phải giữ lịch sử thay vì cascade delete?
7. Rule nào có thể diễn đạt bằng một-row constraint? Rule nào cần đọc nhiều row và vì vậy cần transaction/locking?
8. Access pattern nào là quan trọng: filter theo gì, sort theo gì, cardinality dự kiến bao nhiêu? Schema có đang tối ưu theo một màn hình tạm thời không?
9. Khi deploy schema mới trong lúc phiên bản app cũ vẫn chạy, write/read của hai phiên bản còn tương thích không?
10. Migration có backfill lớn hoặc lock table không? Làm sao chia phase, quan sát tiến độ và roll forward khi phase giữa thất bại?

## 4. Anti-patterns / Common Mistakes

- Thiết kế table bằng cách copy nguyên JSON/UI form; mỗi thay đổi giao diện kéo theo schema méo mó.
- Dùng một “god table”, cột JSON tùy ý hoặc danh sách ID phân cách bằng dấu phẩy để né relationship.
- Tạo `id` tự tăng rồi quên constraint cho email, external reference hoặc cặp business key.
- Cho phép `NULL` ở mọi cột để migration “dễ”, nhưng không định nghĩa semantics và query behavior.
- Dùng `CHECK (status IN (...))` nhưng không có state-transition rule; một status hợp lệ vẫn có thể là transition sai.
- Chỉ validation ở application, tin rằng hai request đồng thời không thể vượt qua cùng một check.
- Cascade delete theo thói quen, làm mất audit/history hoặc xóa dây chuyền ngoài dự kiến.
- Denormalize “để nhanh” trước khi có query plan/load evidence và chiến lược đồng bộ dữ liệu.
- Lưu tiền bằng floating point; lưu thời gian nhưng không quyết định timezone/instant semantics.
- Dùng auto-sync schema ở production hoặc migration phá hủy một bước: rename/drop/set-not-null trước khi code và dữ liệu sẵn sàng.
- Coi rollback DDL là kế hoạch duy nhất; với data migration, roll-forward an toàn thường quan trọng hơn.

## 5. Design Exercise — Mini Commerce Domain

Đây là domain độc lập để học, không phải Movie Ticket Booking và chưa cần viết application.

### 5.1 Requirement seed

- Một user có email duy nhất và đúng một wallet.
- User tạo order gồm ít nhất một line item. Quantity phải dương; unit price là giá snapshot tại lúc đặt.
- Order đi qua `DRAFT → PENDING_PAYMENT → PAID` hoặc `PENDING_PAYMENT → CANCELLED`.
- Thanh toán thành công trừ wallet đúng một lần; wallet balance không được âm; một order không được trả tiền hai lần.
- Cần xem 20 order mới nhất của một user, có thể lọc theo status, và xem các line item.
- Dữ liệu order đã thanh toán phải giữ để audit ngay cả khi user ngừng hoạt động.

### 5.2 Nhiệm vụ

1. Viết actor/use case, glossary, assumptions và câu hỏi còn mơ hồ.
2. Lập bảng requirement → fact/rule → owner → persistence → invariant → access pattern.
3. Tạo ba artifact riêng: conceptual map (không SQL), logical ERD (relation/key/normalization), physical decision table (PostgreSQL types/constraints/index hypotheses). Gắn requirement ID vào mỗi element.
4. Trên logical ERD, thể hiện cardinality/optionality; chỉ rõ candidate, primary, foreign và composite keys.
5. Kiểm tra 1NF/2NF/3NF. Nếu giữ một giá trị dẫn xuất như `order.total_amount`, ghi rõ source of truth và cách chống lệch.
6. Lập constraint matrix: rule, app check, DB constraint, lý do và failure còn lại.
7. Viết state table cho order: current state, command, guard, next state, forbidden transition.
8. Thiết kế migration thêm `external_reference` duy nhất và cuối cùng bắt buộc, trong khi app cũ vẫn tạo order. Phải có phase, backfill, verification, rollback/roll-forward.
9. Liệt kê query/access patterns để chuyển thành index hypotheses ở Thứ 3; chưa tạo index theo phỏng đoán.

## 6. Evidence

- `requirement-to-data.md`: glossary, assumptions, requirement map và invariant matrix
- Conceptual map, logical ERD và physical decision table tách riêng; mỗi phần có requirement traceability
- Logical ERD có cardinality/optionality và key annotations
- Normalization note: functional dependencies, anomaly đã loại bỏ, denormalization decision nếu có
- NULL/constraint decision table, gồm ít nhất ba invalid examples mà DB phải từ chối
- State-transition table của order
- Migration evolution plan với compatibility matrix giữa app cũ/app mới và schema cũ/schema mới
- Danh sách câu hỏi chưa chắc chắn; không tự biến assumption thành fact

## 7. Self-check / Exit Criteria

- [ ] Mỗi table/relationship truy ngược được về requirement hoặc invariant.
- [ ] Tôi có thể chỉ vào một quyết định và nói nó thuộc conceptual, logical hay physical model; không để SQL/ORM dẫn dắt conceptual model.
- [ ] ERD thể hiện đúng cardinality và optionality ở hai đầu, không chỉ tên quan hệ.
- [ ] Business uniqueness không bị thay thế bởi surrogate ID.
- [ ] Mỗi `NULL` có semantics rõ; cột bắt buộc có kế hoạch enforce.
- [ ] Ít nhất năm invariants được map vào đúng lớp bảo vệ và có negative example.
- [ ] State machine phân biệt “status hợp lệ” với “transition hợp lệ”.
- [ ] Migration plan không yêu cầu dừng đồng thời mọi instance và không drop/rename phá vỡ ngay phase đầu.
- [ ] Index hypotheses bắt nguồn từ access pattern, được giữ để kiểm chứng ở lab.

## 8. Interview Drill

- Question: Vì sao DB constraint quan trọng hơn app validation trong critical data?
- Follow-ups:
  - Invariant nào không thể biểu diễn bằng constraint trên một row?
  - Surrogate key khác business uniqueness như thế nào?
  - Khi thêm cột `NOT NULL` vào bảng lớn đang phục vụ traffic, bạn triển khai theo phase nào?
- My answer:
  - ...
