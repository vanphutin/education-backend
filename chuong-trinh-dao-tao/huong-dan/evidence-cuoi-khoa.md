# Danh sách Evidence cần có cuối khóa

Tài liệu này tổng hợp các kết quả đầu ra (artifacts/evidences) bắt buộc phải chuẩn bị và đính kèm vào repository dự án trước khi kết thúc khóa học 8 tuần để phục vụ việc đánh giá và viết CV.

---

| STT | Loại Evidence | Nội dung chi tiết | Vị trí khuyến nghị trong Repo |
|---|---|---|---|
| 1 | **README Portfolio** | Tài liệu hướng dẫn cài đặt chạy local, cấu trúc dự án, mô tả công nghệ sử dụng và các thành tựu đạt được. | `README.md` (root) |
| 2 | **Database ERD** | Sơ đồ mối quan hệ thực thể (ERD) hoàn thiện của dự án dạng ảnh hoặc Mermaid chart kèm giải thích. | `docs/db/erd.md` |
| 3 | **API Docs** | Cấu hình Swagger OpenAPI và tài liệu mô tả chi tiết các endpoint phục vụ Client. | Swagger UI hoặc `docs/api/` |
| 4 | **payOS Integration Flow** | Sơ đồ và tài liệu giải thích luồng tích hợp thanh toán payOS, xử lý webhook và idempotency. | `docs/integrations/payos-flow.md` |
| 5 | **AI Semantic Search Design** | Tài liệu giải thích cơ chế tìm kiếm ngữ nghĩa bằng vector embeddings, cách lưu trữ pgvector và tối ưu hóa truy vấn. | `docs/ai/semantic-search.md` |
| 6 | **Embedding Rebuild Runbook** | Tài liệu hướng dẫn quản trị viên cách cập nhật hoặc rebuild hàng loạt embeddings thủ công. | `docs/ai/embedding-rebuild.md` |
| 7 | **Test Execution Output** | Báo cáo kết quả chạy test suites (Unit tests và E2E tests) kèm chỉ số phủ sóng (Test Coverage >= 75%). | `docs/evidence/test-output.md` |
| 8 | **Docker Compose Setup** | Tập tin cấu hình Docker Compose kèm hướng dẫn khởi chạy toàn bộ môi trường (App, Postgres, Redis). | `docs/evidence/docker-compose-demo.md` |
| 9 | **Race-condition Solution** | Tài liệu phân tích vấn đề double-booking và giải pháp giải quyết bằng database transaction / row lock. | `docs/evidence/seat-race-condition.md` |
| 10| **Mock Interview Notes** | Ghi chép câu hỏi phỏng vấn và câu trả lời đã chuẩn bị sau các buổi luyện tập phỏng vấn 1-1. | `docs/interview/backend-interview-notes.md` |
