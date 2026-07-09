# Nhịp học và lab ngoài

## Nhận định

Đọc 1-3 trang docs mỗi ngày là ổn nếu đó là nhịp giữ lửa hoặc ngày rất bận. Nhưng với chương trình backend cường độ cao, chỉ đọc rồi dừng lại là chưa đủ. Một ngày học hợp lệ phải có đầu ra nhìn thấy được: ghi chú bằng lời của mình, một bài lab nhỏ, evidence, và một câu trả lời phỏng vấn ngắn.

Quy tắc: docs là đầu vào, lab/evidence là đầu ra.

## Ba mức nhịp học

| Mức | Khi nào dùng | Thời lượng | Cấu trúc |
|---|---|---:|---|
| Minimum day | Ngày bận, chỉ giữ nhịp | 60-90 phút | 15-20 phút đọc, 15 phút tóm tắt, 25-40 phút lab nhỏ, 10-15 phút evidence |
| Standard day | Ngày học bình thường | 2.5-4 giờ | Đọc sâu, làm lab ngoài, áp dụng vào daily ticket, ghi evidence |
| High-intensity day | Ngày rảnh, đúng chuẩn khóa này | 5-8 giờ | 2 block theory, 2 block lab/project, 1 block review/interview/evidence |

Nếu người học rảnh 1 tiếng mà chỉ đọc docs rồi nghỉ, mentor không tính là hoàn thành ngày. Tối thiểu phải có một thao tác thực hành hoặc một artifact.

## Definition of Done mỗi ngày

- Đã đọc phần docs bắt buộc.
- Viết lại 5-10 ý chính bằng lời của mình.
- Làm ít nhất 1 lab nhỏ, bài tập interactive, curl/Postman flow, SQL exercise, test, hoặc design exercise.
- Lưu evidence: command output, screenshot, link lab, file note, test result, diagram, hoặc đoạn giải thích tradeoff.
- Trả lời 1 câu interview drill: concept này giải quyết backend problem nào?

## Nguồn lab ngoài theo chủ đề

| Tuần/chủ đề | Nguồn thực hành | Cách gắn vào chương trình |
|---|---|---|
| HTTP/API fundamentals | [Postman Academy](https://academy.postman.com/), [Postman Learn](https://www.postman.com/learn/), [MDN HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP) | Sau khi đọc HTTP, tạo collection mô phỏng status code, headers, timeout, pagination, error response |
| API design/OpenAPI | [Swagger Petstore OpenAPI 3.0](https://petstore3.swagger.io/), [OpenAPI Learn](https://learn.openapis.org/) | Viết OpenAPI contract cho Movie/Cinema/Showtime trước khi code |
| TypeScript | [TypeScript Docs](https://www.typescriptlang.org/docs/), [TypeScript Exercises](https://typescript-exercises.github.io/), [Exercism TypeScript](https://exercism.org/tracks/typescript), [type-challenges](https://github.com/type-challenges/type-challenges) | Mỗi ngày chọn 2-5 bài nhỏ về union, generic, narrowing, error typing |
| NestJS mental model | [NestJS First Steps](https://docs.nestjs.com/first-steps), [NestJS Providers](https://docs.nestjs.com/providers), [NestJS Testing](https://docs.nestjs.com/fundamentals/testing) | Làm mini app controller/service/provider, rồi test service/controller |
| SQL/PostgreSQL | [pgexercises](https://pgexercises.com/), [SQLZoo](https://www.sqlzoo.net/), [LabEx PostgreSQL Free Labs](https://labex.io/free-labs/postgresql), [PostgreSQL Docs](https://www.postgresql.org/docs/current/) | Chọn bài SELECT/JOIN/aggregate/index/transaction rồi ghi query + result |
| DB performance/locking | [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html), [PostgreSQL Explicit Locking](https://www.postgresql.org/docs/current/explicit-locking.html), [PostgreSQL Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html) | Chạy EXPLAIN, tạo transaction rollback, mô phỏng lock wait/deadlock nhỏ |
| Auth/security | [PortSwigger Web Security Academy](https://portswigger.net/web-security), [PortSwigger JWT Labs](https://portswigger.net/web-security/jwt), [OWASP WebGoat](https://owasp.org/www-project-webgoat/), [OWASP Juice Shop](https://owasp.org/www-project-juice-shop/) | Làm lab JWT/auth/access control/rate limit để hiểu lỗi thật trước khi build auth |
| Secure coding reference | [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html), [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [OWASP REST Security](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html) | Dùng làm checklist khi thiết kế register/login/RBAC/API security |
| Idempotency/race conditions | [Stripe Idempotent Requests](https://docs.stripe.com/api/idempotent_requests), [PortSwigger Race Conditions](https://portswigger.net/web-security/race-conditions) | Mô phỏng retry duplicate request, webhook replay, concurrent seat hold |
| Cache/Redis | [Redis University](https://redis.io/tutorials/university/), [Redis Caching Docs](https://redis.io/docs/latest/develop/use/caching/) | Làm cache-aside, TTL, invalidation note; đo response trước/sau cache |
| Queue/BullMQ | [BullMQ Docs](https://docs.bullmq.io/), [BullMQ Retrying Jobs](https://docs.bullmq.io/guide/retrying-failing-jobs), [NestJS Queues](https://docs.nestjs.com/techniques/queues) | Tạo job retry/delay/idempotent handler cho hold expiry hoặc webhook processing |
| Docker/CI | [Docker Workshop](https://docs.docker.com/get-started/workshop/), [GitHub Actions Node.js](https://docs.github.com/actions/guides/building-and-testing-nodejs) | Dockerize app, chạy Postgres/Redis bằng compose, tạo CI chạy test/build |

## Cách gắn vào daily ticket

Mỗi daily ticket nên có thêm một dòng:

```md
## External Practice
- Lab/resource:
- Task:
- Evidence:
- What I learned:
```

Mentor chỉ cần yêu cầu một nguồn lab mỗi ngày. Không cần nhồi nhiều link; học sâu một lab nhỏ tốt hơn mở 10 tab rồi không hoàn thành gì.

## Nhịp đề xuất theo ngày

Ngày chỉ có 1 giờ:

- 15 phút đọc docs.
- 15 phút viết lại bằng lời của mình.
- 20 phút làm một lab rất nhỏ.
- 10 phút ghi evidence và trả lời interview drill.

Ngày có 3 giờ:

- 45 phút đọc docs.
- 30 phút viết concept map/common mistakes.
- 75 phút lab hoặc code spike.
- 30 phút evidence, review, interview drill.

Ngày có 6 giờ:

- 90 phút đọc sâu.
- 60 phút ghi chú và giải thích lại.
- 120 phút lab/project implementation.
- 60 phút test/curl/log/evidence.
- 30 phút interview drill và review lỗi sai.

## Mentor rule

Không chấp nhận trạng thái "done" chỉ vì đã đọc xong 1-3 trang. Done nghĩa là người học đã biến input thành output. Nếu hôm đó quá bận thì giảm scope lab, không bỏ lab.
