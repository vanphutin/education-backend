# Mini Lab Ticket: TypeScript/OOP lab: viết domain mini models, validation rules và error handling không dùng framework

- **Tuần**: 2
- **Ngày**: Thứ 5
- **Issue**: [#9](https://github.com/vanphutin/education-backend/issues/9)
- **Giai đoạn**: Core Theory + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- **Nâng cao:** [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## 1. Lab Goal

Xây một domain model TypeScript nhỏ không dùng framework, chứng minh bằng test rằng:

- invalid Email/User không thể được tạo qua public API;
- Email là Value Object immutable, có normalization và equality rõ;
- User là Entity có identity/equality và chỉ đổi email qua behavior bảo vệ invariant;
- Result và exception có call site/failure semantics khác nhau;
- một refactor giữ nguyên observable behavior;
- lựa chọn Array/Map cho lookup có access pattern và complexity rationale.

Lab này kiểm chứng kiến thức Thứ 2-3, không phải dự án Movie Ticket Booking.

Chạy lab bằng TypeScript strict mode:

```powershell
cd labs/tuan-2/oop-lab
npm install
npm run typecheck
npm test
```

Starter code đã có value object, discriminated union, port và test double. Học viên phải bổ sung ít nhất sáu test, một invariant mới và một adapter in-memory mà không sửa use case.

## 2. Constraints

Tạo folder `oop-lab`, setup Node + TypeScript (`tsc --init`) và bật strict mode.

- Không dùng NestJS, ORM, DI container hoặc validation framework.
- Không dùng `any`, non-null assertion, blind cast `as Email` hoặc public setter.
- Không gọi I/O, clock, random hoặc logger bên trong domain object.
- Có thể dùng test runner sẵn có hoặc `node:assert`; phải chạy test tự động, không chỉ nhìn `console.log`.
- Không cố validate toàn bộ RFC email bằng regex. Hãy công bố validation policy của lab và test đúng policy đó.

## 3. Model Contract — viết trước code

### 3.1 Invariant table

Học viên tự điền decision trước khi implement:

| Object/operation | Invariant | Normalization | Failure type | Owner | Test âm |
| --- | --- | --- | --- | --- | --- |
| `Email.create(raw)` | ... | ... | ... | ... | ... |
| `Email.equals(other)` | ... | ... | ... | ... | ... |
| `User.create(id, name, email)` | ... | ... | ... | ... | ... |
| `User.changeEmail(raw)` | ... | ... | ... | ... | ... |
| `User.equals(other)` | ... | ... | ... | ... | ... |

Policy tối thiểu cần quyết định rõ:

- Input email ban đầu được coi là `unknown` hoặc `string` ở boundary nào?
- Có trim whitespace không? Có lowercase toàn bộ cho scope lab không?
- Phần trước/sau `@` có được rỗng không? Whitespace bên trong có hợp lệ không?
- Equality dùng raw input hay canonical value?
- User ID/name rỗng hoặc chỉ có whitespace được xử lý thế nào?

Ghi rõ đây là application policy của lab, không tuyên bố là bộ kiểm tra email Internet hoàn chỉnh.

### 3.2 State/ownership diagram

```text
raw input
   │ parse + normalize + validate
   ▼
 Email (immutable Value Object)
   │
   ▼
 User (Entity; identity = id)
   │ changeEmail only through method
   └──────────────► new valid Email or typed failure
```

## 4. Lab Requirements (Đề bài)

### Phase A — Characterization baseline

1. Tạo `InvalidEmailError` là error thuần domain, không biết HTTP/framework.
2. Tạo phiên bản nhỏ nhất của `Email` và `User` theo contract.
3. Viết test trước cho behavior hiện tại, gồm happy path và invalid email.
4. Lưu test output/prediction làm baseline trước refactor.

Mục tiêu Phase A là có behavior được khóa bằng test, không phải thiết kế hoàn hảo ngay lần đầu.

### Phase B — Email Value Object

1. `Email` không cho caller khởi tạo bypass validation. Dùng private constructor + static factory hoặc construction boundary tương đương.
2. Validation và normalization phải có thứ tự rõ. Cùng một canonical input không được normalize khác nhau ở các call path.
3. Internal value không mutate được từ ngoài. Không trả shared mutable object.
4. Thêm `equals(other: Email)` dựa trên canonical value và một cách đọc value có chủ đích cho serialization.
5. Factory trả typed outcome; không dùng `null`/boolean để mất thông tin lỗi.

Counter-examples bắt buộc đưa vào test hoặc compile-time evidence:

- gọi constructor/public API để tạo email invalid;
- mutate `email.value` từ ngoài;
- hai raw input khác nhau nhưng normalize về cùng value;
- hai value khác nhau không equal;
- malformed input không phải string.

### Phase C — User Entity và invariant

1. Tạo `User` với `id`, `name`, `email: Email`; public construction phải bảo đảm ID/name/email hợp lệ.
2. Entity equality dựa trên identity, không dựa trên tất cả field. Hai User khác ID nhưng cùng email không equal; cùng ID trước/sau đổi email vẫn là cùng entity.
3. Không cho gán email trực tiếp. `changeEmail(raw)` chỉ cập nhật sau khi email mới hợp lệ; failure không được làm User rơi vào state nửa cập nhật.
4. Quyết định đổi sang cùng canonical email là no-op success hay domain rejection; ghi rule và test.
5. Email Value Object vẫn immutable dù User có state transition. Không mutate object Email cũ.

### Phase D — Result vs Exception

Triển khai hai call style dùng chung một nguồn validation, không copy rule:

- một API trả `Result<T, E>` bằng discriminated union;
- một wrapper/API ném custom exception cho cùng failure.

So sánh ít nhất ba call site:

1. validation/rejection dự kiến và caller muốn hiển thị lỗi;
2. batch xử lý nhiều item, cần tiếp tục sau item lỗi;
3. invariant/programmer failure không dự kiến recover tại local call.

Chọn một style làm public API chính của lab và ghi rationale. Không được kết luận “Result luôn tốt hơn” hoặc “throw luôn đơn giản hơn” mà thiếu failure semantics.

### Phase E — Factory/Strategy decision

- Factory/construction function phải giữ invariant và không cho invalid object lọt qua.
- Chỉ thêm Strategy nếu có ít nhất hai policy email hoặc user thật sự khác nhau trong đề bài do học viên bổ sung.
- Nếu không có variation, từ chối Strategy bằng KISS/YAGNI và ghi dấu hiệu nào trong tương lai khiến decision thay đổi.

Pattern bị từ chối có evidence cũng là output đúng; không cần nhồi pattern vào lab.

### Phase F — Collection và complexity

Tạo một `UserDirectory` nhỏ hoặc pure helper để:

- thêm user theo ID;
- tìm user theo ID;
- chặn/trình bày policy duplicate ID.

So sánh Array + `find` với Map + `get` theo access pattern, N, số lần lookup, ordering/serialization và complexity trung bình. Chọn một implementation, nhưng giữ domain User không biết collection storage.

### Phase G — Safe refactor

Sau khi test matrix xanh, thực hiện đúng một refactor nhỏ, ví dụ:

- tách pure normalization/validation khỏi construction orchestration;
- loại validation bị lặp giữa Result và exception wrapper;
- đổi internal collection từ Array sang Map;
- đổi optional/boolean outcome sang discriminated Result.

Không thêm behavior trong cùng bước. Chạy lại cùng test suite và lưu evidence trước/sau. Nếu cần đổi behavior, tạo một test/change riêng sau refactor.

## 5. Test Matrix

Viết matrix trước test code, tối thiểu 14 cases:

| Case | Input/precondition | Expected Result/Exception/state | Invariant được chứng minh | Test level |
| --- | --- | --- | --- | --- |
| Email hợp lệ | ... | ... | ... | unit |
| Normalize khoảng trắng/case | ... | ... | ... | unit |
| Thiếu local/domain | ... | ... | ... | unit |
| Whitespace bên trong | ... | ... | ... | unit |
| Input không phải string | ... | ... | ... | unit |
| Email equality true/false | ... | ... | ... | unit |
| User ID/name invalid | ... | ... | ... | unit |
| User equality cùng/khác ID | ... | ... | ... | unit |
| Change email hợp lệ | ... | ... | ... | unit |
| Change email invalid không đổi state | ... | ... | ... | unit |
| Change về cùng canonical email | ... | ... | ... | unit |
| Duplicate ID trong directory | ... | ... | ... | unit |
| Result call site | ... | ... | ... | unit |
| Exception wrapper call site | ... | ... | ... | unit |

Thêm compile-time negative evidence cho private/readonly API. Nếu dùng comment như `@ts-expect-error`, phải ghi chính xác lỗi nào được mong đợi; không để nó che lỗi không liên quan.

## 6. Evidence

- Source `Email`, `User`, typed errors/Result và collection helper
- `invariant-decisions.md`: invariant, normalization, equality và ownership table
- Test matrix cùng output test trước refactor, sau refactor
- Compile-time evidence cho construction/mutation bị chặn
- Result-vs-exception comparison với ba call sites và lựa chọn cuối
- Factory/Strategy decision: pattern dùng hoặc bị từ chối, kèm force/trade-off
- Array-vs-Map complexity note dựa trên access pattern
- Refactor note: smell, bước đổi, behavior được giữ, evidence

Không cần chép toàn bộ source vào ticket nếu repository/commit đã chứa source; link đúng file và dán phần evidence ngắn có giá trị review.

## 7. Exit Criteria

- \[ \] Không public path nào tạo được Email/User invalid.
- \[ \] Normalization chạy một lần tại boundary đã định; equality dựa trên canonical semantics.
- \[ \] Email immutable; User chỉ đổi email qua behavior và không partial-update khi failure.
- \[ \] Entity equality và Value Object equality được test bằng counter-examples.
- \[ \] Result và exception dùng chung validation logic; lựa chọn public API có rationale theo failure semantics.
- \[ \] Có ít nhất 14 test cases, gồm boundary/negative/state-preservation cases.
- \[ \] Factory/Strategy không được thêm theo thói quen; KISS/YAGNI decision có evidence.
- \[ \] Array/Map decision có operation, N và complexity trung bình, không chỉ ghi “Map nhanh hơn”.
- \[ \] Cùng test suite xanh trước/sau refactor và không trộn behavior change.
- \[ \] Domain code không import NestJS/HTTP/ORM và không chứa I/O.

## 8. Reflection

- Invalid state nào TypeScript chặn ở compile time, invalid state nào vẫn cần runtime validation?
- Vì sao primitive `string` không diễn tả được invariant/equality của Email?
- Điều gì khác nhau giữa `readonly` compile-time và runtime immutability trong implementation của bạn?
- Vì sao User equality không nên thay đổi khi email đổi?
- Failure nào caller dự kiến xử lý phù hợp Result; failure nào nên propagate bằng exception trong context lab?
- Refactor nào làm cohesion tốt hơn hoặc coupling thấp hơn, và test nào chứng minh behavior giữ nguyên?

## 9. Interview Drill

- Question: Bạn thiết kế Entity/Value Object và invariant trong lab này thế nào để invalid state không lọt qua public API?
- Follow-ups:
  - Equality của User và Email khác nhau ra sao?
  - Vì sao private field + public setter chưa chắc là encapsulation?
  - Result-vs-exception ảnh hưởng contract/call site như thế nào?
  - Refactor nào bạn làm và evidence nào chứng minh không đổi behavior?
  - Khi nào Strategy đáng thêm, khi nào Factory/pure function đã đủ?
- My answer:
  - ...