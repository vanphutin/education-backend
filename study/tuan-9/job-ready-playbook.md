# Tuần 9 Job-ready Playbook — Operability and delivery

## Outcome

Một operator lần theo request/event xuyên service, phát hiện saturation/error/latency, dừng process an toàn và deploy/rollback theo compatibility window. CI chứng minh clean checkout.

## Daily depth

| Ngày | Trọng tâm | Drill | Evidence |
|---|---|---|---|
| Thứ 2 | logs/metrics/traces + cardinality | trace one success/failure | correlated signals |
| Thứ 3 | deadline/retry/circuit/backpressure | Catalog/Redis/DB down | degraded behavior |
| Thứ 4 | image/config/migration/probes/rollback | bad config/migration | rollback record |
| Thứ 5 | topology/SLO/runbook ownership | incident tabletop | owner/escalation map |
| Thứ 6–7 | Compose + CI + smoke/failure suite | graceful shutdown | green pipeline/runbook |

## Required implementation

- JSON logs: timestamp, level, service, request/trace/event ID, route template, outcome, duration; no token/PII.
- RED metrics and queue depth/DLQ/saturation signals.
- Liveness does not depend on downstream; readiness reflects ability to serve.
- Timeout budget per hop; retry only idempotent/transient and bounded.
- SIGTERM stops intake, drains bounded work, closes DB/queue.
- CI: install lockfile, typecheck, lint, unit, integration, e2e, build, image scan optional.

## Hard gates

Fail if only `console.log`, `/health` always 200, unbounded retry, mutable latest-only image, or manual-only verification.

Lab precursor: [`labs/project-delivery`](../../labs/project-delivery/README.md), tests tuần 9.

