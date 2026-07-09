# Mini Lab Ticket: NestJS mental model lab: module/controller/service/provider mini app, chỉ để hiểu framework như công cụ

- **Tuần**: 2
- **Ngày**: Thứ 6-7
- **Issue**: [#10](https://github.com/vanphutin/education-backend/issues/10)
- **Giai đoạn**: Core Theory + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [NestJS Docs - Controllers](https://docs.nestjs.com/controllers)
- **Nâng cao:** [NestJS Docs - Execution Context](https://docs.nestjs.com/fundamentals/execution-context)


## 1. Lab Goal
Làm quen với Mental Model (mô hình tư duy) của NestJS. Hiểu cách framework này map từ một HTTP request vào OOP class thông qua Dependency Injection.

## 2. Lab Requirements (Đề bài)
1. **Khởi tạo:**
   - Dùng `npx @nestjs/cli new nest-lab` (chọn npm).
2. **Modules & Controllers:**
   - Tạo một `UsersModule`, `UsersController`, `UsersService`.
   - Khai báo 1 endpoint GET `/users` trả về mảng `[{ id: 1, name: 'Alice' }]` hardcode trong Service.
3. **Dependency Injection:**
   - Bơm `UsersService` vào `UsersController` thông qua constructor.
   - Thử bỏ dòng `providers: [UsersService]` trong `UsersModule` và chạy lại server. Quan sát lỗi `Nest can't resolve dependencies of the UsersController`.
4. **Mô phỏng Failure Handling:**
   - Tạo 1 endpoint GET `/users/error`.
   - Ném ra `new HttpException('Lỗi kết nối DB', 500)`.
   - Xem cách NestJS tự động chuyển Error object thành JSON response cho client.

## 3. Evidence
- Chụp code controller và module.
- Chụp màn hình lỗi khi quên inject provider.
- Chụp JSON response khi bắt HttpException.

## 4. Reflection
- NestJS đóng vai trò gì trong kiến trúc ứng dụng của bạn? (Gợi ý: Nó chỉ là lớp giao tiếp Transport Layer).
- Dependency Injection giải quyết bài toán gì so với việc `const service = new UsersService()` bên trong Controller?

## 5. Interview Drill
- Question: Inversion of Control (IoC) là gì và NestJS triển khai nó như thế nào?
- My answer:
  - ...