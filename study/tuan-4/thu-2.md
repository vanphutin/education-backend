# Microservice Boundary: Gateway không phải nơi chứa business logic

- **Tuần:** 4 · **Ngày:** Thứ 2 · **Issue:** [#16](https://github.com/vanphutin/education-backend/issues/16)
- **Thời lượng:** 5–6 giờ · **Giai đoạn:** Project Delivery

## Required Reading

- Cơ bản: [Gateway Routing Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/gateway-routing), [Docker Compose](https://docs.docker.com/compose/)
- Nâng cao: [Microservices — Fowler](https://martinfowler.com/articles/microservices.html)
- Lab tuần: [`labs/tuan-4/gateway-catalog`](../../labs/tuan-4/gateway-catalog/README.md)

## 1. Learning Objectives đo được

Sau buổi học, người học phải:

1. Phân biệt public contract, internal contract và domain policy bằng ví dụ Movie Catalog.
2. Lập ownership table cho Gateway và Catalog; mỗi state/invariant chỉ có một owner.
3. Trace request qua client → Gateway → Catalog và đánh dấu trust/failure boundary.
4. Giải thích vì sao Gateway được map protocol error nhưng không được quyết định movie/showtime hợp lệ.
5. Phân loại được 400, 404, 502, 503 và 504 theo owner và evidence.

## 2. Problem Framing

Client cần một entry point ổn định, còn Catalog cần tự tiến hóa và sở hữu dữ liệu. Gateway giải quyết routing, edge policy và public representation. Nó không biến nhiều service thành một monolith phân tán.

```text
Client -- public HTTP contract --> Gateway -- internal HTTP contract --> Catalog
           untrusted input          edge policy                     domain owner
```

| Concern | Owner | Gateway được làm gì? | Gateway không được làm gì? |
|---|---|---|---|
| Route/version | Gateway | `/api/v1/movies` → Catalog | Suy ra movie đang ACTIVE |
| Movie/showtime rule | Catalog | Chuyển result/error an toàn | Query `catalog_db`, copy rule |
| Timeout | Caller/Gateway | Đặt deadline, map timeout | Retry write mù quáng |
| Correlation | Mọi hop | Nhận/sinh và truyền request ID | Dùng ID chứa PII/secret |
| Data source of truth | Catalog | Cache representation có policy | Trở thành owner thứ hai |

## 3. Mental Model: ownership trước topology

Microservice boundary tốt bắt đầu từ capability, invariant, source of truth và change cadence; không bắt đầu từ số lượng repository. Hai process không đủ chứng minh microservice nếu vẫn shared DB hoặc import repository của nhau.

### Worked example

`GET /api/v1/movies` qua Gateway. Catalog sở hữu danh sách movie và rule hiển thị. Gateway giữ public error envelope và request ID. Khi Catalog chậm hơn deadline, Gateway trả `504 UPSTREAM_TIMEOUT`; không bịa danh sách rỗng như success.

### Counterexample

Gateway join movie, showtime và booking tables rồi lọc suất còn ghế. Hậu quả: shared database, duplicate invariant, deploy coupling và không biết service nào chịu trách nhiệm khi dữ liệu lệch.

## 4. Design Exercise — tự làm

Vẽ context diagram và điền bảng:

| Dữ liệu/rule | Owner | Non-owner | Contract truyền qua boundary | Failure nếu ownership sai |
|---|---|---|---|---|
| Movie metadata | | | | |
| Showtime publication | | | | |
| Seat availability | | | | |
| Request ID | | | | |

## 5. Exit Gate

- [ ] Diagram có ít nhất hai trust/failure boundary.
- [ ] Ownership table không có shared write owner.
- [ ] Có decision cho 502/503/504.
- [ ] Nêu được ba business rule tuyệt đối không đặt ở Gateway.
- [ ] Interview: “Khi nào API Gateway trở thành distributed monolith?” — trả lời bằng context → decision → failure → evidence.

