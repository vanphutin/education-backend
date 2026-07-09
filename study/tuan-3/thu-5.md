# Mini Lab Ticket: Database lab: schema nhỏ, constraints, indexes, EXPLAIN, transaction rollback và lock behavior

- **Tuần**: 3
- **Ngày**: Thứ 5
- **Issue**: [#14](https://github.com/vanphutin/education-backend/issues/14)
- **Giai đoạn**: Deep Foundation + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [PostgreSQL Docs - Transactions Tutorial](https://www.postgresql.org/docs/current/tutorial-transactions.html)
- **Nâng cao:** [PostgreSQL Docs - Transaction Isolation](https://www.postgresql.org/docs/current/transaction-iso.html)


## 1. Lab Goal
Thực hành trực tiếp trên Database PostgreSQL (bỏ qua Code). Hiểu về relations, constraints, indexes, EXPLAIN và cách Transaction/Lock hoạt động.

## 2. Lab Requirements (Đề bài)
Dùng DBeaver hoặc pgAdmin kết nối tới PostgreSQL (chạy Docker hoặc local).
1. **Schema & Constraints:**
   - Tạo bảng `users` (id, email, balance). Set `email` là UNIQUE.
   - Tạo bảng `orders` (id, user_id, amount). Set Foreign Key `user_id` reference tới `users(id)`.
2. **Indexes & Query Plan:**
   - Chạy lệnh `EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 1;` khi CHƯA có index trên `user_id`. Ghi lại Execution Time và Seq Scan.
   - Thêm `CREATE INDEX idx_orders_user_id ON orders(user_id);`.
   - Chạy lại `EXPLAIN ANALYZE` và quan sát Index Scan.
3. **Transaction & Locks:**
   - Mở **2 cửa sổ query (2 session riêng biệt)**.
   - Session 1: `BEGIN; SELECT balance FROM users WHERE id = 1 FOR UPDATE;` (Chưa COMMIT).
   - Session 2: Chạy câu lệnh `UPDATE users SET balance = balance - 10 WHERE id = 1;`. Quan sát Session 2 bị treo (lock waiting).
   - Quay lại Session 1 chạy `COMMIT;`. Quan sát Session 2 hoàn thành ngay lập tức.

## 3. Evidence
- Script DDL tạo bảng.
- Kết quả text của 2 lần chạy EXPLAIN ANALYZE (trước/sau index).
- Chụp màn hình / mô tả lại hiện tượng lock ở câu 3.

## 4. Reflection
- Thiếu Index ở Foreign Key gây ra hậu quả gì khi dữ liệu lớn?
- Lệnh `FOR UPDATE` hữu ích trong bài toán thực tế nào (VD: Đặt vé, trừ tiền)?

## 5. Interview Drill
- Question: N+1 Query là gì và làm sao để phát hiện nó?
- My answer:
  - ...