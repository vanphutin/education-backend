# Tuần 9 - Observability, monitoring mindset, resilience và deployment

**Giai đoạn:** Project Delivery  
**Chế độ học:** Operations theory + harden/deploy project.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Project không chỉ chạy local; có cách quan sát, debug, deploy và rollback. |
| Focus | Structured logging, correlation id, health/readiness, timeout/retry, rate limit, Docker/CI, deploy guide, runbook. |
| Project rule | Production hardening. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Observability: structured logs, request id, user id, latency, metrics/tracing mindset |
| Thứ 3 | Resilience: timeout, retry policy, rate limit, graceful shutdown, failure simulation |
| Thứ 4 | Deployment: Docker, env config, secrets, migrations, health/readiness, rollback |
| Thứ 5 | Map operational concerns into Movie Ticket Booking release |
| Thứ 6-7 | Implement hardening, health checks, deploy docs, smoke tests and runbook |

## 3. Output bắt buộc

- Log schema
- Health checks
- Rate limit/timeout policy
- Deploy guide
- Runbook evidence

## 4. Interview drill

- Log gì để debug mà không lộ dữ liệu?
- Retry khi nào nguy hiểm?
- Readiness khác liveness thế nào?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [OpenTelemetry - Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/) | [OpenTelemetry - Logs](https://opentelemetry.io/docs/concepts/signals/logs/) |
| Tue | [Microsoft Azure Architecture - Retry Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/retry) | [Microsoft Azure Architecture - Circuit Breaker Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker) |
| Wed | [Docker Docs - Docker Overview](https://docs.docker.com/get-started/docker-overview/) | [The Twelve-Factor App - Config](https://12factor.net/config) |
| Thu | [Kubernetes Docs - Probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/) | [Google SRE Book - Handling Overload](https://sre.google/sre-book/handling-overload/) |
| Fri-Sat | [Docker Docs - Compose](https://docs.docker.com/compose/) | [GitHub Actions Docs](https://docs.github.com/en/actions) |
