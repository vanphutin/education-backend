# Tuần 7 Job-ready Playbook — Booking consistency

## Outcome

Booking bảo vệ invariant một ghế chỉ có một active hold/booking bằng database-local atomicity; duplicate command/event trả cùng outcome và race test tái chạy được.

## Daily depth

| Ngày | Trọng tâm | Experiment | Evidence |
|---|---|---|---|
| Thứ 2 | state machine + transition ownership | forbidden transitions | transition table/tests |
| Thứ 3 | MVCC, row lock, deadlock, optimistic version | 20–100 concurrent holds | exactly-one-winner log |
| Thứ 4 | idempotency request/event/webhook | same key/same payload vs conflict | replay tests |
| Thứ 5 | Catalog snapshot → Booking local transaction | duplicate/out-of-order event | inbox evidence |
| Thứ 6–7 | hold/confirm/ticket/check-in slice | expiry and process retry | PostgreSQL e2e/race suite |

## Required implementation

- State transition table có precondition/postcondition và forbidden edge.
- Constraint/index/lock strategy bảo vệ active seat ownership.
- Idempotency record lưu actor, operation, payload hash, outcome.
- Same key + different payload trả conflict.
- Hold expiry dùng database time/worker policy rõ.
- Race tests dùng connection/transaction thật, không chỉ Promise trên Map.

## Hard gates

Fail nếu `find then insert` không atomic, lock giữ trong lúc gọi provider, distributed transaction, hoặc retry deadlock vô hạn.

Lab precursor: [`labs/project-delivery`](../../labs/project-delivery/README.md), tests tuần 7.

