# Tuần 1 - Product foundation, OOP và public catalog API

Tuần 1 không chỉ là setup NestJS. Mục tiêu là hiểu domain Movie Ticket Booking, dựng nền OOP/TypeScript, tách module đúng và tạo API public đầu tiên có Swagger/evidence.

---

## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Business goal | Guest có thể xem danh sách phim, chi tiết phim, trailer, rạp và suất chiếu mock. |
| Engineering goal | Dựng repo, module boundary, OOP domain model, controller/service/provider đầu tiên. |
| System thinking | Phân biệt domain model, DTO, service, controller, module và API contract. |
| Deliverables | Repo chạy local, OOP mini lab, public catalog APIs, Swagger, README, ADR folder structure. |
| Interview focus | REST, OOP trong NestJS, controller/service/provider, API contract, convention. |

---

## 2. Kế hoạch học tập theo ngày

Thứ 2-4 là theory sprint. Thứ 5-7 mới mapping vào project.

| Ngày | Loại buổi | Trọng tâm | Output bắt buộc |
|---|---|---|---|
| Thứ 2 | Theory sprint | HTTP/HTTPS, DNS, REST resource, status code, headers, JSON API | Theory notes, status-code decision table, REST naming exercise |
| Thứ 3 | Theory sprint | TypeScript OOP: class/object, interface, encapsulation, composition, polymorphism, DI mindset | OOP concept map, mini lab Movie/Cinema/Showtime thuần TS |
| Thứ 4 | Theory sprint | NestJS fundamentals: module, controller, provider/service, DI container, DTO, project structure | Notes phân biệt controller/service/provider/module, mini lab Nest first app |
| Thứ 5 | Project mapping | Map kiến thức vào Movie public catalog: API contract, module boundary, mock data design | API list, ADR scope, module design, issue breakdown |
| Thứ 6-7 | Project sprint | Implement public catalog API, Swagger, README, PR evidence | PR `chore/setup-movie-ticket-api`, curl/Swagger logs, mentor review |

---

## 3. API scope tuần 1

```text
GET /health
GET /movies
GET /movies/:id
GET /movies/:id/trailer
GET /cinemas
GET /showtimes
```

---

## 4. Acceptance criteria

- [ ] Repo chạy được bằng README.
- [ ] Có OOP mini lab trước khi vào NestJS.
- [ ] Controller không chứa business logic nặng.
- [ ] Service/provider được inject qua constructor.
- [ ] API public có Swagger basic.
- [ ] Có ADR đầu tiên mô tả scope và module boundary.
- [ ] Có evidence curl/Swagger/log.

---

## 5. Interview drill

- OOP giúp NestJS tổ chức code như thế nào?
- Vì sao controller không nên chứa business logic?
- DTO khác domain model ở điểm nào?
- REST resource trong Movie Ticket Booking nên được đặt tên thế nào?
- Nếu API public đang mock data, làm sao thiết kế để tuần 3 chuyển sang DB thật ít đau nhất?
