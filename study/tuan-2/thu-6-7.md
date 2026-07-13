# Mini Lab Ticket: NestJS mental model lab: module/controller/service/provider mini app, chỉ để hiểu framework như công cụ

- **Tuần**: 2
- **Ngày**: Thứ 6-7
- **Issue**: [#10](https://github.com/vanphutin/education-backend/issues/10)
- **Giai đoạn**: Core Theory + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [NestJS Docs - Controllers](https://docs.nestjs.com/controllers)
- **Nâng cao:** [NestJS Docs - Execution Context](https://docs.nestjs.com/fundamentals/execution-context)


## 1. Lab Goal

Xây một mini app NestJS để chứng minh mental model sau, không chỉ chứng minh decorator chạy:

```text
HTTP request
  → Controller / transport boundary
  → Application service
  → UsersRepository port
  → InMemoryUsersRepository adapter
  → domain/result
  → HTTP response hoặc error translation tại boundary
```

Kết thúc lab, học viên phải thay repository bằng provider override mà không sửa controller/application rule, phân biệt request flow với source dependency và chứng minh error domain/infrastructure không phụ thuộc `HttpException`.

Lab này độc lập, không phải dự án Movie Ticket Booking.

Baseline TypeScript đã thay `Hello World` bằng một port `Clock` được inject qua token để thấy rõ dependency graph và test override. Chạy `npm run build`, `npm test` và `npm run test:e2e`; sau đó tự tạo một missing-provider failure rồi ghi lại token/index/module scope trong error.

## 2. Constraints

- Dùng NestJS cho transport/wiring; không dùng database/ORM hoặc external service.
- Không `new UsersService()` hay `new InMemoryUsersRepository()` bên trong controller/application service.
- Domain và application không import NestJS, Express, HTTP status hoặc `HttpException`.
- Không inject TypeScript interface trực tiếp mà thiếu runtime token.
- Không trả persistence record/internal error thẳng ra HTTP.
- Không thêm generic base repository, event bus hoặc dynamic module nếu lab chưa có force cần chúng.
- Test phải deterministic; không phụ thuộc network ngoài hoặc clock thật.

## 3. Architecture Contract — viết trước code

### 3.1 Request flow và source dependency

Học viên vẽ hai sơ đồ riêng rồi so sánh:

```text
Runtime call:
Client → UsersController → FindUsers/GetUser → UsersRepository → InMemory adapter

Source dependency:
Nest transport ─────► Application/Domain ◄───── In-memory adapter
                              ▲
                              └── repository port contract
```

Đánh dấu:

- composition root/provider binding;
- runtime injection token;
- boundary mapping HTTP DTO ↔ domain/application;
- seam test dùng provider override;
- nơi domain/application error được dịch sang status/body HTTP.

### 3.2 Responsibility table

Tự điền trước khi implement:

| Component | Input | Output | Responsibility | Không được biết |
|---|---|---|---|---|
| `UsersController` | ... | ... | ... | ... |
| Response DTO mapper | ... | ... | ... | ... |
| Application service/use case | ... | ... | ... | ... |
| Domain `User` | ... | ... | ... | ... |
| `UsersRepository` port | ... | ... | ... | ... |
| In-memory adapter | ... | ... | ... | ... |
| HTTP error translator/filter | ... | ... | ... | ... |
| Feature/root module | ... | ... | ... | ... |

## 4. Lab Requirements (Đề bài)

### Phase A — Scaffold và baseline observation

1. Dùng `npx @nestjs/cli new nest-lab` (npm) và chạy test mặc định.
2. Tạo `UsersModule`, `UsersController` và application service/use-case có tên trách nhiệm rõ.
3. Ghi prediction: Nest cần metadata/token nào để dựng graph?
4. Cố ý bỏ repository/application provider hoặc dùng sai token, chạy app/test và lưu nguyên lỗi “can't resolve dependencies”.
5. Annotate lỗi: Nest đang dựng node nào, dependency ở index nào, token/module scope nào bị thiếu? Khôi phục provider trước phase tiếp theo.

Không chỉ chụp lỗi; phải giải thích lỗi bằng dependency graph.

### Phase B — Domain và boundary models

1. Tạo domain `User` tối thiểu có `id` và `name`, giữ invariant cần thiết mà không mang decorator Nest/ORM.
2. Tạo HTTP response DTO hoặc explicit mapper. Controller không trả trực tiếp internal record của adapter.
3. Tạo record/model riêng bên trong in-memory adapter nếu muốn mô phỏng persistence shape khác domain; mapper phải ở đúng boundary.
4. Viết một decision note: trong mini lab nhỏ, model nào được tách và model nào chủ động dùng chung; ghi coupling/risk.

Mục tiêu không phải tăng số class mà là thấy rõ semantics/boundary.

### Phase C — Repository port và in-memory adapter

1. Định nghĩa `UsersRepository` theo nhu cầu use case, tối thiểu `findAll` và `findById`; không tạo CRUD generic không được dùng.
2. Vì interface TypeScript bị erase, chọn runtime provider token: symbol/string/abstract class hoặc lựa chọn có giải thích.
3. Implement `InMemoryUsersRepository` với seed Alice và ít nhất một user nữa.
4. Application service chỉ phụ thuộc port/token contract, không import hoặc construct concrete adapter.
5. Bind token → in-memory adapter tại `UsersModule` hoặc composition root hợp lý.
6. Chứng minh đổi binding/fake không cần sửa application business code.

### Phase D — Endpoints và request flow

Implement:

- `GET /users`: trả danh sách response DTO từ repository qua application service.
- `GET /users/:id`: trả một response DTO hoặc typed not-found outcome.
- Một deterministic failure path cho repository unavailable, được kích hoạt trong test bằng provider override; không cần tạo production endpoint “/error” chỉ để throw.

Với từng endpoint, trace:

1. Nest route matching/controller invocation;
2. constructor-injected application service;
3. port call;
4. adapter mapping;
5. result/error trở lại transport boundary;
6. serialization/status/body.

Controller mỏng không đồng nghĩa chỉ một dòng; nó chịu protocol concerns nhưng không sở hữu business/persistence rule.

### Phase E — Error taxonomy và HTTP translation

Định nghĩa tối thiểu ba category bằng Result hoặc custom error thuần TypeScript:

| Failure | Layer phát hiện | Boundary xử lý | HTTP mapping mong đợi |
|---|---|---|---|
| User không tồn tại | application/domain semantics | transport | 404 |
| Repository unavailable | adapter/application contract | transport + observability | 503 |
| Unexpected/programmer error | bất kỳ | global boundary | 500, không lộ internals |

Yêu cầu:

1. Application/domain không ném `HttpException`.
2. Chọn controller mapper hoặc Nest exception filter để dịch typed failure sang HTTP; ghi trade-off.
3. Response body có contract ổn định, không lộ stack, driver message hoặc internal record.
4. Infrastructure failure giữ cause cho logging/diagnosis nhưng client chỉ nhận thông tin an toàn.
5. Không catch mọi `Error` rồi biến thành 404/Result business; unexpected error phải còn phân biệt.
6. So sánh với phiên bản ban đầu ném `new HttpException(...)` từ service và giải thích coupling gây ra.

### Phase F — Provider override và test seams

Viết tối thiểu:

1. **Domain/application unit tests**
   - Dùng fake/stub repository không qua Nest container.
   - Cases: danh sách thành công, find-by-id thành công, not found, repository unavailable.
   - Assert observable result/state, không assert mọi internal call nếu interaction không phải contract.

2. **Nest integration tests**
   - Dựng `TestingModule`.
   - Dùng `overrideProvider(REPOSITORY_TOKEN).useValue(...)` hoặc API tương đương.
   - Chứng minh controller/application nhận double và không chạm in-memory production adapter.
   - Có một test sai/mất binding để hiểu provider graph; không giữ test đỏ trong final.

3. **HTTP/e2e tests**
   - Gọi `GET /users` và `GET /users/:id`.
   - Assert status + response contract cho success, 404 và 503.
   - Ít nhất một test chứng minh internal message/stack không bị lộ.

Ghi rõ:

- Fake repository không chứng minh database schema/query/transaction nếu sau này thêm DB.
- Nest module integration test chứng minh wiring nhưng không nhất thiết chứng minh HTTP route/serialization.
- E2E với in-memory adapter vẫn chưa phải production database integration.

### Phase G — Dependency/pattern review

1. Vẽ graph final, khoanh composition root, port owner và adapter.
2. Giả lập yêu cầu thêm database adapter: liệt kê file/component nào phải đổi và file nào không nên đổi; chưa implement DB.
3. Giả lập cycle `UsersModule ↔ NotificationsModule`. Đề xuất sửa responsibility/port/event/hợp nhất module trước khi chọn `forwardRef`.
4. Ghi pattern decisions:
   - Repository/Adapter có force gì trong lab?
   - Factory/Strategy/Observer/Decorator nào chưa cần và vì sao?
5. Dùng KISS/YAGNI: xóa abstraction không phục vụ boundary/test/variation đã biết.

## 5. Test Matrix

| Behavior | Test level | Real boundary | Dependency thay | Expected evidence |
|---|---|---|---|---|
| Domain invariant | unit | domain code | none | typed success/failure |
| Application list users | unit | use case | fake repository | result đúng |
| Application not found | unit | use case | stub repository | typed not-found |
| Repository unavailable | unit | use case | throwing/failing stub | category không bị mất |
| Provider graph đúng | integration | Nest module/container | in-memory adapter | module compile |
| Provider override | integration | Nest module/container | fake repository | fake data đi qua graph |
| GET list/single success | e2e | HTTP + Nest graph | in-memory/fake | status + DTO |
| 404 translation | e2e | HTTP boundary | not-found stub | body an toàn |
| 503 translation | e2e | HTTP boundary | failing stub | cause không lộ |
| Missing provider experiment | integration | Nest graph | remove binding | lỗi được giải thích |

Học viên điền test name, setup và expected output; bảng không thay test code.

## 6. Evidence

- Source hoặc link tới controller, application service, domain, port/token, in-memory adapter, mapper/filter và module wiring
- Request-flow diagram và source dependency graph; không gộp hai hướng thành một
- Responsibility table và provider-token decision
- Ảnh/log lỗi missing provider kèm annotation token/index/module scope
- Test output unit/integration/e2e, gồm provider override, 404 và 503
- HTTP response examples chứng minh không lộ stack/internal message
- DTO-domain-persistence separation note
- Pattern/circular-dependency decision và change-impact list khi thêm DB adapter

Không cần dán toàn bộ file vào ticket nếu source đã nằm trong repository; ưu tiên link đúng file, diagram và evidence review được.

## 7. Exit Criteria

- [ ] Request đi qua controller → application → repository port → adapter; không hardcode data ở controller/service.
- [ ] Application/domain không import NestJS, HTTP status, `HttpException` hoặc concrete adapter.
- [ ] Runtime token tồn tại và provider binding nằm tại composition root/module rõ.
- [ ] Repository port mô tả need thật của use case, không phải generic CRUD theo thói quen.
- [ ] DTO/domain/persistence responsibility được phân biệt và mapping nằm ở boundary.
- [ ] Provider override thay adapter thành công mà không sửa business/application code.
- [ ] Missing-provider error được giải thích bằng graph, không chỉ chụp màn hình.
- [ ] 404/503/unexpected 500 được phân loại và dịch tại HTTP boundary; client không thấy stack/internal detail.
- [ ] Unit, integration và e2e tests được phân biệt bằng boundary; limitation của in-memory fake được ghi.
- [ ] Circular dependency/pattern decisions xử lý problem/forces/trade-off, không dùng `forwardRef` hoặc pattern như reflex.

## 8. Reflection

- Request flow và source dependency direction khác nhau ở đâu trong code của bạn?
- Vì sao TypeScript interface không thể tự làm injection token ở runtime?
- Composition root của mini app nằm ở đâu, biết concrete implementation nào?
- Nếu controller tự `new UsersService`, test seam/config/lifecycle bị ảnh hưởng thế nào?
- Vì sao application error không nên là `HttpException` nếu use case còn được gọi từ queue/CLI?
- Fake/stub/mock nào đã dùng và câu hỏi behavior nào khiến lựa chọn đó phù hợp?
- Khi thêm Postgres adapter, test nào còn xanh và test mới nào bắt buộc phải có?

## 9. Interview Drill

- Question: Hãy trace một request NestJS qua dependency graph và giải thích cách repository port/provider override giúp đổi implementation, test và dịch lỗi ở boundary.
- Follow-ups:
  - IoC, DI và DIP xuất hiện ở đâu, và phần nào chỉ là framework mechanism?
  - Interface TypeScript bị erase ảnh hưởng injection token thế nào?
  - Controller/application/domain/repository adapter khác trách nhiệm ra sao?
  - Vì sao not-found và DB unavailable không nên cùng một HTTP status/error type?
  - Unit/integration/e2e test trong lab chạy qua boundary nào?
  - Khi nào `forwardRef` chỉ che một cycle thiết kế?
- My answer:
  - ...
