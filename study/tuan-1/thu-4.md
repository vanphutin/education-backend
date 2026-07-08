# 🗓️ Thứ 4 - NestJS first app, module, controller, provider, DI

## 1. Lý thuyết cốt lõi (Theory Notes)
*   **Khái niệm chính:**
    *   Module: nhóm các provider/controller liên quan thành một boundary.
    *   Controller: nhận HTTP request, parse input, trả response; không chứa business logic nặng.
    *   Provider/service: class chứa use case hoặc business logic, được Nest DI container quản lý.
    *   Dependency Injection: Nest inject dependency qua constructor để class không tự tạo dependency.
    *   DTO: mô tả input/output contract, tách khỏi domain model nếu logic bắt đầu phức tạp.
*   **Kiến thức đúc rút & Quy chế hoạt động:**
    *   Liên hệ OOP ngày thứ 3: Nest provider thực chất là class có dependency được inject.
    *   Một module tốt nên có boundary rõ: ví dụ `MoviesModule`, `CinemasModule`, `ShowtimesModule`.
    *   Controller gọi service; service có thể dùng repository/provider khác qua constructor injection.
    *   Khi logic tăng, ưu tiên tách service nhỏ theo trách nhiệm thay vì tạo service quá lớn.
*   **Ghi chú mở rộng (nếu có):**
    *   DI trong NestJS giúp đổi implementation dễ hơn, ví dụ mock repository khi test.

---

## 2. Lab mini (Thực hành nhỏ)
*   **Mục tiêu bài thực hành:**
    *   Tạo NestJS first app sau khi đã có nền OOP.
    *   Tạo `MoviesModule`, `MoviesController`, `MoviesService`.
    *   Inject service vào controller bằng constructor.
    *   Chuyển một phần OOP mini lab ngày thứ 3 thành provider/service trong NestJS.
*   **Mã nguồn mẫu / Cấu hình thử nghiệm:**
    ```typescript
    @Controller('movies')
    export class MoviesController {
      constructor(private readonly moviesService: MoviesService) {}

      @Get()
      findAll() {
        return this.moviesService.findAll();
      }
    }
    ```
*   **Kết quả chạy thử / Logs / Kiểm thử:**
    ```text
    // Dán log chạy local, curl GET /movies hoặc screenshot Swagger vào đây.
    ```

---

## 3. Câu hỏi phỏng vấn liên quan (Interview Drill)
*   *Câu hỏi:* Controller, service/provider và module khác nhau thế nào? DI trong NestJS giải quyết vấn đề gì so với tự `new` dependency trong class?
*   *Câu trả lời của bạn:*
    *   ...
