# Tuần 5 - Booking, ticket, testing, CI và Docker

---

## 1. Nội dung tổng quan

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Tạo booking từ seat hold, tạo ticket sau confirm mock, viết test quan trọng, setup CI/Docker/Swagger. |
| **Lý thuyết** | Test pyramid, unit/e2e test, Supertest, mocking boundary, GitHub Actions, Dockerfile, Docker Compose, Swagger. |
| **Thực hành (Lab)** | Booking PENDING_PAYMENT từ seat hold. Payment mock để confirm booking trong test. Ticket generation. CI lint/test/build. Docker app/postgres/redis. |
| **Sản phẩm (Deliverable)** | PR `feat/booking-ticket-testing-ci-docker`; e2e happy path; README setup; Swagger docs. |
| **Câu hỏi phỏng vấn (Interview drill)** | Unit test khác e2e test thế nào? Mock sai boundary làm test vô nghĩa ra sao? |

---

## 2. Kế hoạch học tập theo ngày

| Buổi | Trọng tâm | Tài liệu học tập |
|---|---|---|
| **Thứ 2** | Unit test, mocking boundary | [NestJS testing](https://docs.nestjs.com/fundamentals/testing), [Jest getting started](https://jestjs.io/docs/getting-started), [Jest mock functions](https://jestjs.io/docs/mock-functions) |
| **Thứ 3** | E2E test với Supertest | [Supertest](https://github.com/ladjs/supertest), [Jest async testing](https://jestjs.io/docs/asynchronous), [NestJS testing](https://docs.nestjs.com/fundamentals/testing) |
| **Thứ 4** | GitHub Actions CI | [GitHub Actions Node.js](https://docs.github.com/en/actions/use-cases-and-examples/building-and-testing/building-and-testing-nodejs), [GitHub Actions workflow syntax](https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions) |
| **Thứ 5** | Dockerfile, Compose, env | [Docker build](https://docs.docker.com/build/), [Docker run](https://docs.docker.com/reference/cli/docker/container/run/), [Docker Compose](https://docs.docker.com/compose/) |
| **Thứ 6-7** | Swagger, README, evidence | [NestJS OpenAPI](https://docs.nestjs.com/openapi/introduction), [OpenAPI specification](https://spec.openapis.org/oas/latest.html) |

---

## 3. Các API tuần 5

```text
POST /bookings
GET /bookings/my
GET /bookings/:id
POST /bookings/:id/cancel
GET /tickets/my
GET /tickets/:id
GET /staff/tickets/:code
POST /staff/tickets/:id/check-in
```
