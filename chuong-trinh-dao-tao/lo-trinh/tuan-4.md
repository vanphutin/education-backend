# Tuần 4 - Microservice kickoff: Gateway, Catalog Service và request pipeline

**Giai đoạn:** Project Delivery  
**Chế độ học:** Học mới buổi đầu tuần, áp dụng ngay vào project cuối tuần.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Dựng được môi trường microservice local và một vertical slice public catalog qua Gateway, với boundary và contract rõ. |
| Focus | Monorepo/Compose, Gateway, Catalog Service, service ownership, external API contract, validation, error contract, request/trace ID, Swagger. |
| Project rule | Bắt đầu project chính với tối đa Gateway + Catalog Service; chưa tách Booking/Identity chỉ để đủ số service. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Microservice context: Gateway vs service responsibility, external/internal contract, request/trace propagation |
| Thứ 3 | Monorepo/Compose and Catalog Service skeleton: composition root, config, service-local module boundary |
| Thứ 4 | Gateway and request pipeline: validation/error mapping, timeout, correlation, no business logic at edge |
| Thứ 5 | Map public catalog to Gateway → Catalog: movies, cinemas, showtimes; define ownership and read contract |
| Thứ 6-7 | Implement Gateway + Catalog vertical slice, Swagger at edge, local health/readiness, curl/log/trace evidence |

## 3. Output bắt buộc

- TypeScript boundary lab tại [`labs/tuan-4/gateway-catalog`](../../labs/tuan-4/gateway-catalog/README.md) pass success, timeout và unavailable tests
- Running Gateway and Catalog Service via Compose
- Service context/ownership ADR and local network/config diagram
- Public catalog API through Gateway; Swagger external contract
- Error/timeout/correlation contract and health/readiness per process
- curl/log/trace evidence crossing Gateway → Catalog

## 4. Quality Gate đo được

| Năng lực | Bằng chứng pass |
|---|---|
| Ownership | Gateway không import Catalog entity/repository và không truy cập `catalog_db` |
| Contract | Public/internal DTO, error catalog, pagination limit và OpenAPI examples |
| Failure | Automated test cho invalid input, malformed upstream, unavailable và timeout |
| Operability | Request ID xuyên hop, bounded deadline, liveness/readiness và structured logs |
| Delivery | Clean setup bằng Compose; unit, integration, e2e và smoke commands tái chạy được |

Pass từ 80/100 theo rubric trong `study/tuan-4/thu-6-7.md`. Hard fail nếu shared DB, business rule ở Gateway, outbound call không deadline hoặc evidence chỉ là screenshot.

## 5. Interview drill

- Gateway nên làm gì và tuyệt đối không sở hữu rule nào?
- Khi nào Gateway trả lỗi thay service, và trace/request ID được truyền thế nào?
- Vì sao Catalog Service chưa nên đọc/ghi booking database?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [Docker Docs - Compose](https://docs.docker.com/compose/) | [Microsoft Azure Architecture - Gateway Routing Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/gateway-routing) |
| Tue | [NestJS Docs - Providers](https://docs.nestjs.com/providers) | [NestJS Docs - Lifecycle Events](https://docs.nestjs.com/fundamentals/lifecycle-events) |
| Wed | [NestJS Docs - Validation](https://docs.nestjs.com/techniques/validation) | [NestJS Docs - Exception Filters](https://docs.nestjs.com/exception-filters) |
| Thu | [NestJS Docs - OpenAPI Introduction](https://docs.nestjs.com/openapi/introduction) | [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md) |
| Fri-Sat | [NestJS Docs - Logger](https://docs.nestjs.com/techniques/logger) | [NestJS Docs - Interceptors](https://docs.nestjs.com/interceptors) |
