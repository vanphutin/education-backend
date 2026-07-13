# Tuần 2 - TypeScript/OOP, NestJS mental model và backend code organization

**Giai đoạn:** Core Theory + Mini Labs  
**Chế độ học:** Thứ 2-4 học chuyên sâu. Thứ 5-7 làm mini labs từ kiến thức Thứ 2-4. Chưa bắt đầu dự án thật.

## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Biết biến yêu cầu và invariant thành type/domain model, tổ chức dependency để code dễ kiểm thử, dễ thay đổi và không phụ thuộc mù quáng vào framework. |
| Focus | TypeScript type reasoning và runtime boundary; pure function/side effect, mutation, async/event loop, data structure/Big-O; entity/value object/invariant, cohesion/coupling và refactor; IoC/DI/DIP, dependency graph, module/layer/port-adapter boundary, test doubles và pattern theo problem/forces/trade-off. |
| Project rule | Không code, scaffold hoặc implement Movie Ticket Booking trong tuần này. Chỉ học sâu và làm mini lab độc lập. |
| Exit criteria | Có thể giải thích một type/domain/dependency model bằng lời của mình, dự đoán failure trước khi chạy, viết test cho invariant và thay adapter mà không sửa business rule. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Loại buổi | Trọng tâm |
|---|---|---|
| Thứ 2 | Theory Deep Dive | TypeScript foundation: type, interface, class, generic, error typing, runtime vs compile time |
| Thứ 3 | Theory Deep Dive | OOP for backend: encapsulation, composition over inheritance, polymorphism, value object mindset |
| Thứ 4 | Theory Deep Dive | Dependency Injection and modular design: why DI exists, dependency direction, testability |
| Thứ 5 | Mini Lab | TypeScript/OOP lab: viết domain mini models, validation rules và error handling không dùng framework |
| Thứ 6-7 | Mini Lab | NestJS mental model lab: module/controller/service/provider mini app, chỉ để hiểu framework như công cụ |

### Trục tư duy phải luyện trong tuần

| Buổi | Câu hỏi dẫn đường | Artifact bắt buộc |
|---|---|---|
| Thứ 2 | Dữ liệu có những trạng thái hợp lệ nào, dữ liệu chưa tin cậy trở thành domain type ở boundary nào, và lựa chọn cấu trúc dữ liệu ảnh hưởng chi phí ra sao? | Type decision table, data-flow diagram, exhaustive-state exercise và complexity note. |
| Thứ 3 | Object nào sở hữu invariant, điều gì làm hai object bằng nhau, và hướng thay đổi nào quyết định class/function/composition/pattern? | Domain model, state diagram, responsibility table, test matrix và refactor note. |
| Thứ 4 | Dependency đang trỏ về đâu, policy có biết framework/infrastructure không, và test cần thay dependency tại seam nào? | Dependency graph, request-flow diagram, pattern decision table và test-boundary matrix. |
| Thứ 5 | Model có chặn invalid state, normalization/equality có rõ và test có bảo vệ refactor không? | OOP mini lab độc lập với invariant tests và evidence trước/sau refactor. |
| Thứ 6-7 | Request đi qua boundary nào, repository/provider được compose ở đâu và lỗi domain được dịch sang HTTP ở đâu? | NestJS mini app độc lập với repository port, in-memory adapter, provider override và unit/integration evidence. |

## 3. Output bắt buộc

- TypeScript notes
  - Có structural typing/inference, discriminated union/exhaustiveness, `unknown`/`never`/nullability, readonly/generic constraint, runtime validation, Result-vs-exception, async/event-loop và Array/Map/Set complexity.
- OOP mini lab
  - Có entity/value object/invariant, normalization/equality, factory hoặc strategy hợp lý, test matrix và một refactor giữ nguyên behavior.
- DI notes
  - Có dependency graph; phân biệt IoC/DI/DIP; composition root, layer/port-adapter, DTO-domain-persistence boundary và test doubles.
- NestJS lifecycle mini lab
  - Evidence phải mô tả request flow, module/provider composition, repository port + in-memory adapter, provider override/test seam và HTTP error translation.
- Interview answers
  - Trả lời bằng tình huống và trade-off, không đọc lại định nghĩa.

## 4. Interview drill

- Vì sao TypeScript type không thay thế runtime validation cho JSON từ HTTP?
- Khi nào discriminated union tốt hơn một object có nhiều optional field?
- Entity khác Value Object ở identity, equality và lifecycle như thế nào?
- Composition tốt hơn inheritance khi nào, và khi nào một pure function đủ tốt hơn class?
- IoC, DI và DIP khác nhau ở mức nguyên lý, cơ chế và implementation ra sao?
- Controller, application service, domain object và repository khác trách nhiệm thế nào?
- Fake, stub và mock khác nhau ở mục tiêu kiểm thử nào?
- Chọn Strategy/Adapter/Factory/Repository/Observer/Decorator dựa trên problem và forces nào; khi nào không nên dùng?

## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [TypeScript Handbook - The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html), [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) | [TypeScript Handbook - Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html), [Type Inference](https://www.typescriptlang.org/docs/handbook/type-inference.html) |
| Tue | [TypeScript Handbook - Classes](https://www.typescriptlang.org/docs/handbook/2/classes.html) | [Martin Fowler - Value Object](https://martinfowler.com/bliki/ValueObject.html), [Martin Fowler - Refactoring](https://refactoring.com/) |
| Wed | [NestJS Docs - Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers), [Modules](https://docs.nestjs.com/modules) | [NestJS Docs - Dynamic Modules](https://docs.nestjs.com/fundamentals/dynamic-modules), [Circular Dependency](https://docs.nestjs.com/fundamentals/circular-dependency) |
| Thu | [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html) | [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html) |
| Fri-Sat | [NestJS Docs - Controllers](https://docs.nestjs.com/controllers), [Testing](https://docs.nestjs.com/fundamentals/testing) | [NestJS Docs - Execution Context](https://docs.nestjs.com/fundamentals/execution-context), [Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers) |
