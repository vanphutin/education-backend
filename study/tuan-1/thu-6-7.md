# Mini Lab Ticket: API design lab: thiết kế API contract nhỏ, idempotency, pagination, filtering và error response

- **Tuần**: 1
- **Ngày**: Thứ 6-7
- **Issue**: [#5](https://github.com/vanphutin/education-backend/issues/5)
- **Giai đoạn**: Core Theory + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [MDN - HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- **Nâng cao:** [RFC 9110 Section 9.2.2 - Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2)

## 1. Lab Goal
Làm quen với việc thiết kế API Contract (giao kèo API) bằng tư duy RESTful. Hiểu cách map các action của User thành HTTP Methods và cấu trúc URL chuẩn.

## 2. Lab Requirements (Đề bài)
Hãy thiết kế API Contract cho một **Hệ thống Quản lý Cửa hàng Sách**.
Bạn cần viết ra Markdown Table hoặc JSON format cho các API sau:
1. **CRUD Sách:**
   - Lấy danh sách sách (Hỗ trợ Pagination: `page`, `limit`, và Filtering: `category`, `price_min`).
   - Xem chi tiết 1 cuốn sách.
   - Thêm sách mới.
   - Cập nhật thông tin sách (Idempotent update - dùng method gì?).
   - Xóa sách.
2. **Error Response:**
   - Thiết kế 1 format chuẩn cho JSON Error Response (bao gồm: `code`, `message`, `details`).
   - Lấy ví dụ response khi User tìm 1 cuốn sách không tồn tại (Status code mấy?).
   - Lấy ví dụ response khi User truyền sai kiểu dữ liệu `price` (âm).
3. **Idempotency:**
   - Phân biệt giữa hành động "Tăng số lượng tồn kho lên 1" (Non-idempotent) và "Set số lượng tồn kho bằng 10" (Idempotent). Thiết kế endpoint cho 2 action này.

## 3. Evidence
- Lưu API Contract (bảng Markdown) vào file này.
- Bao gồm URL, Method, Query Params, Request Body (JSON mẫu) và Response.

## 4. Reflection
- Vì sao POST lại không idempotent còn PUT thì có?
- Pagination theo `offset/limit` có nhược điểm gì so với `cursor-based`?

## 5. Interview Drill
- Question: Idempotency là gì và vì sao API cần idempotent?
- My answer:
  - ...