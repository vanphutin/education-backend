# Mini Lab Ticket: Security/production lab: password hashing, JWT mock, rate limit idea, queue/cache/logging simulation

- **Tuần**: 3
- **Ngày**: Thứ 6-7
- **Issue**: [#15](https://github.com/vanphutin/education-backend/issues/15)
- **Giai đoạn**: Deep Foundation + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [OpenTelemetry - Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- **Nâng cao:** [Google SRE Book - Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

## 1. Lab Goal

Trang bị các kỹ năng thiết yếu khi đưa app lên Production: Bảo mật (Hashing, JWT), Logging và các cơ chế xử lý background. Lab này chỉ dùng script Node cơ bản.

## 2. Lab Requirements (Đề bài)

Khởi tạo project Node trống. Cài đặt: `npm i bcrypt jsonwebtoken`.

1. **Password Hashing:**
   - Viết file `hash.js`: Hash mật khẩu "123456" với saltRounds = 10.
   - Thử compare mật khẩu "123456" với chuỗi hash vừa tạo.
2. **JWT Mock:**
   - Viết file `jwt.js`: Tạo một JWT token chứa payload `{ userId: 1, role: 'admin' }`. Ký với secret key tùy ý (set hạn 15 phút).
   - Viết hàm verify. Cố tình sửa 1 ký tự trong token vừa tạo và verify lại để xem lỗi `JsonWebTokenError: invalid signature`.
3. **Structured Logging Simulation:**
   - Thay vì `console.log("User login failed")`, viết một hàm mô phỏng JSON Logger: `logger.error({ action: 'login', status: 'failed', ip: '192.168.1.1' })`.
4. **Queue Simulation (Mock):**
   - Giả lập hành động gửi Email tốn 3 giây bằng `setTimeout`.
   - Viết code gọi hàm gửi Email mà KHÔNG dùng `await` để request chính trả về ngay lập tức (fire-and-forget / mock background job).

## 3. Evidence

- Code snippet các bài test BCRYPT và JWT.
- Kết quả in ra JSON Logger.

## 4. Reflection

- Tại sao phải Hash + Salt thay vì chỉ mã hóa (encrypt) mật khẩu bằng hàm 2 chiều?
- Tại sao JWT không cần database mà backend vẫn biết user là ai? Nhược điểm lớn nhất của JWT là gì?

## 5. Interview Drill

- Question: Rate limit là gì và vì sao cần Rate limit cho API Login?
- My answer:
  - ...