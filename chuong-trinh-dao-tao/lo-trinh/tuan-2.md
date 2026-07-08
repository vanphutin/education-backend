# Tuần 2 - Production API behavior và request pipeline

Tuần 2 biến API mock thành API có hành vi giống service thật: validation, error format, request id, logging, pagination/filter/sort và response contract nhất quán.

---

## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Business goal | Guest lọc phim/suất chiếu theo nhu cầu thật: ngày, rạp, phim, trạng thái publish. |
| Engineering goal | Chuẩn hóa request pipeline: middleware, pipe, interceptor, exception filter, DTO validation. |
| System thinking | Thiết kế API predictable, debug được bằng request id, lỗi trả về nhất quán. |
| Deliverables | PR request pipeline, docs API behavior, filter/pagination APIs, validation/error tests. |
| Interview focus | Pipe/guard/interceptor/filter, error contract, pagination, logging, async Node.js. |

---

## 2. Kế hoạch học tập theo ngày

Thứ 2-4 là theory sprint. Thứ 5-7 mới mapping vào project.

| Ngày | Loại buổi | Trọng tâm | Output bắt buộc |
|---|---|---|---|
| Thứ 2 | Theory sprint | Node.js event loop, async I/O, microtask/macrotask, error propagation | Event loop notes, async examples, interview answers |
| Thứ 3 | Theory sprint | Stream, buffer, backpressure, large response/export mindset | Mini lab stream/buffer, notes khi nào không load all vào memory |
| Thứ 4 | Theory sprint | NestJS request pipeline: middleware, pipe, interceptor, exception filter, lifecycle | Pipeline diagram, comparison table, mini examples |
| Thứ 5 | Project mapping | Map pipeline vào Movie APIs: validation, error contract, request id, logging, pagination/filter/sort | API behavior spec, DTO plan, error response design |
| Thứ 6-7 | Project sprint | Implement pipeline, movie/showtime filters, tests/evidence | PR `feat/common-request-pipeline`, curl invalid/valid cases, log evidence |

---

## 3. API scope tuần 2

```text
GET /movies?keyword=&genre=&status=&page=&limit=&sort=
GET /showtimes?movieId=&cinemaId=&date=&page=&limit=
GET /showtimes/:id/seats
```

---

## 4. Acceptance criteria

- [ ] API lỗi có format thống nhất.
- [ ] Query DTO có validation.
- [ ] Pagination metadata rõ: `page`, `limit`, `total`, `totalPages`.
- [ ] Có request id trong response/log.
- [ ] Logging đủ debug nhưng không lộ secret.
- [ ] Docs request pipeline giải thích middleware/pipe/interceptor/filter.

---

## 5. Interview drill

- Pipe, interceptor, middleware, exception filter khác nhau thế nào?
- Vì sao API cần request id?
- Pagination offset có nhược điểm gì khi dữ liệu lớn?
- Nếu client gửi `limit=100000`, backend nên xử lý thế nào?
