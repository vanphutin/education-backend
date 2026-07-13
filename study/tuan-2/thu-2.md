# Theory Deep Dive: TypeScript foundation: type, interface, class, generic, error typing, runtime vs compile time

- **Tuần**: 2
- **Ngày**: Thứ 2
- **Issue**: [#6](https://github.com/vanphutin/education-backend/issues/6)
- **Giai đoạn**: Core Theory + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [TypeScript Handbook - The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html)
- **Nâng cao:** [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- **Thực hành (Lab):** [Boot.dev - Learn TypeScript Lab](https://www.boot.dev/courses/learn-typescript)

## 1. Learning Objectives

Sau buổi học, học viên có thể:

1. Dự đoán đoạn code được chấp nhận hay từ chối bởi structural typing, excess-property check và type inference; giải thích bằng tập giá trị thay vì chỉ nói “đúng/sai type”.
2. Mô hình hóa tối thiểu bốn trạng thái bằng union có discriminator và chứng minh xử lý exhaustive bằng `never`.
3. Thu hẹp `unknown` và `null | undefined` bằng guard trước khi sử dụng; không dùng `any` hoặc non-null assertion để né kiểm tra.
4. Viết một generic có constraint dựa trên operation thực sự cần, đồng thời chỉ ra trường hợp generic làm API khó hiểu hơn.
5. Giải thích type erasure và đặt runtime validation đúng tại boundary nhận JSON, env hoặc dữ liệu từ storage.
6. Phân loại một đoạn xử lý thành pure computation hoặc side effect; phát hiện aliasing, mutation ngoài ý muốn và giới hạn của `readonly`.
7. Dự đoán thứ tự chạy cơ bản của synchronous stack, Promise microtask và timer; giải thích vì sao `async` không tự làm CPU work chạy song song.
8. Chọn Array, Map hoặc Set cho một access pattern và nêu complexity trung bình cùng giả định; chọn Result hoặc exception cho một failure cụ thể và nêu trade-off.

## 2. Knowledge Map / Mental Models

### 2.1 Type là tập giá trị và union là tập trạng thái

```text
Requirement
  → states hợp lệ + dữ liệu đi kèm từng state
  → type biểu diễn state space
  → narrowing theo evidence
  → exhaustive handling
```

TypeScript kiểm tra chương trình trước khi chạy. Hãy hỏi “giá trị nào thuộc tập này?” và “trạng thái bất hợp lệ nào type vẫn cho phép?” thay vì hỏi “nên dùng `type` hay `interface` theo thói quen?”.

### 2.2 Boundary: từ dữ liệu chưa tin cậy tới domain type

```text
HTTP JSON / process.env / queue / database row
                    │
                    ▼
                 unknown
                    │ parse + validate + normalize
                    ▼
             validated DTO/value
                    │ construct domain object
                    ▼
             trusted domain code
```

Annotation hoặc assertion chỉ thay đổi điều compiler tin; nó không biến đổi hay kiểm tra dữ liệu runtime. Sau khi compile, interface, union và phần lớn generic không còn tồn tại.

### 2.3 Structural typing: tương thích theo shape

```ts
type HasId = { id: string };

const row = { id: "u-1", role: "admin" };
const value: HasId = row; // shape có ít nhất phần được yêu cầu
```

Counter-example cần phân tích:

```ts
const direct: HasId = { id: "u-1", role: "admin" };
```

Học viên phải dự đoán compiler phản hồi thế nào và giải thích khác biệt giữa object literal được kiểm tra trực tiếp với một biến đã có type. Không kết luận rằng excess-property check là runtime security.

### 2.4 Union có discriminator thay cho “optional-field soup”

```ts
type Delivery =
  | { kind: "queued"; queuedAt: Date }
  | { kind: "sent"; sentAt: Date; providerId: string }
  | { kind: "failed"; failedAt: Date; reason: string };
```

Counter-example:

```ts
type Delivery = {
  status: string;
  queuedAt?: Date;
  sentAt?: Date;
  providerId?: string;
  reason?: string;
};
```

Mẫu thứ hai cho phép những combination vô nghĩa như `status = "sent"` nhưng không có `providerId`, hoặc vừa có `sentAt` vừa có `reason`. Học viên tự liệt kê thêm ba invalid states.

### 2.5 Narrowing là bằng chứng theo control flow

| Công cụ | Evidence dùng để narrow | Rủi ro phải kiểm tra |
|---|---|---|
| `typeof`, `instanceof`, `in` | Runtime observation | Có thực sự phân biệt đủ các nhánh không? |
| Equality/discriminator | Literal value | Discriminator có ổn định và exhaustive không? |
| User-defined type guard | Logic do mình viết | Guard sai có thể nói dối compiler. |
| Assertion `as T` | Không có evidence runtime | Chỉ dùng khi có invariant nằm ngoài khả năng compiler và phải ghi lý do. |
| `unknown` | Buộc kiểm tra trước khi dùng | Phù hợp cho input/error chưa tin cậy. |
| `never` | Không còn giá trị hợp lệ | Dùng để phát hiện nhánh mới chưa xử lý. |

Với `strictNullChecks`, `null` và `undefined` là trạng thái cần mô hình hóa. Optional field không tự nói rõ “không áp dụng”, “chưa tải” hay “không tồn tại”.

### 2.6 Immutability và effect boundary

```text
pure core: input → deterministic result
                         │
effect shell: clock / DB / HTTP / log / random
```

- Pure function không đọc hoặc sửa state ẩn, cùng input cho cùng output và dễ kiểm thử bằng bảng ví dụ.
- `readonly` ngăn gán lại qua reference hiện tại nhưng thường chỉ là shallow compile-time protection; nó không tự `Object.freeze` object lồng nhau.
- Hai biến cùng trỏ vào một object tạo aliasing: mutation qua một alias có thể làm alias kia đổi mà caller không dự đoán.
- Đẩy side effect ra boundary giúp phần rule ở giữa dễ reasoning; không có nghĩa mọi code phải là pure function.

### 2.7 Async/event loop ở mức nền

```text
call stack chạy hết
  → drain Promise microtasks
  → chạy task/timer sẵn sàng
  → lặp lại
```

`await` tạm dừng phần còn lại của async function và continuation được xếp lịch như microtask khi Promise settle. Nó không biến vòng lặp CPU nặng thành non-blocking. I/O concurrency, parallel execution và ordering là ba câu hỏi khác nhau.

### 2.8 Data structure và cost model

| Nhu cầu | Candidate cần so sánh | Cost cần ghi trong quyết định |
|---|---|---|
| Giữ thứ tự, duyệt tuần tự, lấy theo index | Array | access index, scan, insert/delete ở giữa |
| Tra cứu theo key duy nhất | Map hoặc object có kiểm soát | lookup/insert trung bình, memory, serialization |
| Kiểm tra membership/loại trùng | Set | membership/insert trung bình, mất duplicate |

Big-O mô tả tăng trưởng theo kích thước input, không thay benchmark, constant factor hoặc đặc tính dữ liệu thật. Với Map/Set, ghi rõ complexity trung bình thay vì hứa hẹn tuyệt đối.

## 3. Decision Tables — tự điền trước khi xem code chạy

### 3.1 Modeling decision

| Tình huống | Lựa chọn của tôi | Vì sao | Invalid state/failure còn lại |
|---|---|---|---|
| Response có các state loading/success/failure khác data | union hay optional fields? | ... | ... |
| Input JSON từ HTTP | assertion, guard hay parser? | ... | ... |
| API chỉ cần phần tử có `id` | concrete type hay generic constraint? | ... | ... |
| Collection tra cứu user theo id hàng nghìn lần | Array, Map hay Set? | ... | ... |
| Business rejection được caller dự kiến xử lý | Result hay exception? | ... | ... |
| Lỗi programmer/invariant “không thể xảy ra” | Result hay exception? | ... | ... |

### 3.2 Bảng tự diễn giải

Không chép lại handbook. Mỗi hàng phải có ví dụ và counter-example do học viên tự tạo.

| Concept | Giải thích bằng lời của tôi | Ví dụ/counter-example của tôi | Điều gì hỏng nếu hiểu sai? |
|---|---|---|---|
| Structural typing và excess-property check | ... | ... | ... |
| Inference, annotation và assertion | ... | ... | ... |
| Union, discriminator và exhaustive `never` | ... | ... | ... |
| `unknown`, `any`, `never`, nullability | ... | ... | ... |
| `readonly`, aliasing và mutation | ... | ... | ... |
| Generic constraint | ... | ... | ... |
| Type erasure và runtime validation | ... | ... | ... |
| Pure function và side effect | ... | ... | ... |
| Promise microtask và timer task | ... | ... | ... |
| Result và exception | ... | ... | ... |
| Array/Map/Set và Big-O | ... | ... | ... |

## 4. Prediction Exercises

Không chạy code trước khi ghi prediction, reasoning và điều kiện làm prediction thay đổi.

1. Dự đoán compile result của hai ví dụ structural typing ở trên; sau đó thêm một method cùng tên nhưng parameter khác và phân tích compatibility.
2. Viết hàm `assertNever(value: never)` và một `switch` cho `Delivery`. Thêm state `cancelled`; ghi lại compiler giúp tìm thiếu sót ở đâu.
3. Viết `parseDelivery(input: unknown)`. Không dùng `any`, `as Delivery` hoặc thư viện validation. Liệt kê validation nào mới chỉ kiểm tra shape, validation nào là business rule.
4. Cho object `readonly { profile: { name: string } }`; dự đoán những phép gán nào compiler chặn và mutation lồng nào vẫn xảy ra. Đề xuất cách loại aliasing.
5. Chuyển một hàm vừa đọc clock, sinh ID, log và tính expiry thành pure rule nhận `now`/ID từ ngoài cùng effect shell. So sánh test trước và sau.
6. Dự đoán thứ tự log của synchronous statements, `Promise.resolve().then(...)`, một async function có `await`, và `setTimeout(..., 0)`; sau đó chạy ít nhất ba lần để kiểm chứng.
7. Với 100.000 user và 20.000 lookup theo ID, mô tả operation count tương đối của `array.find` và `map.get`; không chỉ ghi ký hiệu Big-O.
8. Thiết kế `Result<T, E>` tối thiểu bằng discriminated union. So sánh call site với một function throw custom error; ghi tiêu chí lựa chọn, không tuyên bố một cách luôn tốt hơn.

## 5. Real Common Mistakes

- Dùng `any` ở controller/repository rồi làm mất type safety trên toàn luồng; cast `req.body as CreateUserDto` và tưởng đã validate input.
- Dùng một object có nhiều field optional cho các state loại trừ nhau, khiến caller phải đoán combination hợp lệ.
- Quên `strictNullChecks`, dùng `!` để dập compiler warning rồi gặp lỗi “cannot read property” ở production.
- Viết type guard luôn trả `true`, hoặc chỉ kiểm tra một field rồi khẳng định toàn bộ object hợp lệ.
- Dùng generic `<T>` không có quan hệ giữa input/output; API trông linh hoạt nhưng implementation phải cast.
- Tin `readonly` là deep immutability hoặc runtime freeze; mutate array/object thông qua alias.
- Trộn DB/log/clock vào rule, khiến unit test phụ thuộc môi trường và lỗi khó tái hiện.
- Dùng `forEach(async ...)` rồi tưởng outer function chờ mọi Promise; hoặc tuần tự `await` các I/O độc lập mà không chủ ý.
- Cho rằng `setTimeout(..., 0)` chạy ngay; không phân biệt call stack, microtask và task.
- Dùng `Array.find` trong nested loop dù access pattern là lookup-by-key; hoặc dùng Map cho collection nhỏ mà không có nhu cầu key lookup.
- Catch `unknown` rồi truy cập `error.message` không narrow; catch mọi lỗi và trả cùng một business Result, làm mất programmer/infrastructure failure.
- Dùng exception cho mọi validation dự kiến hoặc Result cho mọi lỗi bất ngờ mà không xét call chain, logging và transaction boundary.

## 6. Design Exercise — Notification Dispatch

Đây là bài tập độc lập, chưa dùng NestJS và không thuộc dự án Movie Ticket Booking.

### Requirement seed

- Input đến từ JSON nên ban đầu là `unknown`.
- Notification có channel `email | sms`; mỗi channel cần payload khác nhau.
- Lifecycle gồm queued, sending, sent và failed; chỉ một số transition được phép.
- Mỗi request có `id`; cần loại duplicate trong một batch và tra cứu state theo ID.
- Rule tính thời điểm hết hạn phải kiểm thử được mà không dùng clock thật.
- “Địa chỉ không hợp lệ” là rejection dự kiến; “provider trả payload không thể hiểu” là integration failure cần được quan sát.

### Nhiệm vụ

1. Vẽ data-flow từ unknown input qua validation/normalization tới domain state.
2. Thiết kế union cho command và lifecycle; liệt kê tối thiểu năm invalid combinations mà model loại bỏ.
3. Viết pseudocode parser/guard và chỉ rõ phần nào vẫn phải runtime validate sau khi compile.
4. Viết state transition bằng pure function; chọn Result hoặc exception cho từng failure và ghi lý do.
5. Tách clock/provider/log thành effect boundary; đánh dấu function nào pure.
6. Chọn Array/Map/Set cho batch, dedup và lookup; ghi operation, N và complexity trung bình.
7. Viết ba compile-time prediction tests và sáu runtime test cases, gồm null, malformed input, duplicate và forbidden transition.

## 7. Evidence

- `typescript-reasoning.md`: bảng tự diễn giải, decision tables và prediction trước/sau khi chạy
- Type/state diagram và data-flow boundary diagram
- Code/pseudocode cho parser, exhaustive reducer, pure rule và Result-vs-exception comparison
- Bảng Array/Map/Set: access pattern, operation, N, complexity, trade-off
- Test matrix có happy path, boundary, malformed input và invalid transition
- Một đoạn reflection 150-250 chữ: type nào loại lỗi compile-time, lỗi nào vẫn cần runtime defense

## 8. Self-check / Exit Criteria

- [ ] Tôi giải thích structural typing bằng shape/tập giá trị và dự đoán được excess-property behavior trong ví dụ.
- [ ] State union không có field optional chỉ để “phòng khi cần”; thêm state mới làm exhaustive handler báo lỗi.
- [ ] Mọi external input bắt đầu là `unknown` và chỉ trở thành trusted type sau validation.
- [ ] Không dùng `any`, non-null assertion hoặc blind assertion để làm bài qua compiler.
- [ ] Tôi chỉ ra được `readonly` nào shallow và mutation nào đến từ alias.
- [ ] Generic constraint chỉ chứa operation implementation thực sự cần.
- [ ] Tôi dự đoán đúng thứ tự sync/microtask/timer và không gọi CPU work là async I/O.
- [ ] Mỗi lựa chọn Array/Map/Set và Result/exception có access pattern/failure semantics cùng trade-off cụ thể.
- [ ] Tôi có ít nhất hai prediction sai ban đầu và ghi rõ mental model đã sửa; không sửa evidence cho “đẹp”.

## 9. Interview Drill — đúng chủ đề Thứ 2

- Question: Vì sao TypeScript type không thể thay thế runtime validation cho request JSON?
- Follow-ups:
  - Structural typing khác nominal typing ở điểm nào và excess-property check có bảo vệ runtime không?
  - Khi nào discriminated union tốt hơn object có nhiều optional field?
  - `unknown`, `never` và `any` thể hiện ba ý nghĩa khác nhau nào?
  - Result và exception khác nhau ở call-site contract và failure propagation ra sao?
  - Vì sao Promise không làm CPU-bound loop chạy song song?
  - Khi nào Map đáng dùng hơn Array và Big-O chưa nói cho ta điều gì?
- My answer:
  - ...
