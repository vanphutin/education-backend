# Tuần 10 Job-ready Playbook — Capstone and hiring evidence

## Outcome

Repo chạy từ clean checkout, demo core flow và failure flow, có performance budget, release gate, architecture decisions và lời giải thích phỏng vấn dựa trên evidence thay vì buzzword.

## Daily depth

| Ngày | Trọng tâm | Artifact |
|---|---|---|
| Thứ 2 | requirements, capacity, topology, consistency/failure review | system design packet |
| Thứ 3 | k6 scenario, p50/p95/p99, error rate, saturation | baseline + bottleneck report |
| Thứ 4 | HTTP/DB/auth/events/cache/deploy interview | 50-question answer bank |
| Thứ 5 | evidence gap, release notes, demo route | candidate release |
| Thứ 6–7 | regression, incident drill, mock interview | final scorecard |

## Release gate

- CI green; clean setup ≤ documented time.
- Core public flow, auth deny, double-hold, duplicate event và provider failure tested.
- Error rate ≤1% và p95 budget được đặt trước test; không dùng average làm gate.
- OpenAPI, ERD, state machine, service topology, ADR và runbook khớp code.
- README có scope/non-goals, commands, test strategy và trade-offs.
- Demo 5–7 phút gồm một success và một controlled failure.

## Hiring packet

1. Hai case studies: double booking; duplicate/lost event.
2. CV bullets có action + technical decision + measurable evidence.
3. Pitch 90 giây và deep dive 5 phút.
4. Mock interview: coding/SQL/debug/system design/behavioral.
5. Gap list trung thực: điều chưa productionize và điều kiện cải tiến.

## Hard gates

Không gọi job-ready nếu repo không chạy, test/evidence không tái lập, diagram khác code, hoặc không giải thích được một failure path mới.

Lab precursor: [`labs/project-delivery`](../../labs/project-delivery/README.md), tests tuần 10.

