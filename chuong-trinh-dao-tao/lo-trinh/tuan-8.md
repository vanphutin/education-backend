# Tuần 8 - Capstone sprint 2: hardening, docs, demo và phỏng vấn

---

## 1. Nội dung tổng quan

| Hạng mục | Nội dung |
|---|---|
| **Mục tiêu** | Đưa project vào trạng thái có thể đưa CV: chạy được, giải thích được, demo được, có evidence. |
| **Lý thuyết & Scope** | Race-condition test cơ bản, webhook replay test, embedding rebuild docs, README portfolio, mock interview, release note. |
| **Sản phẩm (Deliverable)** | Final README; Swagger; ERD; test output; Docker evidence; payOS notes; AI semantic search demo; interview notes. |
| **Câu hỏi phỏng vấn (Interview drill)** | Trình bày project trong 3 phút, sau đó drill sâu transaction, payOS, embeddings, test. |

---

## 2. Kế hoạch học tập theo ngày

| Buổi | Trọng tâm | Tài liệu học tập |
|---|---|---|
| **Thứ 2** | Backlog triage và scope cut | [GitHub managing issues](https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues), [Atlassian retrospective](https://www.atlassian.com/team-playbook/plays/retrospective) |
| **Thứ 3** | Regression test và race-condition evidence | [Jest async testing](https://jestjs.io/docs/asynchronous), [PostgreSQL transactions](https://www.postgresql.org/docs/current/tutorial-transactions.html), [PostgreSQL explicit locking](https://www.postgresql.org/docs/current/explicit-locking.html) |
| **Thứ 4** | Docs payOS, AI, embedding rebuild | [payOS NodeJS SDK](https://payos.vn/docs/sdks/back-end/node/), [pgvector](https://github.com/pgvector/pgvector), [OpenAI embeddings guide](https://platform.openai.com/docs/guides/embeddings) |
| **Thứ 5** | Docker demo, release note, README portfolio | [Docker Compose](https://docs.docker.com/compose/), [GitHub releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) |
| **Thứ 6-7** | Mock interview, final demo | [Google code review developer guide](https://google.github.io/eng-practices/review/developer/), [GitHub creating a release](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) |

---

## 3. Stretch goal APIs tuần 8

Nếu bạn còn thời gian, có thể hiện thực các API đánh giá phản hồi:

```text
POST /movies/:id/reviews
GET /movies/:id/reviews
POST /admin/movies/:id/reviews/ai-summary
GET /movies/:id/review-summary
```
