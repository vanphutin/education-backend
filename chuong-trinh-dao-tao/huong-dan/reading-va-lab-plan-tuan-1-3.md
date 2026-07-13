# Nhịp đọc và TypeScript lab — Tuần 1 đến Tuần 3

## Kết luận sau rà soát

Khối lượng hiện tại không ít: 15 daily ticket dài khoảng 1.800–3.300 từ/ticket, mỗi ngày có 2–8 nguồn ngoài theo mức cơ bản, nâng cao hoặc tra cứu. Điểm yếu trước đây là link chưa đi kèm ngân sách thời gian và câu hỏi đọc, trong khi code starter của một số lab quá sơ sài.

Không tăng số link một cách cơ học. Mỗi nguồn phải tạo được output: mental model, decision table, counterexample, test hoặc evidence. Nếu đọc xong mà không dự đoán được failure hay không tự giải thích lại được thì chưa tính là hoàn thành.

## Nhịp ngày lý thuyết — 5,5 đến 6,5 giờ

| Block | Thời lượng | Output bắt buộc |
|---|---:|---|
| Preview ticket + câu hỏi trước khi đọc | 20–30 phút | 5 câu hỏi và confidence ban đầu |
| Đọc local ticket có chủ đích | 60–90 phút | mental model một trang, không chép nguyên văn |
| Đọc primary/basic docs | 60–75 phút | bảng concept → problem → failure → evidence |
| Đọc advanced/reference có chọn section | 45–75 phút | 3 điều sửa hoặc làm sâu mental model |
| Worked examples/counterexamples | 60–90 phút | tối thiểu 2 valid và 2 invalid case |
| TypeScript micro exercise | 45–75 phút | pure function/type/test nhỏ, không scaffold project |
| Closed-book recall + interview drill | 30–45 phút | trả lời không nhìn notes, ghi lại lỗ hổng |

Nếu còn thời gian, làm stretch question hoặc đọc sâu một section RFC/docs. Không mở thêm nhiều bài blog cùng nói một ý.

## Nhịp ngày lab — 5 đến 7 giờ/ngày

1. Viết hypothesis và test matrix trước code: 30–45 phút.
2. Typecheck baseline và đọc code starter: 30–45 phút.
3. Implement theo phase nhỏ: 2–3 giờ.
4. Chạy positive, negative, boundary và failure-injection tests: 1–1,5 giờ.
5. Ghi raw evidence và giải thích: 45–60 phút.
6. Refactor theo invariant/dependency boundary: 30–60 phút.
7. Closed-book exit ticket: 20–30 phút.

`npm test` xanh chưa đủ. Người học phải giải thích test đó bảo vệ invariant nào và test nào vẫn còn thiếu.

## Bản đồ TypeScript lab khớp nội dung

| Tuần/ngày | Lab | TypeScript dùng để kiểm chứng | Không được biến thành |
|---|---|---|---|
| T1 Thứ 5 | HTTP/CORS harness | typed Node HTTP server, header/body boundary, timeout/cancellation, cache/CORS evidence | framework CRUD |
| T1 Thứ 6-7 | API contract | executable spec cho state transition, ETag/version, idempotency và stable cursor | controller/database |
| T2 Thứ 5 | TS/OOP domain | value object, runtime validation, Result union, ports, test doubles | class chỉ có getter/setter |
| T2 Thứ 6-7 | Nest mental model | provider token, dependency graph, module scope, override trong test | project thật |
| T3 Thứ 5 | PostgreSQL | TypeScript orchestration/assertion; SQL cho schema, constraint, EXPLAIN và lock | ORM che SQL |
| T3 Thứ 6-7 | Security/production | bcrypt/JWT/redaction, fake clock, limiter/cache, retry/idempotency/DLQ simulation | production auth/queue giả |

## Cổng tăng tốc

Nếu hoàn thành sớm và giải thích được toàn bộ exit criteria:

- thêm property/boundary tests thay vì thêm feature;
- inject failure mới và dự đoán outcome trước khi chạy;
- thay adapter nhưng giữ business rule/test contract;
- viết ADR ngắn so sánh hai lựa chọn;
- làm lại lab từ test matrix sau 24 giờ mà không nhìn implementation.

Nếu đang chậm, không cắt primary docs, negative tests hoặc phần giải thích evidence. Có thể hoãn stretch/advanced section và ghi rõ debt cần quay lại.
