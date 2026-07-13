# Deployable Structure: composition root, config và service-local module

- **Tuần:** 4 · **Ngày:** Thứ 3 · **Issue:** [#17](https://github.com/vanphutin/education-backend/issues/17)
- **Thời lượng:** 5–6 giờ · **Giai đoạn:** Project Delivery

## Required Reading

- Cơ bản: [NestJS Modules](https://docs.nestjs.com/modules), [Custom Providers](https://docs.nestjs.com/fundamentals/custom-providers)
- Nâng cao: [Lifecycle Events](https://docs.nestjs.com/fundamentals/lifecycle-events), [The Twelve-Factor App — Config](https://12factor.net/config)
- Lab: [`labs/tuan-4/gateway-catalog`](../../labs/tuan-4/gateway-catalog/README.md)

## 1. Learning Objectives

1. Thiết kế hai composition root độc lập cho Gateway và Catalog.
2. Phân biệt source dependency với runtime request dependency.
3. Định nghĩa config contract và fail fast khi thiếu/sai env.
4. Thiết kế liveness khác readiness.
5. Chỉ ra shared package nào hợp lệ: contract/telemetry primitive; không chia sẻ entity/repository/domain rule.

## 2. Knowledge Map

```text
deployable
├── composition root: concrete providers + config
├── application/domain: policy và invariant
├── adapters: HTTP, persistence, log
└── operational contract: health, shutdown, telemetry
```

| Thành phần | Gateway | Catalog |
|---|---|---|
| Composition root | bind Catalog client, timeout, logger | bind movie repository, clock, logger |
| Config | public port, Catalog URL, deadline | service port, DB URL |
| Domain policy | không | movie/showtime lifecycle |
| Persistence | không đọc Catalog DB | repository/migration riêng |
| Readiness | Catalog dependency theo policy | DB/migration ready |

Config là input chưa tin cậy. Parse một lần tại startup, tạo typed config, chặn URL/port/deadline sai. Không gọi `process.env` rải rác trong domain code.

## 3. Failure Thinking

- Process alive nhưng DB chưa kết nối: liveness có thể pass, readiness phải fail.
- Gateway startup trước Catalog: Compose ordering không chứng minh dependency ready; client vẫn cần timeout/degraded behavior.
- Import Catalog entity vào Gateway: compile-time coupling làm boundary giả.
- “Shared common module” chứa DTO, auth, error, ORM và helper: change blast radius tăng dần, ownership biến mất.

## 4. Design Exercise

Tạo dependency graph cho hai deployable. Với mỗi edge ghi:

- compile-time hay runtime;
- contract do caller hay callee sở hữu;
- timeout/cancellation owner;
- test seam;
- behavior khi dependency unavailable.

Viết config schema tối thiểu cho `GATEWAY_PORT`, `CATALOG_BASE_URL`, `CATALOG_TIMEOUT_MS`, `CATALOG_DATABASE_URL`. Thử ba invalid values và ghi startup evidence.

## 5. Exit Gate

- [ ] Hai process build/start độc lập.
- [ ] Không import repository/entity chéo service.
- [ ] Config invalid làm startup fail với message an toàn.
- [ ] Health contract phân biệt alive/ready.
- [ ] Interview: vì sao “dùng chung code” có thể phá service ownership?

