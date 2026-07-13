# Theory Deep Dive: OOP for backend: encapsulation, composition over inheritance, polymorphism, value object mindset

- **Tuần**: 2
- **Ngày**: Thứ 3
- **Issue**: [#7](https://github.com/vanphutin/education-backend/issues/7)
- **Giai đoạn**: Core Theory + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [TypeScript Handbook - Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html)
- **Nâng cao:** [Martin Fowler - Value Object](https://martinfowler.com/bliki/ValueObject.html)
- **Thực hành (Lab):** [Boot.dev - Learn Object-Oriented Programming Lab](https://www.boot.dev/courses/learn-object-oriented-programming)


## 1. Learning Objectives

Sau buổi học, học viên có thể:

1. Từ requirement, phân biệt entity, value object và service dựa trên identity, lifecycle, equality và nơi sở hữu invariant.
2. Thiết kế object không thể được tạo ở trạng thái invalid; đặt validation/normalization trong factory hoặc constructor boundary có chủ đích.
3. Viết equality semantics cho entity và value object, giải thích vì sao hai object “giống field” chưa chắc là cùng entity.
4. Mô hình hóa lifecycle bằng state-transition table; chặn transition sai thay vì chỉ kiểm tra status có nằm trong enum.
5. Chọn class, pure function, composition, inheritance, Factory, Strategy hoặc State dựa trên hướng thay đổi cụ thể.
6. Đánh giá cohesion/coupling của một model bằng responsibility và dependency; phát hiện ít nhất năm code smells từ code mẫu.
7. Áp dụng SOLID như công cụ chẩn đoán một vấn đề thật, đồng thời dùng KISS/YAGNI để không tạo abstraction chưa có nhu cầu.
8. Lập test matrix bảo vệ behavior rồi thực hiện một refactor nhỏ mà không thay observable behavior.

## 2. Knowledge Map / Mental Models

### 2.1 Domain model bắt đầu từ rule, không bắt đầu từ class

```text
Requirement
  → vocabulary
  → identity + lifecycle
  → invariants
  → owner của invariant
  → command/query
  → class, function hoặc composition phù hợp
```

OOP hữu ích khi object bảo vệ behavior và rule qua thời gian. Tạo class chỉ để chứa field/getter/setter không tự tạo ra domain model.

### 2.2 Entity, Value Object và Domain Service

| Câu hỏi | Entity | Value Object | Domain service/pure function |
|---|---|---|---|
| Equality dựa trên gì? | Identity ổn định | Toàn bộ canonical value | Không có identity riêng |
| Có lifecycle không? | Thường có | Được thay bằng value mới | Thực thi operation |
| Nơi giữ invariant | Method/factory của entity | Constructor/factory của value | Rule liên quan nhiều object hoặc không thuộc tự nhiên object nào |
| Mutation | Có thể thay state qua method hợp lệ | Ưu tiên immutable | Ưu tiên explicit input/output |

Đây là heuristic, không phải luật đặt tên. Học viên phải truy ngược lựa chọn về requirement.

### 2.3 Encapsulation = bảo vệ invariant

Counter-example:

```ts
class Account {
  public balance = 0;
  public status = "active";
}

account.balance = -100;
account.status = "closed";
```

Chỉ đổi field thành `private` rồi tạo setter không giải quyết vấn đề nếu setter vẫn cho mọi value. Một API hành vi như `withdraw(amount)` có thể kiểm tra amount dương, trạng thái account và số dư trong một transition nguyên tử về mặt domain.

```text
command → check invariant/guard → state transition → event/result
                │ fail
                └──────────────→ domain rejection
```

Invariant phải đúng sau khi tạo object và sau mọi public operation. Nếu caller phải nhớ gọi `validate()` sau mutation thì object chưa tự bảo vệ invariant.

### 2.4 Value Object: normalize, validate, compare, replace

Ví dụ `Email` cần một quyết định canonicalization rõ: có trim không, có lowercase phần nào, equality theo raw hay normalized value? Không tự đặt rule “đúng chuẩn Internet” bằng một regex tùy ý; lab phải ghi rõ scope validation.

Counter-example cần phân tích:

```ts
user.email.value = "not-an-email";
```

Nếu value object immutable, thay email nghĩa là tạo `Email` hợp lệ mới rồi entity nhận value mới qua command. Điều này giảm temporal invalid state và aliasing.

### 2.5 Entity identity và equality

```text
User A: id = u-1, email = a@example.com
User B: id = u-2, email = a@example.com
```

Hai entity có cùng thuộc tính hiện tại vẫn có thể là hai identity khác nhau. Ngược lại, cùng một entity trước và sau khi đổi email vẫn là một entity. Business uniqueness của email là invariant khác với entity equality.

### 2.6 State machine thay cho boolean/status rời rạc

| Current state | Command | Guard | Next state | Failure |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |

Enum chỉ giới hạn tên state; state machine còn giới hạn transition. Các boolean `isActive`, `isClosed`, `isSuspended` có thể đồng thời tạo combination mâu thuẫn.

### 2.7 Cohesion và coupling

- Cohesion cao khi data và behavior cùng phục vụ một responsibility/invariant nằm cạnh nhau.
- Coupling là mức một phần biết hoặc phụ thuộc vào chi tiết của phần khác: concrete class, format, timing, shared mutable state hoặc call order.
- Coupling không thể bằng 0; mục tiêu là coupling có chủ ý, đi theo dependency direction rõ và nằm tại seam có thể thay.
- “Một class chỉ có một method” không chứng minh SRP; hãy hỏi có bao nhiêu lý do thuộc các actor/policy khác nhau khiến nó phải đổi.

### 2.8 Chọn class hay function

| Signal | Class/object đáng cân nhắc | Pure function/module đáng cân nhắc |
|---|---|---|
| Identity/lifecycle/state transition | Có | Thường không |
| Invariant cần giữ qua nhiều operation | Có | Có thể truyền state rõ ràng |
| Deterministic transformation | Có thể, nhưng dễ dư thừa | Thường phù hợp |
| Side effect/dependency | Inject qua boundary | Truyền dependency như argument/closure |
| Chỉ gom tên hàm, không có state | Class có thể là ceremony | Module/functions đơn giản hơn |

Không biến mọi noun thành class và cũng không ép mọi stateful domain thành tập function rời rạc. Ghi decision theo forces.

### 2.9 Composition, inheritance và polymorphism

```text
Checkout
  ├─ PricingPolicy
  ├─ TaxPolicy
  └─ PaymentPort
```

Composition ghép các capability độc lập và thay đổi chúng theo seam. Inheritance phù hợp khi có quan hệ “is-a” ổn định và subclass thật sự thay thế được base class cả về behavior, không chỉ có cùng method.

Counter-example: subclass override method nhưng tăng precondition, đổi meaning hoặc ném lỗi mà caller của base không dự kiến. Đây là vi phạm substitutability dù compiler vẫn chấp nhận shape.

### 2.10 Pattern theo problem/forces/trade-off

| Pattern | Problem/force cần xuất hiện trước | Cost phải chấp nhận |
|---|---|---|
| Factory | Construction có validation, nhiều bước hoặc cần che concrete type | Thêm indirection; factory “god object” nếu gom mọi creation |
| Strategy | Có nhiều algorithm thay thế cùng contract và thay đổi độc lập | Nhiều object/interface; không đáng nếu chỉ một case ổn định |
| State | Behavior/transition phụ thuộc state và branching tăng mạnh | Nhiều type, flow bị phân tán nếu state machine nhỏ |

Không học pattern bằng sơ đồ class để tìm chỗ “gắn vào”. Mỗi decision phải có problem, forces, alternative, trade-off và dấu hiệu cần bỏ pattern.

### 2.11 SOLID theo vấn đề, KISS/YAGNI làm phanh

| Heuristic | Câu hỏi chẩn đoán | Không nên biến thành |
|---|---|---|
| SRP | Những policy/actor nào khiến module đổi? | Mỗi hàm một class |
| OCP | Variation nào đã có evidence và cần extension seam? | Interface cho mọi file |
| LSP | Implementation thay thế nhau có giữ contract/behavior không? | Chỉ so method signature |
| ISP | Consumer có bị phụ thuộc method không dùng không? | Hàng chục interface một method vô nghĩa |
| DIP | High-level policy đang biết concrete infrastructure nào? | DI container ở mọi nơi |
| KISS | Thiết kế đơn giản nhất vẫn giữ invariant là gì? | Bỏ qua rule/failure |
| YAGNI | Requirement nào chứng minh abstraction này cần hôm nay? | Cấm mọi thiết kế cho thay đổi đã biết |

## 3. Example / Counter-example Review

### 3.1 Anemic model

```ts
class User {
  id!: string;
  name!: string;
  email!: string;
  status!: string;
}

function changeEmail(user: User, raw: string) {
  user.email = raw;
}
```

Học viên phải annotate:

1. Invalid state nào có thể lọt vào?
2. Object nào nên sở hữu từng invariant?
3. Operation nào là behavior của entity, operation nào có thể là pure function?
4. Simple CRUD nào có thể vẫn chấp nhận anemic model, và dấu hiệu nào cho thấy model đã không còn đủ?

### 3.2 Inheritance trap

```ts
class PaymentMethod {
  charge(amount: number): Promise<void> {
    throw new Error("not implemented");
  }
}

class FreePayment extends PaymentMethod {
  charge(amount: number): Promise<void> {
    if (amount !== 0) throw new Error("only zero is accepted");
    return Promise.resolve();
  }
}
```

Phân tích contract, precondition và caller expectation. Đề xuất composition/strategy nếu requirement thật sự có nhiều payment behavior; nếu chưa có variation, ghi rõ vì sao một function có thể đủ.

### 3.3 Feature envy / misplaced responsibility

Nếu application service liên tục đọc năm getter của entity để quyết định transition rồi set ngược ba field, rule có thể đang nằm sai owner. Ngược lại, entity không nên tự gọi database, gửi email hoặc đọc HTTP request chỉ để “đưa logic vào model”.

## 4. Responsibility & Pattern Decision — tự điền

| Requirement/rule | Owner đề xuất | Invariant được bảo vệ | Alternative | Trade-off |
|---|---|---|---|---|
| Email canonicalization/equality | ... | ... | ... | ... |
| User identity/equality | ... | ... | ... | ... |
| Đổi email | ... | ... | ... | ... |
| Chọn pricing rule theo plan | ... | ... | ... | ... |
| Lấy current time | ... | ... | ... | ... |
| Persist entity | ... | ... | ... | ... |

| Smell quan sát được | Evidence trong code | Refactor candidate | Test bảo vệ | Rủi ro refactor |
|---|---|---|---|---|
| Primitive obsession | ... | ... | ... | ... |
| Feature envy | ... | ... | ... | ... |
| God class / low cohesion | ... | ... | ... | ... |
| Boolean/status soup | ... | ... | ... | ... |
| Shotgun surgery | ... | ... | ... | ... |
| Speculative generality | ... | ... | ... | ... |

## 5. Real Common Mistakes

- Đồng nhất OOP với “bốn tính chất” và syntax class nhưng không xác định identity, invariant hoặc responsibility.
- Dùng `private` + getter/setter cho mọi field; setter công khai vẫn phá invariant như public field.
- Validate ở controller rồi cho entity nhận primitive invalid từ queue, script hoặc test path khác.
- Mutate Value Object sau construction hoặc equality theo object reference thay vì canonical value.
- Equality entity theo tất cả field, khiến entity “khác” sau mỗi update; hoặc chỉ có surrogate ID mà quên business uniqueness.
- Dùng enum status nhưng không kiểm tra transition; boolean flags tạo trạng thái vừa active vừa closed.
- Tạo base class chỉ để reuse vài dòng, subclass không substitutable và inheritance tree gắn chặt các variation.
- Tạo interface/Factory/Strategy/Repository cho variation chưa tồn tại “để tương lai dễ mở rộng”.
- Nhồi validation, persistence, HTTP mapping, logging và notification vào entity để model “giàu”.
- God service làm mọi use case; ngược lại chia thành quá nhiều class một method làm flow khó lần theo.
- Áp SOLID theo số lượng file/class thay vì problem; bỏ KISS/YAGNI và tăng indirection không có test/evidence.
- Refactor đồng thời với đổi behavior, không có characterization tests nên không biết lỗi đến từ đâu.

## 6. Design Exercise — Subscription Domain

Đây là bài thiết kế độc lập, không dùng framework và không thuộc Movie Ticket Booking.

### Requirement seed

- Subscription có identity riêng, gắn với một customer và một plan.
- Billing cycle là monthly hoặc yearly; price phải dương và cùng currency khi so sánh/cộng.
- Lifecycle: trial, active, paused, cancelled. Cancelled không thể active lại; chỉ active mới pause.
- Ngày kết thúc trial được tính từ start time và policy; bài test không được phụ thuộc clock thật.
- Có hai pricing policy thật sự được requirement xác nhận; chưa có yêu cầu cho plugin/dynamic loading.
- Đổi plan không được làm mất identity và phải giữ invariant về currency.

### Nhiệm vụ

1. Viết glossary; phân loại entity, value object và service/function. Ghi evidence từ requirement cho từng lựa chọn.
2. Vẽ object/responsibility diagram và state diagram; lập transition table có guard/failure.
3. Định nghĩa equality cho Subscription, Money và BillingCycle; cho ít nhất hai counter-example.
4. Chọn factory/constructor cho construction và Strategy hoặc simple function cho pricing. So sánh alternative; không tự động chọn pattern.
5. Tách clock thành dependency hoặc explicit input; đánh dấu pure computation và side effect.
6. Vẽ test matrix cho construction, equality, normalization, valid/invalid transition và pricing.
7. Nhận một phiên bản “god service” giả định, liệt kê smells và lập hai bước refactor nhỏ. Mỗi bước phải có test bảo vệ và giữ behavior.
8. Viết một đoạn decision note: vì sao không dùng inheritance hoặc State pattern nếu complexity hiện tại chưa đủ; hoặc evidence nào khiến chúng đáng dùng.

## 7. Evidence

- `domain-model-reasoning.md`: glossary, entity/VO/service decisions và bảng tự diễn giải
- Object/responsibility diagram, state diagram và transition table
- Equality/normalization/invariant table với positive và negative examples
- Class-vs-function và composition-vs-inheritance decision
- Pattern decision có problem, forces, alternative, trade-off; gồm ít nhất một pattern bị từ chối
- Test matrix và kế hoạch refactor hai bước có before/after behavior evidence

## 8. Self-check / Exit Criteria

- [ ] Mỗi class/function tồn tại vì một responsibility hoặc invariant cụ thể, không chỉ vì noun trong requirement.
- [ ] Entity equality dựa trên identity; Value Object equality dựa trên canonical value.
- [ ] Không public operation nào để object kết thúc ở trạng thái invalid.
- [ ] Transition table chặn được status transition sai, không chỉ chặn tên status lạ.
- [ ] Value Object immutable hoặc có lý do rõ nếu không; normalization diễn ra đúng một boundary.
- [ ] Tôi chỉ ra được ít nhất một trường hợp class tốt hơn function và một trường hợp ngược lại.
- [ ] Composition/inheritance/pattern decision có hướng thay đổi thật và trade-off, không dựa vào khẩu hiệu.
- [ ] Mỗi nhận xét SOLID gắn với evidence/code smell; KISS/YAGNI đã loại ít nhất một abstraction dư.
- [ ] Refactor giữ nguyên observable behavior qua test matrix; behavior change được tách khỏi refactor.

## 9. Interview Drill — đúng chủ đề Thứ 3

- Question: Entity khác Value Object ở identity, equality, lifecycle và invariant như thế nào?
- Follow-ups:
  - Encapsulation khác việc đổi field thành `private` ra sao?
  - Khi nào composition tốt hơn inheritance, và làm sao kiểm tra Liskov substitutability?
  - Khi nào pure function phù hợp hơn class?
  - Factory, Strategy và State giải quyết ba force khác nhau nào?
  - Cho một code smell, bạn refactor thế nào để chứng minh không đổi behavior?
  - Làm sao dùng SOLID mà không over-engineer, và KISS/YAGNI đóng vai trò gì?
- My answer:
  - ...
