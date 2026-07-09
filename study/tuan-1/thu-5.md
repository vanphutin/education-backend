# Mini Lab Ticket: HTTP lab: dùng curl/Postman mô phỏng request lifecycle, headers, status code, timeout và CORS

- **Tuần**: 1
- **Ngày**: Thứ 5
- **Issue**: [#4](https://github.com/vanphutin/education-backend/issues/4)
- **Giai đoạn**: Core Theory + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [MDN - HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
- **Nâng cao:** [MDN - Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)


## 1. Lab Goal
Mini lab này giúp bạn vận dụng trực tiếp các khái niệm về HTTP Request/Response, Status Code, và CORS thông qua công cụ dòng lệnh hoặc API Client, hiểu rõ bản chất giao tiếp mạng trước khi code backend.

## 2. Lab Requirements (Đề bài)
1. **Request Lifecycle & Headers:**
   - Sử dụng `curl` hoặc Postman gọi một GET request tới `https://httpbin.org/get`.
   - Bổ sung ít nhất 2 Custom Headers (ví dụ: `X-My-Name`, `Authorization`) và kiểm tra response xem server có nhận được không.
2. **Status Codes:**
   - Dùng API `https://httpbin.org/status/{code}` để tạo ra các response có status 200, 201, 400, 401, 403, 404, 500, 502, 503.
   - Ghi lại ý nghĩa của từng loại trong file note.
3. **Timeout & Latency:**
   - Gọi request tới `https://httpbin.org/delay/5`.
   - Cấu hình Timeout trong Postman hoặc curl (tham số `-m 3`) thành 3 giây. Quan sát hiện tượng request bị abort.
4. **CORS:**
   - Mở Console của trình duyệt tại trang `https://google.com`.
   - Dùng `fetch('https://httpbin.org/get')` và xem kết quả.
   - Thử lại với `fetch('https://api.github.com')` để so sánh header `Access-Control-Allow-Origin`.

## 3. Evidence
- Chụp ảnh màn hình (hoặc copy log Terminal) của kết quả các bài test.
- Note lại lỗi CORS trên trình duyệt báo gì và cách đọc lỗi.

## 4. Reflection
- Tại sao frontend hay gặp lỗi CORS mà backend gọi nhau qua curl lại không bị?
- Timeout ảnh hưởng thế nào đến tài nguyên của server?

## 5. Interview Drill
- Question: Trình bày sự khác nhau giữa status 401 và 403?
- My answer:
  - ...