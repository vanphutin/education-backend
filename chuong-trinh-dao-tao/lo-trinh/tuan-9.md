# Tuần 9 - Microservice observability, resilience và deployment

**Giai đoạn:** Project Delivery  
**Chế độ học:** Operations theory + harden/deploy project.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Mỗi service/worker chạy, quan sát, fail và deploy độc lập được; operator lần theo được một flow xuyên Gateway, service và event. |
| Focus | Cross-service logs/traces, correlation id, health/readiness per service, timeout/retry/circuit policy, Docker/CI, deployment order, runbook. |
| Project rule | Không deploy như một process monolith; migration/config/readiness/rollback phải nêu owner và dependency. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Cross-service observability: request/trace/event ID, service map, logs/metrics/traces and cardinality discipline |
| Thứ 3 | Resilience: service timeout/retry policy, gateway rate limit, graceful shutdown, dependency/event failure simulation |
| Thứ 4 | Deployment: Compose, per-service config/secrets/migrations, health/readiness, rollout/rollback compatibility |
| Thứ 5 | Map operational concerns into Gateway/Identity/Catalog/Booking/Worker release topology |
| Thứ 6-7 | Implement hardening, health checks, traceable smoke tests, CI matrix and service runbooks |

## 3. Output bắt buộc
- Hoàn thành [Job-ready operability playbook](../../study/tuan-9/job-ready-playbook.md) và tests tuần 9 trong [`labs/project-delivery`](../../labs/project-delivery/README.md).

- Shared correlation/log schema plus service-specific metrics/traces
- Health/readiness per Gateway, Identity, Catalog, Booking and Worker
- Timeout/retry/rate-limit policy with owner/retry budget
- Compose/CI/deployment order/migration compatibility guide
- Failure-injection smoke tests and runbook evidence
- CI clean-checkout, correlated signals, graceful shutdown và rollback compatibility evidence.

## 4. Interview drill

- Trace cần đi qua HTTP và event boundary như thế nào?
- Một service down thì Gateway/worker/consumer degrade hoặc retry ra sao?
- Readiness của worker khác readiness của HTTP service thế nào?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [OpenTelemetry - Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/) | [OpenTelemetry - Logs](https://opentelemetry.io/docs/concepts/signals/logs/) |
| Tue | [Microsoft Azure Architecture - Retry Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry) | [Microsoft Azure Architecture - Circuit Breaker Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) |
| Wed | [Docker Docs - Docker Overview](https://docs.docker.com/get-started/docker-overview/) | [The Twelve-Factor App - Config](https://12factor.net/config) |
| Thu | [Kubernetes Docs - Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) | [Google SRE Book - Handling Overload](https://sre.google/sre-book/handling-overload/) |
| Fri-Sat | [Docker Docs - Compose](https://docs.docker.com/compose/) | [GitHub Actions Docs](https://docs.github.com/en/actions) |
