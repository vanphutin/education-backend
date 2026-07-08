# Tuần 3 - Database design, migrations và showtime seat snapshot

Tuần 3 chuyển từ mock data sang database thật. Trọng tâm không phải chỉ biết TypeORM, mà là thiết kế schema bảo vệ dữ liệu và phục vụ flow đặt vé.

---

## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Business goal | Admin có thể quản lý phim/rạp/phòng/ghế/suất chiếu; guest xem seat map của suất chiếu thật. |
| Engineering goal | Tạo migrations/entities/seeds, relations, constraints, indexes, query APIs. |
| System thinking | Biết vì sao cần snapshot `showtime_seats`, constraint nào bảo vệ dữ liệu, index nào phục vụ query. |
| Deliverables | ERD, migrations, seed data, CRUD admin cơ bản, showtime seat snapshot, query review. |
| Interview focus | Normalization, constraints, index, migration, snapshot data, TypeORM tradeoffs. |

---

## 2. Kế hoạch học tập theo ngày

Thứ 2-4 là theory sprint. Thứ 5-7 mới mapping vào project.

| Ngày | Loại buổi | Trọng tâm | Output bắt buộc |
|---|---|---|---|
| Thứ 2 | Theory sprint | SQL fundamentals: table, data type, primary/foreign key, not null, unique, check constraint | Schema notes, constraint examples, normalization exercise |
| Thứ 3 | Theory sprint | Relation modeling, normalization vs denormalization, ERD, showtime seat snapshot reasoning | ERD draft, explanation why snapshot is needed |
| Thứ 4 | Theory sprint | TypeORM entity/repository, migrations, seeds, query builder, indexes, EXPLAIN | TypeORM notes, migration checklist, index tradeoff answers |
| Thứ 5 | Project mapping | Map DB theory vào movie/cinema/screen/seat/showtime schema | Final ERD, migration plan, seed plan, API-to-table mapping |
| Thứ 6-7 | Project sprint | Implement migrations/entities/seeds/showtime_seats and query review | PR, migration/seed logs, `GET /showtimes/:id/seats` evidence |

---

## 3. API scope tuần 3

```text
POST /admin/movies
PATCH /admin/movies/:id
PATCH /admin/movies/:id/trailer
POST /admin/cinemas
POST /admin/screens
POST /admin/screens/:id/seats
POST /admin/showtimes
GET /showtimes/:id/seats
```

---

## 4. Acceptance criteria

- [ ] Có migration, không dùng `synchronize: true`.
- [ ] Có ERD và giải thích relation.
- [ ] Có constraints cơ bản: unique, not null, foreign key.
- [ ] Tạo showtime sinh snapshot `showtime_seats`.
- [ ] Query public vẫn chạy sau khi chuyển từ mock sang DB.
- [ ] Có seed idempotent.
- [ ] Có evidence migration/seed/query.

---

## 5. Interview drill

- Vì sao `showtime_seats` cần snapshot thay vì chỉ join `seats`?
- Khi nào nên thêm index? Index có nhược điểm gì?
- Migration production khác gì sửa entity rồi chạy sync?
- Nên đặt constraint ở app layer hay database layer?
