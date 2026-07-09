# Mini Lab Ticket: TypeScript/OOP lab: viết domain mini models, validation rules và error handling không dùng framework

- **Tuần**: 2
- **Ngày**: Thứ 5
- **Issue**: [#9](https://github.com/vanphutin/education-backend/issues/9)
- **Giai đoạn**: Core Theory + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [TypeScript Handbook - Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- **Nâng cao:** [TypeScript Handbook - Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)

## 1. Lab Goal

Thực hành lập trình Hướng đối tượng (OOP) và TypeScript căn bản. Hiểu khái niệm Value Object và Error Handling mà không phụ thuộc vào bất kỳ Framework nào.

## 2. Lab Requirements (Đề bài)

Tạo 1 folder `oop-lab`, setup Node + TS (`tsc --init`).

1. **Value Object & Class:**
   - Tạo class `Email` (Value Object). Constructor nhận vào 1 string.
   - Validate định dạng email (bằng Regex). Nếu sai, throw ra một custom error `InvalidEmailError`.
   - Tạo class `User`. Entity này có thuộc tính `id`, `name`, và `email` (kiểu `Email`).
2. **Encapsulation:**
   - Thuộc tính `email` không được phép sửa từ bên ngoài (private/readonly).
   - Viết method `changeEmail(newEmail: string)` trong `User` để thực hiện việc cập nhật.
3. **Test:**
   - Khởi tạo `User` với email hợp lệ.
   - Bắt block `try/catch` khi khởi tạo `User` với email sai định dạng, in ra thông báo lỗi đẹp mắt thay vì stack trace.

## 3. Evidence

- Chép toàn bộ file `User.ts` và `Email.ts` vào đây.
- Output log khi chạy thành công và khi catch error.

## 4. Reflection

- Vì sao nên dùng `Email` class thay vì chỉ dùng kiểu `string` trong `User`? (Primitive Obsession).
- Custom error giúp ích gì trong việc quản lý lỗi so với `throw new Error()` mặc định?

## 5. Interview Drill

- Question: Kể tên 4 tính chất của OOP và giải thích cách bạn áp dụng tính Đóng gói (Encapsulation) trong lab này?
- My answer:
  - ...