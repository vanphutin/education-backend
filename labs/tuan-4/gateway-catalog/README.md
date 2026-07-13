# Week 4 Lab — Gateway → Catalog boundary

Lab TypeScript độc lập dùng hai HTTP process để kiểm chứng contract và failure semantics trước khi triển khai NestJS project.

## Chạy

```bash
npm install
npm test
npm start
curl -i -H "x-request-id: req_demo_001" http://127.0.0.1:4100/api/v1/movies
```

## Điều phải quan sát

- Gateway trả public contract nhưng không sở hữu movie data.
- Cùng một `x-request-id` xuất hiện ở response và log hai process.
- Catalog chậm hơn deadline tạo `504 UPSTREAM_TIMEOUT`.
- Catalog không chạy tạo `503 UPSTREAM_UNAVAILABLE`.
- Error không làm rò URL nội bộ hoặc stack trace.

## Bài tập bắt buộc

1. Ghi prediction trước khi chạy ba test.
2. Bỏ propagation `x-request-id`, chạy test và giải thích evidence bị mất.
3. Bỏ timeout, mô tả resource nào bị giữ khi Catalog treo.
4. Thêm query `limit`; Gateway chỉ kiểm syntax, Catalog bảo vệ giới hạn nghiệp vụ.
5. Viết contract test chứng minh Gateway không đổi field `id`, `title`, `durationMinutes`.

Evidence: test output, một success log, một timeout log và decision table về `502/503/504`.
