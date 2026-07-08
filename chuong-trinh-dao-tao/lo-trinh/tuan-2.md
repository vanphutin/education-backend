# Tuần 2 - Node.js runtime và NestJS request pipeline

---

## 1. Nội dung tổng quan

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Dùng đúng middleware, pipe, interceptor, exception filter; chuẩn hóa validation/error/logging. |
| **Lý thuyết** | Event loop, async I/O, stream/buffer, NestJS lifecycle, validation pipe, exception filter, request id. |
| **Thực hành (Lab)** | Global validation pipe, error response format, request logging interceptor, middleware request id, DTO cho movie/showtime APIs. |
| **Sản phẩm (Deliverable)** | PR `feat/common-request-pipeline`; docs request pipeline; unit test nhỏ cho error/validation nếu phù hợp. |
| **Câu hỏi phỏng vấn (Interview drill)** | Pipe/guard/interceptor/filter khác nhau thế nào? Vì sao cần request id? |

---

## 2. Kế hoạch học tập theo ngày

| Buổi | Trọng tâm | Tài liệu học tập |
|---|---|---|
| **Thứ 2** | Event loop, async I/O | [Node.js event loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick), [Node.js async flow](https://nodejs.org/en/learn/asynchronous-work/asynchronous-flow-control) |
| **Thứ 3** | Stream, buffer, export file | [Node.js streams](https://nodejs.org/api/stream.html), [Node.js buffer](https://nodejs.org/api/buffer.html), [Backpressuring in streams](https://nodejs.org/en/learn/modules/backpressuring-in-streams) |
| **Thứ 4** | Middleware, pipe, interceptor, filter | [NestJS middleware](https://docs.nestjs.com/middleware), [NestJS pipes](https://docs.nestjs.com/pipes), [NestJS interceptors](https://docs.nestjs.com/interceptors), [NestJS exception filters](https://docs.nestjs.com/exception-filters) |
| **Thứ 5** | Validation, logging, request id | [NestJS validation](https://docs.nestjs.com/techniques/validation), [NestJS logger](https://docs.nestjs.com/techniques/logger), [NestJS lifecycle events](https://docs.nestjs.com/fundamentals/lifecycle-events) |
| **Thứ 6-7** | Review request pipeline | [NestJS guards](https://docs.nestjs.com/guards), [NestJS execution context](https://docs.nestjs.com/fundamentals/execution-context) |

---

## 3. Các API cần hoàn thiện (Mock + Validation)

```text
GET /showtimes?movieId=&cinemaId=&date=
GET /showtimes/:id/seats (mock responses)
```
