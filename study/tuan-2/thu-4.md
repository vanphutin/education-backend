# Theory Deep Dive: Dependency Injection and modular design: why DI exists, dependency direction, testability

- **Tuần**: 2
- **Ngày**: Thứ 4
- **Issue**: [#8](https://github.com/vanphutin/education-backend/issues/8)
- **Giai đoạn**: Core Theory + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [NestJS Docs - Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers)
- **Nâng cao:** [NestJS Docs - Dynamic Modules](https://docs.nestjs.com/fundamentals/dynamic-modules)
- **Thực hành (Lab):** [Full Stack Open - Testing Node.js Lab](https://fullstackopen.com/en/part4/testing_the_backend)


## 1. Learning Objectives

Sau buổi học, học viên có thể:

1. Vẽ object/dependency graph của một request, đánh dấu nơi construct object và nơi chỉ sử dụng dependency.
2. Phân biệt IoC, DI và DIP ở ba mức control flow, wiring mechanism và source-code dependency; đưa được counter-example cho từng khái niệm.
3. Xác định một composition root và giải thích vì sao business code không nên tự gọi container hoặc tự `new` infrastructure dependency.
4. Tách controller/DTO, application use case, domain model, repository port và persistence adapter; chỉ ra dependency direction giữa chúng.
5. So sánh layered architecture với ports-and-adapters theo boundary và trade-off, không biến folder structure thành “kiến trúc”.
6. Phát hiện circular dependency từ responsibility/dependency graph và đề xuất ít nhất hai cách sửa nguyên nhân trước khi dùng `forwardRef`.
7. Chọn fake, stub, spy hoặc mock theo câu hỏi kiểm thử; phân biệt unit, integration và end-to-end test bằng boundary thực sự được chạy.
8. Đánh giá Strategy, Adapter, Factory, Repository, Observer và Decorator bằng problem/forces/alternative/trade-off; từ chối pattern khi chưa có evidence.

## 2. Knowledge Map / Mental Models

### 2.1 Dependency graph trước framework decorator

```text
UsersController
      │ uses
      ▼
FindUsers
      │ depends on port
      ▼
UsersRepository  ◄──── InMemoryUsersRepository
   abstraction              implementation
```

Graph cho biết object nào cần object nào để hoàn thành responsibility. DI container chỉ là một cách dựng graph; container không tự làm dependency direction tốt.

Tách hai thời điểm:

```text
composition time: tạo implementation + nối graph
runtime/use time: object nhận dependency và thực thi use case
```

Nếu application service tự `new PostgresUsersRepository()`, construction và use bị trộn; policy biết concrete infrastructure và test khó thay seam.

### 2.2 IoC, DI và DIP không đồng nghĩa

| Khái niệm | Câu hỏi nó trả lời | Ví dụ cần tự diễn giải |
|---|---|---|
| Inversion of Control | Ai điều khiển lúc code của ta được gọi/lifecycle? | Framework gọi controller/hook; callback được runtime gọi |
| Dependency Injection | Object nhận dependency từ đâu thay vì tự tạo? | Constructor parameter được composition root/container cung cấp |
| Dependency Inversion Principle | Source dependency giữa high-level policy và low-level detail trỏ theo hướng nào? | Use case sở hữu/tiêu thụ port; adapter phụ thuộc contract đó |

- Có thể DI mà không có container: manual constructor injection tại `main`.
- Có thể dùng container nhưng vẫn vi phạm DIP: inject concrete repository vào business service.
- IoC rộng hơn DI; framework điều khiển lifecycle là IoC ngay cả khi dependency design vẫn tệ.

### 2.3 Composition root

```text
                 Composition Root
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   config/clock    repository      external client
        └──────────────┼──────────────┘
                       ▼
                 application graph
```

Composition root là nơi biết concrete implementation và policy cấu hình. Trong NestJS, root/feature module provider wiring thường tham gia vai trò này. Không truyền container vào domain/application như service locator.

Lưu ý TypeScript interface bị erase ở runtime. Nest cần runtime token như class/abstract class, string hoặc symbol để phân giải provider; interface thuần không thể tự làm injection token.

### 2.4 Request flow khác dependency direction

```text
Runtime request flow:
HTTP → Controller → Application Service → Repository Port → Adapter → DB

Source dependency:
HTTP adapter ───────► Application/Domain ◄────── Infrastructure adapter
                              │
                              └── owns/uses port contract
```

Call có thể đi từ application ra adapter, nhưng source code của application chỉ biết port. Hai mũi tên không nhất thiết cùng hướng; nhầm chúng dẫn đến “controller gọi service gọi repository” nhưng mọi layer vẫn import concrete framework/ORM lẫn nhau.

### 2.5 Layers và Ports-and-Adapters

| Boundary | Trách nhiệm | Không nên biết |
|---|---|---|
| Transport/controller | Parse protocol, validate DTO, auth context, gọi use case, map result/error sang HTTP | SQL/ORM, business transition chi tiết |
| Application/use case | Orchestrate một user goal, transaction boundary, gọi domain/ports | HTTP status/decorator, concrete DB/client |
| Domain | Entity, Value Object, invariant, pure policy/state transition | NestJS, DTO, ORM model |
| Port | Contract application cần từ bên ngoài | Concrete driver/config |
| Adapter/infrastructure | Thực thi port với DB/API/queue/clock | Quyết định business policy |

Layered architecture nhấn mạnh tầng trách nhiệm và hướng gọi; ports-and-adapters nhấn mạnh application core cùng inbound/outbound contracts. Có thể kết hợp, nhưng thêm layer/port chỉ đáng giá khi boundary giúp thay đổi hoặc test một concern thật.

### 2.6 DTO, Domain và Persistence Model

```text
CreateUserHttpDto
      │ validate/map
      ▼
CreateUserCommand → User/Email domain
                         │ map
                         ▼
                   UserPersistenceRow
```

- DTO thuộc contract transport, có optional/default/string format theo protocol.
- Domain type biểu diễn invariant và vocabulary; không mang HTTP decorator.
- Persistence model phản ánh schema/ORM concern; có thể có column, relation, serialization khác domain.

Counter-example: trả thẳng ORM entity từ controller, dùng cùng class cho request DTO và domain entity. Một thay đổi column có thể làm API đổi ngoài ý muốn, lazy relation/secret field bị lộ và invalid transport state đi sâu vào domain.

Không bắt buộc tạo ba class cho mọi CRUD nhỏ. Hãy tách khi semantics, lifecycle hoặc tốc độ thay đổi khác nhau; ghi trade-off nếu chủ động dùng chung.

### 2.7 Responsibility map

| Thành phần | Input/Output điển hình | Failure nó nên biết | Side effect |
|---|---|---|---|
| Controller | HTTP DTO ↔ response DTO | Protocol/auth/translation | Giao tiếp HTTP |
| Application service | Command/query ↔ result | Use-case/business/infrastructure category | Orchestrate ports/transaction |
| Domain object/function | Valid domain values ↔ transition/result | Invariant/domain rejection | Ưu tiên không có I/O |
| Repository port | Domain-oriented query/save contract | Contract-level unavailable/conflict semantics | Mô tả persistence need |
| Adapter | Port call ↔ DB/API mechanics | Driver/network/serialization | Thực thi I/O |

“Service” quá chung. Mỗi service phải nói rõ application orchestration, domain policy hay infrastructure client.

### 2.8 Circular dependency là tín hiệu thiết kế

```text
A → B → C → A
```

Cycle làm initialization, reasoning, testing và deploy boundary khó hơn. Các hướng xử lý cần xét trước:

1. Di chuyển responsibility dùng chung vào owner đúng.
2. Tách contract/port nhỏ theo consumer.
3. Hợp nhất hai module nếu chúng thực sự là một cohesive unit.
4. Dùng domain event/callback khi coupling là temporal notification và chấp nhận eventual behavior.
5. Đảo source dependency qua port nếu high-level policy đang import detail.

`forwardRef` có thể giải quyết wiring tạm thời nhưng không tự sửa responsibility hoặc coupling.

### 2.9 Test seam, doubles và test levels

| Double | Nó cung cấp gì? | Dùng khi câu hỏi là gì? | Rủi ro |
|---|---|---|---|
| Stub | Canned input/response | Code xử lý một dependency response ra sao? | Test gắn vào setup nếu stub quá chi tiết |
| Fake | Implementation nhẹ nhưng chạy được, ví dụ in-memory repository | Nhiều behavior với state nhưng không cần hệ thống thật | Có thể khác semantics DB thật |
| Spy | Ghi lại call | Side effect có được yêu cầu đúng không? | Dễ test implementation detail |
| Mock | Expectation về interaction | Protocol/collaboration quan trọng có được tuân thủ không? | Brittle nếu mock mọi internal call |

Test level phải định nghĩa bằng boundary:

- Unit: một unit behavior, dependency ngoài được thay; không đồng nghĩa “một method”.
- Integration: ít nhất hai boundary/implementation thật tích hợp, như Nest provider graph hoặc repository với DB.
- End-to-end: đi qua transport và các thành phần gần production nhất trong scope.

Số lượng file không quyết định level. In-memory fake không chứng minh SQL mapping/constraint đúng; vẫn cần adapter integration test khi có database thật.

### 2.10 Pattern decision matrix

| Pattern | Problem/forces | Alternative đơn giản | Trade-off/rủi ro |
|---|---|---|---|
| Strategy | Nhiều algorithm thay thế cùng contract | Function/switch nhỏ | Thêm interface/object graph |
| Adapter | External API/driver không khớp port của app | Mapping function trực tiếp | Mapping/translation layer cần bảo trì |
| Factory | Construction phức tạp, invariant hoặc chọn concrete type | Constructor/function | Có thể thành god factory |
| Repository | App cần collection-like persistence contract theo domain | Query/service trực tiếp cho CRUD nhỏ | Che mất query capability, dễ generic repository quá mức |
| Observer/domain event | Nhiều reaction độc lập với event | Gọi trực tiếp | Ordering, failure, consistency khó hơn |
| Decorator | Thêm cross-cutting behavior quanh cùng contract | Explicit wrapper/call | Call stack/ordering khó thấy |

Pattern không phải mục tiêu. Với mỗi pattern, phải nêu problem đã quan sát, forces, alternative, cost và tiêu chí bỏ pattern.

## 3. Example / Counter-example Review

### 3.1 Hidden dependency

```ts
class UsersService {
  private readonly repository = new PostgresUsersRepository();
  private readonly clock = new SystemClock();
}
```

Phân tích:

1. Những concrete detail nào high-level policy đang biết?
2. Unit test phải chạm hệ thống thật nào?
3. Configuration/lifecycle nằm ở đâu?
4. Constructor injection nào là đủ; có cần container không?

### 3.2 Service locator

```ts
class CreateUser {
  execute(input: Input) {
    const repository = container.get("UsersRepository");
    // ...
  }
}
```

Dependency bị ẩn khỏi API của object, type contract không nói nó cần gì và application code phụ thuộc container. Học viên chuyển dependency thành explicit constructor input và đưa lookup về composition root.

### 3.3 Token mismatch

```ts
interface UsersRepository {
  findAll(): Promise<User[]>;
}
```

Học viên giải thích vì sao interface này không tồn tại ở runtime để Nest inject trực tiếp, rồi so sánh symbol token, abstract class token và concrete class token theo coupling/testability.

### 3.4 Framework leakage

Một domain method ném `HttpException`, entity có ORM decorators và use case nhận `Request`. Liệt kê điều gì xảy ra nếu cùng use case được gọi từ queue/CLI; đề xuất boundary translation mà không điền implementation của lab.

## 4. Architecture Decisions — tự điền

### 4.1 Dependency graph

Vẽ graph cho use case “find user by id”, đánh dấu:

- node thuộc transport/application/domain/infrastructure;
- edge source import và edge runtime call;
- port owner;
- composition root;
- seam thay bằng fake;
- nơi domain failure được dịch sang HTTP.

### 4.2 Decision table

| Decision | Lựa chọn | Evidence/force | Alternative | Trade-off |
|---|---|---|---|---|
| Manual DI hay Nest container | ... | ... | ... | ... |
| Runtime injection token | ... | ... | ... | ... |
| Layered hay thêm port-adapter boundary | ... | ... | ... | ... |
| DTO/domain/persistence dùng chung hay tách | ... | ... | ... | ... |
| Fake/stub/mock cho unit test | ... | ... | ... | ... |
| Sửa cycle giữa Users và Notifications | ... | ... | ... | ... |
| Pattern được dùng | ... | ... | ... | ... |
| Pattern bị từ chối | ... | ... | ... | ... |

### 4.3 Test-boundary matrix

| Behavior cần chứng minh | Boundary thật | Dependency thay | Double | Vì sao level này đủ/chưa đủ |
|---|---|---|---|---|
| Domain invariant | ... | ... | ... | ... |
| Application orchestration | ... | ... | ... | ... |
| Nest provider wiring | ... | ... | ... | ... |
| Repository mapping/query | ... | ... | ... | ... |
| HTTP error translation | ... | ... | ... | ... |

## 5. Real Common Mistakes

- Gọi IoC, DI và DIP là một; nghĩ dùng `@Injectable()` đồng nghĩa kiến trúc đã decoupled.
- Inject concrete ORM repository/client thẳng vào mọi use case, khiến business policy phụ thuộc persistence detail.
- Dùng service locator hoặc global singleton; dependency ẩn, test order phụ thuộc shared state.
- Tạo interface một-một cho từng class nhưng interface nằm cùng infrastructure và không phản ánh need của consumer.
- Dùng generic repository `findAll/create/update/delete<T>` cho mọi domain, làm mất query semantics, invariant và transaction need.
- Controller chứa business rule hoặc application service biết status code/decorator; domain ném `HttpException`.
- Dùng một model cho DTO/domain/ORM rồi lộ password/internal column hoặc coupling API với schema.
- Module import hai chiều rồi thêm `forwardRef` ở mọi nơi thay vì sửa responsibility/cycle.
- Mock mọi collaborator và assert từng call nội bộ; refactor không đổi behavior vẫn làm test vỡ.
- Chỉ dùng in-memory fake rồi tin persistence adapter đúng; bỏ integration test cho mapping/constraint/query.
- Thêm event/observer cho call cần đồng bộ/transactional mà không quyết định ordering, retry và failure semantics.
- Áp hexagonal/clean architecture bằng số lượng folder, không có boundary hoặc lý do thay đổi thật.

## 6. Design Exercise — Users Directory Architecture

Đây là bài chuẩn bị cho mini lab NestJS, độc lập với dự án thật.

### Requirement seed

- `GET /users` trả response DTO, không trả persistence record trực tiếp.
- `GET /users/:id` trả 404 nếu không có user.
- Application có thể chạy với in-memory repository; sau này có thể thêm database adapter nhưng chưa implement DB.
- Domain/application không import NestJS hoặc `HttpException`.
- Test cần thay repository provider để ép success, not-found và unavailable.
- Một adapter failure phải được dịch thành HTTP response tại transport boundary và vẫn giữ cause để log/observe.

### Nhiệm vụ

1. Vẽ request-flow diagram và source dependency graph; đánh dấu hai hướng khác nhau.
2. Lập responsibility table cho controller, DTO mapper, application service, domain User, repository port và in-memory adapter.
3. Chọn injection token do TypeScript interface bị erase; so sánh ít nhất hai alternative.
4. Chỉ ra composition root/provider binding và graph khi test override provider.
5. Thiết kế error taxonomy tối thiểu: domain/application rejection, not-found, infrastructure unavailable, programmer error. Chọn boundary translation cho từng loại.
6. Lập unit/integration/e2e test matrix và double tương ứng; ghi rõ điều fake repository không chứng minh.
7. Giả lập cycle `UsersService ↔ NotificationsService`; đề xuất ba hướng sửa và chọn một theo responsibility.
8. Chọn tối đa hai pattern có evidence; ghi ít nhất hai pattern bị từ chối vì KISS/YAGNI.

## 7. Evidence

- `dependency-design.md`: IoC/DI/DIP self-explanation và counter-examples
- Request-flow diagram, source dependency graph và composition-root diagram
- Responsibility/boundary table cho DTO, domain, persistence và error translation
- Provider token/binding decision; circular-dependency diagnosis
- Pattern decision matrix có problem/forces/alternative/trade-off
- Test-boundary matrix với fake/stub/mock choice và limitation

## 8. Self-check / Exit Criteria

- [ ] Graph thể hiện rõ object nào construct dependency và object nào chỉ use dependency.
- [ ] Tôi đưa được ví dụ DI không cần container và container vẫn vi phạm DIP.
- [ ] Domain/application không import NestJS, HTTP status hoặc concrete repository.
- [ ] Port diễn tả need của application; adapter phụ thuộc port, wiring nằm ở composition root.
- [ ] DTO, domain và persistence semantics được phân biệt; nếu dùng chung có rationale và risk.
- [ ] Tôi giải thích được vì sao interface TypeScript không tự là runtime injection token.
- [ ] Cycle được sửa từ responsibility/dependency direction hoặc có lý do rõ nếu chỉ tạm dùng `forwardRef`.
- [ ] Mỗi test double trả lời một câu hỏi behavior; không mock implementation detail vô cớ.
- [ ] Pattern được chọn và bị từ chối đều có evidence/trade-off, không dựa vào tên pattern.

## 9. Interview Drill — đúng chủ đề Thứ 4

- Question: IoC, DI và DIP khác nhau ở nguyên lý, cơ chế và source dependency như thế nào?
- Follow-ups:
  - Composition root là gì và vì sao service locator làm dependency bị ẩn?
  - Runtime request flow và compile-time dependency direction khác nhau ra sao?
  - Controller, application service, domain và repository adapter có trách nhiệm gì?
  - Vì sao DTO, domain model và persistence model có thể cần tách?
  - Fake, stub, spy và mock khác nhau theo câu hỏi test nào?
  - Khi gặp circular dependency, vì sao `forwardRef` chưa chắc là lời giải thiết kế?
  - Chọn Repository/Adapter/Observer khi nào, và khi nào không nên dùng?
- My answer:
  - ...
