# Các quy tắc nghiệp vụ (Business Rules) quan trọng

Tài liệu này tổng hợp toàn bộ các quy tắc ràng buộc nghiệp vụ (Business Rules) bắt buộc phải tuân thủ trong quá trình hiện thực mã nguồn của dự án.

---

## 0. Quy tắc boundary microservice

- **Identity Service** là owner duy nhất của credential, password hash, refresh session và token lifecycle. Service khác không copy bảng user/session.
- **Catalog Service** là owner của movie/cinema/screen/showtime metadata. Nó publish event versioned; Booking không join hoặc ghi `catalog_db`.
- **Booking Service** là owner của showtime-seat snapshot, hold, booking, payment record, ticket và invariant đặt ghế. Mọi lock/constraint/transaction chống double booking nằm trong `booking_db`.
- Gateway route/authenticate/propagate correlation nhưng không chứa business rule, database access hay transaction nghiệp vụ.
- Service ghi state + outbox trong một transaction local. Consumer dùng inbox/idempotency để chịu duplicate event/webhook. Không dùng shared DB hoặc distributed transaction để “đồng bộ ngay”.

## 1. Quy tắc giữ ghế (Seat holding) và đặt vé (Booking)

- **Ngăn chặn trùng lặp đặt ghế (Double booking):**
  Một ghế trong **snapshot của Booking Service** chỉ được phép bán hoặc giữ cho duy nhất một khách hàng tại một thời điểm. Phải áp dụng row lock/conditional update và constraint thích hợp trong `booking_db`; không kiểm tra Catalog rồi ghi Booking ở transaction khác.
- **Thời hạn giữ ghế tạm thời (Seat hold timeout):**
  Lệnh giữ ghế tạm thời (`seat_holds`) chỉ có hiệu lực tối đa trong **5 phút** (có thể cấu hình thành **2 phút** khi thực hiện demo). Hết thời gian này, ghế phải tự động trở về trạng thái `AVAILABLE`.
- **Hạn chế tạo Booking:**
  Không cho phép tạo booking nếu lệnh giữ ghế tạm tương ứng đã hết hạn.
- **Hạn chế thanh toán:**
  Không cho phép thanh toán cho bất kỳ booking nào đã ở trạng thái `EXPIRED` hoặc `CANCELLED`.
- **Hủy vé:**
  Không cho phép hủy vé xem phim sau giờ suất chiếu bắt đầu hoặc sau khi vé đã được check-in tại rạp.
- **Quản trị suất chiếu:**
  Catalog publish event cancel/change versioned; Booking quyết định hành vi local với hold/booking CONFIRMED theo policy. Không sửa Booking DB trực tiếp từ Catalog admin flow.

---

## 2. Quy tắc tích hợp cổng thanh toán payOS

- **Định danh đơn hàng:**
  Mã giao dịch `orderCode` gửi sang payOS phải là duy nhất trên toàn hệ thống.
- **Tính toán số tiền thanh toán (Amount validation):**
  Số tiền thanh toán gửi sang payOS bắt buộc phải do phía Backend tính toán lại dựa trên dữ liệu booking thực tế của hệ thống, không được tin cậy hoặc nhận số tiền truyền từ phía Client.
- **Xác thực Webhook (Signature verification):**
  Khi nhận webhook phản hồi từ payOS, backend bắt buộc phải thực hiện xác thực chữ ký điện tử (`signature`) để đảm bảo dữ liệu gửi từ nguồn tin cậy.
- **Xử lý trùng lặp Webhook (Idempotency):**
  Worker/webhook adapter và Booking consumer phải đảm bảo idempotent. Khi nhận cùng một thông tin thanh toán nhiều lần, event/inbox/idempotency record không được tạo vé trùng hoặc cập nhật sai trạng thái.
- **Đối soát số tiền và mã hóa:**
  Kiểm tra số tiền (`amount`), mã đơn hàng (`orderCode`) và ID cổng thanh toán (`paymentLinkId`) khớp hoàn toàn trước khi chuyển trạng thái booking sang `CONFIRMED`.
- **Môi trường thử nghiệm:**
  Vì payOS không cung cấp môi trường sandbox riêng, trong demo thực tế chỉ thực hiện các giao dịch thật có giá trị nhỏ (ví dụ: 1,000 VND - 2,000 VND).

---

## 3. Quy tắc an toàn hệ thống AI (AI Safety Rules)

- **AI chỉ hỗ trợ gợi ý (Recommendation/Assistant):**
  AI chỉ được tư vấn hoặc gợi ý phim, suất chiếu; tuyệt đối không để AI tự ý thực hiện đặt vé, giữ ghế hoặc tạo giao dịch thanh toán thay cho người dùng.
- **AI không quyết định giá vé:**
  AI không có quyền quyết định giá vé hoặc số tiền thanh toán của hóa đơn. Số tiền thanh toán luôn phải do backend tính toán từ logic nghiệp vụ.
- **Kiểm định dữ liệu đầu ra từ AI:**
  Tất cả dữ liệu do AI trả về phải đi qua một bộ lọc validate dữ liệu (DTO/schema) trước khi sử dụng trong mã nguồn hệ thống.
- **Bảo mật thông tin riêng tư:**
  Tuyệt đối không gửi thông tin tài khoản người dùng, mã token bí mật, mật khẩu hay chi tiết thẻ thanh toán vào prompt gửi đến AI Provider.
- **Nội dung nháp dành cho quản trị:**
  Các nội dung do AI tạo ra cho phía Admin (synopsis, trailer description) luôn ở trạng thái bản thảo nháp (`DRAFT`). Chỉ khi Admin phê duyệt (`APPLIED`), nội dung này mới được hiển thị công khai trên ứng dụng.
- **Tách biệt kiểm thử:**
  Môi trường kiểm thử tự động (Unit test, CI test) không được phép thực hiện gọi API thật của AI Provider để tránh tốn chi phí và giảm độ tin cậy của test suite.
- **Tái lập Vector Embeddings:**
  Catalog Service phải tạo outbox/job rebuild embedding khi Admin thay đổi thông tin phim; Booking không gọi AI provider.
