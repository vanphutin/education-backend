# Project Delivery Labs — Tuần 5–10

Một TypeScript harness chạy lại được cho các invariant/failure quan trọng trước khi tích hợp vào Movie Ticket Booking.

```bash
npm install
npm test
```

| Tuần | Experiment | Điều được chứng minh |
|---:|---|---|
| 5 | Migration order + index access pattern | Không `NOT NULL` trước backfill/validate; index theo query |
| 6 | RBAC deny-default + refresh rotation | Permission boundary và replay revocation |
| 7 | Seat hold + idempotency | Một owner, replay cùng outcome, conflict khi reuse key |
| 8 | Worker retry/DLQ/deduplication | At-least-once không tạo duplicate effect |
| 9 | Retry policy + safe structured log | Retry bounded/idempotent; không log token |
| 10 | Percentile + release gate | Không release chỉ vì average đẹp |

Các lab là precursor, không thay PostgreSQL/Redis/network integration test trong project thật.
