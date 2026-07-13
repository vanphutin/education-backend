# Tuần 10 - Distributed system capstone, final evidence và mock interview

**Giai đoạn:** Capstone  
**Chế độ học:** Final synthesis at maximum intensity.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Demo được system theo service ownership và bảo vệ được các trade-off distributed systems bằng evidence. |
| Focus | Service context/API-event contract, database ownership, failure modes, test/evidence pack, load sanity, release notes, mock interview. |
| Project rule | Final capstone phải giải thích vì sao microservice boundary hiện tại đủ nhỏ, nơi nào cố ý chưa tách và điều kiện tách tiếp. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Trọng tâm |
|---|---|
| Thứ 2 | Distributed system design review: service ownership, API/event, DB, state, consistency and failure modes |
| Thứ 3 | Performance/load sanity: Gateway/service/DB/queue bottleneck, backpressure and bottleneck analysis |
| Thứ 4 | Interview deep dive: HTTP, DB, transaction, auth, events, outbox, cache, deploy, microservice trade-offs |
| Thứ 5 | Final evidence gap closure, service topology/release note and demo route |
| Thứ 6-7 | Cross-service regression, demo, failure drill, mock interview and mentor review |

## 3. Output bắt buộc
- Hoàn thành [Job-ready capstone playbook](../../study/tuan-10/job-ready-playbook.md) và release-gate tests trong [`labs/project-delivery`](../../labs/project-delivery/README.md).

- Service context/container diagram and ownership matrix
- Final README with local topology/run instructions and dependency map
- HTTP/event contract, duplicate/failure/load evidence pack
- Public demo, p95/error-rate budget, hiring case studies, CV bullets và mock-interview scorecard.
- Release notes/migration compatibility/runbooks
- Mock interview answers defending microservice trade-offs

## 4. Interview drill

- Vì sao đây là microservice boundary hợp lý thay vì distributed monolith?
- Nếu scale 10x, Gateway/service/DB/queue nghẽn khác nhau thế nào?
- Nếu production thật, service nào nên tách thêm hoặc gộp lại và dựa trên evidence nào?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) | [Google SRE Book - Table of Contents](https://sre.google/sre-book/table-of-contents/) |
| Tue | [Grafana k6 Docs - Get Started](https://grafana.com/docs/k6/latest/get-started/) | [Grafana k6 Docs - Load Test Types](https://grafana.com/docs/k6/latest/using-k6/test-types/) |
| Wed | [OWASP API Security Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x00-header/) | [Google SRE Book - Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/) |
| Thu | [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) | [GitHub Docs - About Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) |
| Fri-Sat | [AWS Well-Architected Reliability Pillar](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html) | [Google SRE Book - Postmortem Culture](https://sre.google/sre-book/postmortem-culture/) |
