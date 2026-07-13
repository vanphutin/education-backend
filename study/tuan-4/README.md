# Tuần 4 — Microservice kickoff: Gateway + Catalog

Tuần 4 chuyển từ foundation sang delivery. Mục tiêu không phải “tạo hai NestJS app”, mà là chứng minh hai deployable có ownership, contract, failure behavior và evidence rõ.

## Daily Workspace

- [Thứ 2 — Microservice boundary và ownership](thu-2.md)
- [Thứ 3 — Composition root, config và deployable structure](thu-3.md)
- [Thứ 4 — Request pipeline, deadline và error mapping](thu-4.md)
- [Thứ 5 — Contract & ownership workshop](thu-5.md)
- [Thứ 6–7 — Gateway + Catalog delivery lab](thu-6-7.md)
- [Executable TypeScript lab](../../labs/tuan-4/gateway-catalog/README.md)

## Learning Flow

```text
ownership → deployable boundary → request/failure pipeline
→ contract review → implementation → tests/evidence → interview explanation
```

## Weekly Gate

- Gateway và Catalog chạy độc lập.
- Không shared database hoặc cross-service repository.
- Public/internal contract và stable error envelope.
- Request ID, deadline, health/readiness.
- Unit + integration + cross-service e2e + failure smoke tests.
- Docker clean setup, OpenAPI, ADR và reproducible evidence.

