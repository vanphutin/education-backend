# Delivery Lab: Gateway + Catalog vertical slice có evidence

- **Tuần:** 4 · **Ngày:** Thứ 6–7 · **Issue:** [#20](https://github.com/vanphutin/education-backend/issues/20)
- **Thời lượng:** 10–12 giờ · **Loại:** Project Delivery

## Definition of Done

Hai deployable chạy độc lập. Gateway expose public Catalog API; Catalog sở hữu application rule và local persistence boundary. Cùng request ID xuất hiện tại edge và service. Upstream call có deadline. Catalog-down/timeout trả stable error. Swagger, health và tests chạy được từ clean checkout.

## 1. Implementation Slices

### Slice A — executable skeleton

- [ ] `api-gateway` và `catalog-service` có composition root/config validation riêng.
- [ ] Docker Compose start từng process và dependency.
- [ ] Liveness/readiness phân biệt đúng semantics.

### Slice B — public Catalog flow

- [ ] Public/internal DTO tách biệt.
- [ ] List/detail/filter có validation, maximum limit và deterministic order.
- [ ] Gateway chỉ route/translate; không truy cập Catalog DB.
- [ ] OpenAPI có success/error examples.

### Slice C — operational behavior

- [ ] Correlation/request ID truyền xuyên hop.
- [ ] Outbound deadline được cấu hình và test.
- [ ] Structured log có service, route template, status, duration, request ID, dependency outcome.
- [ ] Shutdown ngừng nhận request mới và đóng resource.

## 2. Verification Matrix

| Test | Boundary thật | Failure/invariant chứng minh |
|---|---|---|
| Domain/application unit | không network/DB | Catalog rule và error taxonomy |
| Gateway client integration | HTTP fake/real Catalog | header, timeout, malformed response |
| Catalog repository integration | PostgreSQL thật | mapping/constraint/query |
| Cross-service e2e | Gateway + Catalog | public contract xuyên hai process |
| Service-down smoke | Catalog dừng | 503 an toàn, Gateway còn sống |
| Slow-upstream smoke | Catalog delay | 504 trong deadline budget |

## 3. Evidence Commands

```bash
docker compose up --build
curl -i -H "x-request-id: req_week4_success" http://localhost:4100/api/v1/movies
npm run lint
npm run typecheck
npm run test
npm run test:integration
npm run test:e2e
```

Lưu test output, success log hai process, timeout log, OpenAPI screenshot/link, health output và một failure reproduction. Evidence phải tái chạy được; screenshot đơn lẻ không thay test.

## 4. Review Gate — 100 điểm

| Nhóm | Điểm |
|---|---:|
| Ownership/boundary đúng | 20 |
| Contract/validation/error | 20 |
| Tests gồm failure paths | 20 |
| Timeout/correlation/health | 15 |
| Docker/clean setup | 10 |
| Docs/ADR/evidence | 10 |
| Giải thích trade-off | 5 |

Pass từ 80. Hard fail nếu shared DB/repository, business rule ở Gateway, không có bounded timeout, hoặc claim success không có executable evidence.

## 5. Interview Drill

Trong 5 phút: trace một request thành công và một Catalog timeout; nêu owner, contract, deadline, public response và evidence. Sau đó trả lời: nếu response timeout nhưng upstream là write operation, vì sao retry có thể tạo duplicate?

