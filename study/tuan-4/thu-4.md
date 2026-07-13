# Request Pipeline: validation, deadline, error mapping và correlation

- **Tuần:** 4 · **Ngày:** Thứ 4 · **Issue:** [#18](https://github.com/vanphutin/education-backend/issues/18)
- **Thời lượng:** 5–6 giờ · **Giai đoạn:** Project Delivery

## Required Reading

- Cơ bản: [NestJS Validation](https://docs.nestjs.com/techniques/validation), [Exception Filters](https://docs.nestjs.com/exception-filters)
- Nâng cao: [Interceptors](https://docs.nestjs.com/interceptors), [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110)
- Lab: [`labs/tuan-4/gateway-catalog`](../../labs/tuan-4/gateway-catalog/README.md)

## 1. Learning Objectives

1. Vẽ đúng thứ tự correlation → parsing/validation → auth → use case/upstream → translation → telemetry.
2. Phân biệt syntactic validation tại edge với domain invariant tại Catalog.
3. Áp deadline cho outbound call và giải thích cancellation không đồng nghĩa upstream rollback.
4. Thiết kế stable error envelope không rò stack, URL nội bộ hoặc secret.
5. Dùng log của hai process để reconstruct một request và một failure.

## 2. Request/Failure Flow

```text
receive/generate requestId
→ parse and validate public input
→ call Catalog with propagated ID + bounded deadline
→ translate known result/failure
→ emit status, duration, route template, dependency outcome
```

| Tình huống | Status | Code | Retryable | Evidence |
|---|---:|---|---|---|
| Query sai type/range | 400 | `INVALID_REQUEST` | false | safe field violations |
| Resource không tồn tại | 404 | `MOVIE_NOT_FOUND` | false | Catalog domain result |
| Upstream bad response | 502 | `UPSTREAM_BAD_RESPONSE` | có điều kiện | dependency + request ID |
| Catalog unavailable | 503 | `UPSTREAM_UNAVAILABLE` | true | connection outcome |
| Catalog quá deadline | 504 | `UPSTREAM_TIMEOUT` | true/conditional | configured deadline + duration |

Error envelope tối thiểu: stable `code`, safe `message`, `requestId`, `retryable`; field details chỉ cho validation. Không trả raw exception.

## 3. Worked Example và Counterexample

Worked: request có ID hợp lệ được truyền sang Catalog. Catalog log cùng ID. Gateway giữ public response contract và map timeout thành 504.

Counterexample: `catch (error) { return 500 + error.message }`. Nó trộn lỗi client/domain/dependency/programmer, rò hạ tầng và khiến client retry sai.

## 4. Lab bắt buộc

Trong `labs/tuan-4/gateway-catalog`:

1. Ghi prediction cho ba tests trước khi chạy.
2. Chạy `npm test`, ghép log bằng request ID.
3. Tạm bỏ deadline và mô tả connection/request resource bị giữ.
4. Tạo malformed upstream response và thêm mapping 502.
5. Thêm query `limit`: Gateway validate integer; Catalog enforce maximum.

## 5. Exit Gate

- [ ] Test success, timeout và unavailable đều deterministic.
- [ ] Log không chứa stack/URL nội bộ trong public response.
- [ ] Một ID trace được xuyên hai process.
- [ ] Giải thích được 502/503/504 mà không học thuộc status table.
- [ ] Interview: timeout có chứng minh upstream chưa tạo side effect không?

