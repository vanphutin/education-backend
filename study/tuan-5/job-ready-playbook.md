# Tuần 5 Job-ready Playbook — Catalog PostgreSQL ownership

## Outcome

Catalog có PostgreSQL riêng, migration/seed chạy lại được, constraint bảo vệ invariant và query có EXPLAIN evidence. Không claim performance từ dataset vài dòng hoặc in-memory fake.

## Daily depth

| Ngày | Mental model | Experiment | Evidence |
|---|---|---|---|
| Thứ 2 | requirement → facts/rules/access pattern → logical/physical model | Viết ERD + constraint matrix | DDL và invariant tests |
| Thứ 3 | expand → migrate/backfill → validate → contract | Chạy migration từ N-1 và database rỗng | up/down/compatibility log |
| Thứ 4 | query shape → selectivity → index → plan | Dataset đủ lớn, EXPLAIN ANALYZE before/after | plan, rows, buffers, latency |
| Thứ 5 | DB owner → API → outbox contract | Review transaction boundary | contract + ownership ADR |
| Thứ 6–7 | implement/reproduce/verify | PostgreSQL integration suite | CI output + query evidence |

## Required implementation

- Unique/check/FK constraints cho movie, screen và showtime; overlap rule có decision rõ.
- Additive migration; không `synchronize: true` như production strategy.
- Idempotent seed và deterministic fixtures.
- Pagination có stable order/tie-breaker.
- Repository integration tests dùng PostgreSQL thật.
- N+1 regression test hoặc query-count evidence.
- Outbox insert cùng local transaction với state change.

## Hard gates

Fail nếu chỉ có entity không có migration, invariant chỉ bảo vệ ở DTO, EXPLAIN không có dataset/query thật, hoặc Booking truy cập `catalog_db`.

Lab precursor: [`labs/project-delivery`](../../labs/project-delivery/README.md), tests tuần 5.

