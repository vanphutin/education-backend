# PRODUCT BACKLOG DOCUMENT — Movie Ticket Booking Backend API

> **Phiên bản:** 1.0  
> **Ngày tạo:** 2026-07-08  
> **Vai trò soạn:** Senior Product Owner kiêm Backend Tech Lead  
> **Đối tượng đọc:** Backend Fresher/Junior developer, Mentor, Reviewer  
> **Stack:** NestJS · TypeScript · PostgreSQL · TypeORM · Redis · BullMQ · Docker · GitHub Actions · payOS · pgvector  

---

## Mục lục

| # | Phần | File | Nội dung chính |
|--:|------|------|---------------|
| 1 | Product Overview | `01-product-overview.md` | Vision, target users, business/engineering goals, success criteria |
| 2 | Actors & Permissions | `02-actors-permissions.md` | Guest, Customer, Staff, Admin, System — quyền hạn, ma trận |
| 3 | MVP Scope | `03-mvp-scope.md` | In Scope, Out of Scope, Stretch Goals |
| 4 | Product Epics | `04-product-epics.md` | 12 epic + dependency map |
| 5 | Backlog: Epic 1–3 | `05-backlog-part1.md` | BL-001 → BL-016: Catalog, Cinema Mgmt, Auth |
| 6 | Backlog: Epic 4–5 | `05-backlog-part2.md` | BL-017 → BL-026: Seat Hold, Booking, Ticket |
| 7 | Backlog: Epic 6–8 | `05-backlog-part3.md` | BL-027 → BL-032: Payment, Webhook, Jobs |
| 8 | Backlog: Epic 9–10 | `05-backlog-part4.md` | BL-033 → BL-040: AI Search, AI Content |
| 9 | Backlog: Epic 11–12 | `05-backlog-part5.md` | BL-041 → BL-055: Logging, Testing, Release |
| 10 | API Backlog Summary | `06-api-backlog-summary.md` | 55 endpoints, 9 nhóm API |
| 11 | Milestone Plan | `07-milestone-plan.md` | Roadmap 8 tuần chi tiết |
| 12 | Definition of Ready & Done | `08-dor-dod.md` | DoR (9 tiêu chí) + DoD (23 tiêu chí, 5 tiers) |
| 13 | Risk Register | `09-risk-register.md` | 20 risks, risk matrix, mitigation strategy |
| 14 | Final Portfolio Evidence | `10-final-evidence.md` | 14 evidence items, pitch, Q&A, demo flow |

---

## Tổng quan nhanh

- **55 backlog items** (BL-001 → BL-055)
- **55 API endpoints** dự kiến (45 Must, 7 Should, 3 Could)
- **12 epics** từ Public Catalog đến Release Evidence
- **20 risks** đã nhận diện và có mitigation plan
- **8 tuần** roadmap với deliverables + evidence mỗi tuần
- **26 câu hỏi phỏng vấn** deep-dive đã chuẩn bị

---

> **QUAN TRỌNG:** Tài liệu này là kim chỉ nam triển khai cho toàn bộ dự án. Mỗi backlog item đều có acceptance criteria, edge cases, failure cases và definition of done cụ thể. Không bắt đầu implement bất kỳ item nào khi chưa đọc kỹ backlog tương ứng.
