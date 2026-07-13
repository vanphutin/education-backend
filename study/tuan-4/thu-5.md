# Contract & Ownership Workshop: public Catalog vertical slice

- **Tuần:** 4 · **Ngày:** Thứ 5 · **Issue:** [#19](https://github.com/vanphutin/education-backend/issues/19)
- **Thời lượng:** 6 giờ · **Loại:** Design + Contract Lab

## Required Reading

- [NestJS OpenAPI](https://docs.nestjs.com/openapi/introduction)
- [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines/blob/vNext/Guidelines.md)
- [`labs/tuan-4/gateway-catalog`](../../labs/tuan-4/gateway-catalog/README.md)

## 1. Scenario và Scope

Khách chưa đăng nhập cần xem movie/showtime theo rạp và ngày qua Gateway. Catalog sở hữu canonical movie/cinema/screen/showtime metadata. Seat availability, hold và booking chưa thuộc scope tuần 4.

### Public contract tối thiểu

- `GET /api/v1/movies?cursor=&limit=`
- `GET /api/v1/movies/{movieId}`
- `GET /api/v1/showtimes?cinemaId=&date=&cursor=&limit=`
- `GET /health/live`, `GET /health/ready` cho từng process

## 2. Design Before Code

Điền và review trước khi implement:

| Decision | Lựa chọn | Alternative | Failure/trade-off | Evidence |
|---|---|---|---|---|
| Offset hay cursor pagination | | | | |
| Public/internal DTO | | | | |
| Deadline Gateway → Catalog | | | | |
| 404 vs empty collection | | | | |
| Request ID trust/format | | | | |

Contract phải có field type/required/nullability, stable ordering, maximum limit, error examples và versioning rule. Public DTO không phải ORM entity. Gateway không được import Catalog repository.

## 3. Failure Matrix

| Failure | State đổi? | Owner phát hiện | Public response | Log/metric |
|---|---|---|---|---|
| invalid date/limit | không | Gateway | 400 | validation code |
| movie missing | không | Catalog | 404 | domain code |
| Catalog unavailable | không biết | Gateway | 503 | dependency outcome |
| deadline exceeded | unknown outcome | Gateway | 504 | duration/deadline |
| malformed internal payload | không biết | Gateway | 502 | contract violation |

## 4. Output bắt buộc

- OpenAPI public contract và internal Catalog examples.
- Ownership/context diagram.
- Error catalog và failure matrix.
- ADR: Gateway responsibility/non-responsibility.
- Contract tests cho success, invalid input và error envelope.

## 5. Exit Gate

- [ ] Contract review được trước khi có controller implementation.
- [ ] Không có booking rule/seat state trong Catalog tuần 4.
- [ ] Pagination có deterministic ordering và upper bound.
- [ ] Public response không rò internal URL/entity.
- [ ] Interview: “API versioning ở Gateway có tách được breaking change nội bộ không?”

