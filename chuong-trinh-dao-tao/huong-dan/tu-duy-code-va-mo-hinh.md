# Tư duy code và mô hình hóa hệ thống

Tài liệu này là trục học xuyên suốt ba tuần nền tảng. Mục tiêu không phải học thuộc thuật ngữ hoặc design pattern, mà là tạo được một quy trình suy nghĩ có thể lặp lại khi gặp bài toán backend mới.

```text
Hiểu bài toán
-> mô hình hóa trạng thái và quy tắc
-> chia boundary và định nghĩa contract
-> dự đoán failure
-> kiểm chứng bằng ví dụ/test/lab
-> code nhỏ nhất đủ đúng
-> refactor và giải thích trade-off
```

## 1. Vòng lặp giải quyết bài toán

Trước khi chọn framework, database hay pattern, hãy trả lời theo thứ tự:

### Bước 1 - Problem framing

- Actor nào đang muốn đạt outcome gì?
- Input và output quan sát được là gì?
- Điều kiện nào luôn phải đúng, kể cả khi request lỗi hoặc chạy đồng thời?
- Happy path, edge case và failure case là gì?
- Điều gì nằm trong scope, điều gì cố ý chưa giải quyết?

Output tối thiểu: một problem statement ngắn, ba ví dụ cụ thể và danh sách assumption.

### Bước 2 - Mô hình hóa

- Dữ liệu nào là identity, value, state và event?
- State nào hợp lệ? Chuyển trạng thái nào được phép?
- Quy tắc nào là invariant, precondition và postcondition?
- Dữ liệu hoặc quyền sở hữu nằm ở boundary nào?

Output tối thiểu: state table hoặc state diagram, data model thô và danh sách invariant.

### Bước 3 - Thiết kế contract và boundary

- Module/hàm/API nhận gì, trả gì và có thể thất bại thế nào?
- Validation nằm ở boundary nào? Business rule nằm ở đâu?
- Phần nào thuần tính toán, phần nào có side effect như DB, network, clock hoặc queue?
- Dependency nên hướng vào policy hay hướng ra framework?

Output tối thiểu: contract, sequence/data-flow diagram và dependency sketch.

### Bước 4 - Chứng minh trước khi mở rộng

- Ví dụ nào chứng minh happy path?
- Counterexample nào có thể phá invariant?
- Test nào cần ở unit, integration và end-to-end?
- Log/metric/evidence nào giúp biết hệ thống thực sự làm đúng?

Output tối thiểu: test matrix có input, expected output/state và failure behavior.

### Bước 5 - Implement, debug, refactor

- Viết lát cắt nhỏ nhất có thể kiểm chứng.
- Khi lỗi, tạo giả thuyết rồi thu thập evidence; không sửa ngẫu nhiên nhiều chỗ cùng lúc.
- Sau khi đúng, refactor tên, duplication, boundary và dependency; test phải tiếp tục giữ nguyên behavior.
- Ghi lại trade-off: phương án đã chọn tối ưu điều gì và chấp nhận mất gì?

## 2. Sáu mental model bắt buộc

| Mental model | Câu hỏi trung tâm | Artifact nên tạo |
|---|---|---|
| Input - Process - Output - State | Hệ thống nhận gì, biến đổi gì, trả gì và thay đổi trạng thái nào? | IPO table, before/after state |
| Contract - Invariant | Điều gì được hứa ở boundary và điều gì luôn phải đúng? | Precondition/postcondition, invariant list |
| Control flow - Data flow | Lệnh chạy theo thứ tự nào và dữ liệu đi qua đâu? | Sequence/data-flow diagram |
| Boundary - Dependency | Trách nhiệm thuộc module nào và code policy đang phụ thuộc vào chi tiết nào? | Module/dependency diagram |
| Time - Concurrency - Failure | Nếu chậm, trùng, chạy đồng thời hoặc chỉ thành công một phần thì sao? | Failure matrix, timeline |
| Cost - Trade-off | Giải pháp cải thiện điều gì và tạo thêm chi phí/độ phức tạp nào? | Decision table hoặc ADR ngắn |

Không được kết luận “đã hiểu” nếu chỉ nhắc lại định nghĩa. Phải dùng được mental model để giải thích một case mới.

## 3. Bộ sơ đồ tối thiểu

| Sơ đồ | Dùng khi nào | Câu hỏi kiểm tra |
|---|---|---|
| System context | Xác định actor, hệ thống ngoài và trust boundary | Ai gọi ai? Dữ liệu nào đi qua boundary? |
| Sequence diagram | Theo dõi một use case qua nhiều component | Thứ tự call, timeout và failure propagation ra sao? |
| State diagram/table | Có vòng đời và chuyển trạng thái | Transition nào hợp lệ? Ai được phép kích hoạt? |
| ERD/data model | Dữ liệu có identity, relation và constraint | Cardinality là gì? Invariant được giữ ở đâu? |
| Module/dependency diagram | Chia controller/application/domain/infrastructure | Dependency có hướng vào business policy không? |

Sơ đồ chỉ cần đủ để ra quyết định. Không chấm điểm vì vẽ đẹp; chấm vì nó làm lộ assumption, coupling và failure case.

## 4. Cách học kiến trúc và design pattern

Không học pattern theo kiểu “tên + UML + code mẫu”. Với mỗi pattern phải đi qua năm câu hỏi:

1. Problem lặp lại nào dẫn đến pattern này?
2. Forces/ràng buộc nào khiến cách đơn giản không còn đủ?
3. Pattern chia responsibility và dependency ra sao?
4. Nó thêm abstraction, indirection hoặc operational cost nào?
5. Khi nào giải pháp đơn giản hơn là lựa chọn tốt hơn?

### Bản đồ pattern cho ba tuần đầu

| Tuần | Mô hình/pattern | Mức cần đạt |
|---:|---|---|
| 1 | Client-server, request-response, request pipeline, resource model, state machine | Vẽ được flow và phân tích timeout, retry, duplicate request, status/error contract |
| 2 | Layered architecture, MVC ở mức so sánh, ports-and-adapters, DI/DIP | Chia được transport, application, domain, persistence và giải thích dependency direction |
| 2 | Strategy, Adapter, Factory, Repository, Observer/pub-sub, Decorator/pipeline | Nhận ra problem phù hợp, nêu trade-off; chưa cần tạo abstraction nếu mới có một implementation |
| 3 | Relational model, unit of work/transaction boundary, optimistic/pessimistic concurrency | Chọn nơi giữ invariant và dự đoán anomaly/race condition |
| 3 | Cache-aside, work queue, retry/idempotent consumer, observability feedback loop, service/data ownership | Giải thích state duplication, delivery semantics, failure recovery và vì sao microservice không dùng shared DB |

Pattern là ngôn ngữ để thảo luận quyết định, không phải checklist phải nhét vào code. “Không dùng pattern” cũng là quyết định hợp lệ nếu bài toán chưa có forces tương ứng.

## 5. Tư duy chất lượng code

Khi đọc hoặc viết một hàm/module, kiểm tra:

- Tên có nói rõ intent thay vì cơ chế không?
- Một unit có một lý do chính để thay đổi không?
- Business rule có bị trộn với I/O hoặc framework decorator không?
- Mutation và side effect có được nhìn thấy rõ ở boundary không?
- Error có được phân loại thành validation, domain, dependency và unexpected không?
- Có duplication của knowledge hay chỉ là hai đoạn code trông giống nhau?
- Abstraction có dựa trên nhu cầu thật hay dự đoán tương lai?
- Test đang kiểm tra behavior hay khóa cứng implementation detail?

Các nguyên tắc KISS, YAGNI, DRY, SOLID không phải luật tuyệt đối. Khi dùng, phải nói được vấn đề cụ thể nó giúp tránh và trade-off nó tạo ra.

## 6. Vòng lặp debug dựa trên evidence

```text
Tái hiện ổn định
-> mô tả expected và actual
-> khoanh boundary đầu tiên sai
-> đưa ra một giả thuyết
-> thu thập log/test/query plan
-> thay đổi một biến
-> chạy lại regression
-> ghi nguyên nhân gốc và cách ngăn tái diễn
```

Phân biệt symptom với root cause. Timeout, `500`, dữ liệu sai hoặc test flaky là triệu chứng; nguyên nhân có thể nằm ở contract, state, race, dependency hoặc assumption sai.

## 7. Output bắt buộc cho một ngày theory deep dive

- Concept map nối khái niệm với backend problem cụ thể.
- Một worked example và một anti-example/counterexample.
- Ít nhất một sơ đồ hoặc decision table phù hợp.
- Bảng happy path, edge case, failure case.
- Một design exercise chưa cần code project thật.
- Năm câu tự kiểm tra, trả lời không nhìn notes.
- Một đoạn teach-back 3-5 phút hoặc 150-250 từ bằng lời của mình.

## 8. Exit criteria trước tuần 4

| Năng lực | Bằng chứng tối thiểu |
|---|---|
| Phân tích yêu cầu | Tách được actor, outcome, input/output, constraint, invariant và failure case |
| Mô hình hóa | Vẽ được sequence, state, ERD và module dependency ở mức đơn giản |
| API thinking | Viết được contract gồm success/error, validation, idempotency và pagination decision |
| Code thinking | Tách pure logic khỏi side effect, chọn boundary, viết test matrix và refactor có lý do |
| Data thinking | Chuyển business rule thành relation/constraint/transaction decision |
| Production thinking | Giải thích được timeout, retry, duplicate, race, cache stale, queue redelivery và observability ở mức nền |
| Trade-off communication | So sánh ít nhất hai phương án và nói rõ điều kiện khiến quyết định thay đổi |

Nếu chưa đạt một exit criterion, bổ sung mini lab hoặc oral review cho đúng lỗ hổng; không bù bằng cách đọc thêm hàng loạt tài liệu không có output.

## 9. Mẫu trả lời một câu thiết kế

```text
Context:
Goal và non-goal:
Assumptions/constraints:
Inputs, outputs và state:
Invariants:
Happy/edge/failure cases:
Boundary và dependency:
Phương án A / B:
Quyết định và trade-off:
Test/evidence:
Điều kiện khiến tôi đổi quyết định:
```
