# Tuần 1 - Backend foundation và Movie API skeleton

---

## 1. Nội dung tổng quan

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Hiểu HTTP/REST, tạo NestJS app, thiết lập convention, tạo API mock cho movie/showtime/trailer. |
| **Lý thuyết** | DNS, HTTP/HTTPS, REST, status code, headers, JSON API, TypeScript, NestJS module/controller/provider/DI, Git/PR. |
| **Thực hành (Lab)** | Tạo repo `movie-ticket-booking-api`. Setup lint/format/env. Tạo các mock API cho `movies`, `cinemas`, `showtimes`. |
| **Sản phẩm (Deliverable)** | PR `chore/setup-movie-ticket-api`; README chạy local; Swagger basic; ADR folder structure. |
| **Câu hỏi phỏng vấn (Interview drill)** | REST là gì? 401 khác 403 thế nào? Controller/service/provider khác nhau thế nào? |

---

## 2. Kế hoạch học tập theo ngày

| Buổi | Trọng tâm | Tài liệu học tập |
|---|---|---|
| **Thứ 2** | HTTP, REST, status code, headers | [MDN HTTP overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview), [MDN status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status), [MDN headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers) |
| **Thứ 3** | TypeScript và NestJS first app | [TypeScript handbook](https://www.typescriptlang.org/docs/), [NestJS first steps](https://docs.nestjs.com/first-steps), [NestJS CLI](https://docs.nestjs.com/cli/overview) |
| **Thứ 4** | Module, controller, provider, DI | [NestJS modules](https://docs.nestjs.com/modules), [NestJS controllers](https://docs.nestjs.com/controllers), [NestJS providers](https://docs.nestjs.com/providers) |
| **Thứ 5** | Config, lint/format, Swagger basic | [NestJS configuration](https://docs.nestjs.com/techniques/configuration), [ESLint getting started](https://eslint.org/docs/latest/use/getting-started), [NestJS OpenAPI](https://docs.nestjs.com/openapi/introduction) |
| **Thứ 6-7** | Git flow, PR, README, convention | [GitHub pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests), [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) |

---

## 3. Các API cần hoàn thiện (Mock)

```text
GET /health
GET /movies
GET /movies/:id
GET /movies/:id/trailer
GET /cinemas
GET /showtimes
```
