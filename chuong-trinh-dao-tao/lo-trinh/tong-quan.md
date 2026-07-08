# Tổng quan lộ trình 8 tuần & Hướng dẫn học tập

Tài liệu này cung cấp cái nhìn tổng quan về 8 tuần học và hướng dẫn phương pháp học tập, thực hành mỗi ngày nhằm tối ưu hóa kết quả.

---

## 1. Bản đồ lộ trình 8 tuần

Lộ trình được chia làm 4 giai đoạn cụ thể:

| Giai đoạn | Tuần | Chủ đề | Output chính |
|---|---:|---|---|
| **Foundation & Concepts** | 1-2 | HTTP, REST, NestJS, Node runtime, request pipeline | Repo skeleton, movie/showtime mock, validation, logging |
| **Backend Core** | 3-5 | PostgreSQL, TypeORM, Auth/RBAC, seat transaction, booking, test, Docker | DB thật, hold seat, booking, CI/Docker |
| **Integrations & AI** | 6 | payOS, webhook, jobs, AI semantic search, embeddings | Payment flow, pgvector, embedding jobs |
| **Capstone** | 7-8 | Hardening, sprint thật, docs, interview, demo | Project hoàn chỉnh để đưa CV |

---

## 2. Cách học mỗi ngày (Daily Routine)

Để học tập hiệu quả, hãy duy trì các bước sau cho mỗi buổi học:

1.  **Mở đúng tuần hiện tại:** Xem kỹ các yêu cầu, tài liệu lý thuyết và danh sách APIs/Deliverables cần làm.
2.  **Tạo Issue:** Tạo một GitHub issue nhỏ tương ứng với phần công việc cần làm hôm nay.
3.  **Daily Check-in:** Gửi báo cáo daily check-in cho Mentor AI theo cấu trúc quy định.
4.  **Lập trình:** Tiến hành viết code theo checklist của ngày, thực hiện commit nhỏ kèm thông điệp rõ ràng (Conventional Commits).
5.  **Tạo Pull Request (PR):** Đẩy code lên GitHub, mở PR và nhờ Mentor AI review code.
6.  **Kiểm thử & Triển khai:** Đảm bảo toàn bộ test case vượt qua, build ứng dụng thành công và migrations hoạt động ổn định.
7.  **Lưu trữ bằng chứng (Evidence):** Chụp lại log chạy thử, output của test hoặc UI của Swagger làm bằng chứng.
8.  **Kết thúc ngày:** Ghi lại 3 dòng tóm tắt: Đã hoàn thành gì, bằng chứng ở đâu, kế hoạch ngày mai là gì.

---

## 3. Cách học cuối tuần (Weekly Routine)

Vào thứ 6 và thứ 7 hàng tuần:

1.  **Chạy lại dự án:** Kiểm tra lại toàn bộ dự án từ hướng dẫn trong file README xem có chạy trơn tru không.
2.  **Chạy test suites:** Đảm bảo toàn bộ unit test/e2e test vượt qua.
3.  **Review PR:** Rà soát lại tất cả các PR đã merge trong tuần để củng cố kiến thức.
4.  **Mock Interview:** Thực hành phỏng vấn 1-1 với Mentor AI trong 20-30 phút xoay quanh các câu hỏi phỏng vấn của tuần đó.
5.  **Cải tiến:** Chọn ra 1-2 điểm yếu còn tồn đọng để tập trung cải thiện trong tuần kế tiếp.

---

## 4. Phụ lục link học tập tổng hợp

Các tài liệu chính thức giúp tra cứu nhanh trong suốt lộ trình học:

| Nhóm công cụ | Link chính thức |
|---|---|
| **NestJS** | [NestJS Documentation](https://docs.nestjs.com/) |
| **Node.js** | [Node.js Learning Guides](https://nodejs.org/en/learn) |
| **HTTP Specification** | [MDN HTTP Docs](https://developer.mozilla.org/en-US/docs/Web/HTTP) |
| **PostgreSQL** | [PostgreSQL Current Docs](https://www.postgresql.org/docs/current/) |
| **TypeORM** | [TypeORM Docs](https://typeorm.io/) |
| **pgvector** | [pgvector GitHub Repository](https://github.com/pgvector/pgvector) |
| **payOS** | [payOS Integration Docs](https://payos.vn/docs/) |
| **OpenAI** | [OpenAI API Reference](https://platform.openai.com/docs/) |
| **Jest Testing** | [Jest Getting Started](https://jestjs.io/docs/getting-started) |
| **Docker** | [Docker Overview Docs](https://docs.docker.com/) |
| **GitHub Actions** | [GitHub Actions Documentation](https://docs.github.com/en/actions) |
