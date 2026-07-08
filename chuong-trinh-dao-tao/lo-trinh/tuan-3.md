# Tuần 3 - PostgreSQL, TypeORM và schema rạp/phim/suất chiếu

---

## 1. Nội dung tổng quan

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Thiết kế schema thật cho movie/cinema/screen/seat/showtime/showtime_seat. |
| **Lý thuyết** | Table/entity, relation, normalization, constraint, index, migration, TypeORM entity/repository/query builder. |
| **Thực hành (Lab)** | Tạo migrations/entities/seeds. Khi tạo showtime, snapshot seat layout thành `showtime_seats`. |
| **Sản phẩm (Deliverable)** | PR `feat/movie-cinema-showtime-schema`; ERD; seed data; docs DB. |
| **Câu hỏi phỏng vấn (Interview drill)** | Vì sao cần `showtime_seats` thay vì chỉ dùng `seats`? Index có nhược điểm gì? |

---

## 2. Kế hoạch học tập theo ngày

| Buổi | Trọng tâm | Tài liệu học tập |
|---|---|---|
| **Thứ 2** | PostgreSQL table, data type, constraint | [PostgreSQL data types](https://www.postgresql.org/docs/current/datatype.html), [PostgreSQL table basics](https://www.postgresql.org/docs/current/ddl-basics.html), [PostgreSQL constraints](https://www.postgresql.org/docs/current/ddl-constraints.html) |
| **Thứ 3** | TypeORM entity và relation | [TypeORM entities](https://typeorm.io/entities), [TypeORM relations](https://typeorm.io/relations), [NestJS database](https://docs.nestjs.com/techniques/database) |
| **Thứ 4** | Migration, seed, schema evolution | [TypeORM migrations](https://typeorm.io/migrations), [TypeORM DataSource](https://typeorm.io/data-source), [TypeORM DataSource options](https://typeorm.io/data-source-options) |
| **Thứ 5** | Repository, query builder, pagination | [TypeORM repository API](https://typeorm.io/repository-api), [TypeORM find options](https://typeorm.io/find-options), [TypeORM query builder](https://typeorm.io/select-query-builder) |
| **Thứ 6-7** | Index và query review | [PostgreSQL indexes](https://www.postgresql.org/docs/current/indexes.html), [PostgreSQL EXPLAIN](https://www.postgresql.org/docs/current/sql-explain.html) |

---

## 3. Các Entities & APIs tuần 3

### Entities:
```text
movies
movie_trailers
cinemas
screens
seats
showtimes
showtime_seats
```

### APIs:
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
