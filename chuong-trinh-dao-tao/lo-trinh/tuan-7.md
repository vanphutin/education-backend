# Tuần 7 - Capstone sprint 1: hoàn thiện AI + payment + admin workflow

---

## 1. Nội dung tổng quan

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Làm như sprint thật: chia issue, PR nhỏ, harden luồng booking/payment/AI/admin. |
| **Lý thuyết & Scope** | Admin AI content draft, apply content, semantic search có filter showtime/city/date, payment edge cases, staff check-in. |
| **Sản phẩm (Deliverable)** | 3-5 PR nhỏ; API docs; e2e booking + payment mock; AI search evidence; payOS demo nếu sẵn sàng. |
| **Câu hỏi phỏng vấn (Interview drill)** | Bạn thiết kế boundary giữa AI và booking/payment như thế nào? |

---

## 2. Kế hoạch học tập theo ngày

| Buổi | Trọng tâm | Tài liệu học tập |
|---|---|---|
| **Thứ 2** | Sprint planning, issue breakdown | [GitHub Projects](https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects), [GitHub issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue), [Atlassian user stories](https://www.atlassian.com/agile/project-management/user-stories) |
| **Thứ 3** | API/DB proposal và PR nhỏ | [GitHub pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests), [Microsoft REST API Guidelines](https://github.com/microsoft/api-guidelines) |
| **Thứ 4** | Admin AI content draft workflow | [OpenAI API docs](https://platform.openai.com/docs/), [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings) |
| **Thứ 5** | Payment/AI hardening | [payOS API](https://payos.vn/docs/api/), [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x00-header/), [Google code review](https://google.github.io/eng-practices/review/) |
| **Thứ 6-7** | Review, demo, evidence | [GitHub review changes](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests), [Docker Compose](https://docs.docker.com/compose/) |

---

## 3. Các API tuần 7

```text
POST /admin/movies/:id/ai/content-draft
POST /admin/movies/:id/ai/trailer-description
POST /admin/movies/:id/ai-content/apply
GET /admin/integration-logs
GET /staff/showtimes/:id/check-ins
```

*Stretch goals nếu còn thời gian:*
```text
POST /ai/chat/sessions
POST /ai/chat/sessions/:id/messages
GET /ai/chat/sessions/:id
```
