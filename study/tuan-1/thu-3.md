# 🗓️ Thứ 3 - TypeScript và OOP trọng tâm trước NestJS

## 1. Lý thuyết cốt lõi (Theory Notes)
*   **Khái niệm chính:**
    *   Class và object: class là bản thiết kế, object là instance có state và behavior.
    *   Encapsulation: gom dữ liệu và hành vi liên quan vào cùng một class, hạn chế sửa state trực tiếp.
    *   Inheritance vs composition: ưu tiên composition cho service/domain behavior; dùng inheritance khi quan hệ "is-a" thật sự rõ.
    *   Polymorphism: cùng một interface/abstract contract, nhiều implementation khác nhau.
    *   Interface/type trong TypeScript: mô tả shape và contract giữa các lớp/module.
    *   Dependency Injection mindset: class nhận dependency từ bên ngoài thay vì tự `new` mọi thứ.
*   **Kiến thức đúc rút & Quy chế hoạt động:**
    *   NestJS dùng OOP rất nhiều: controller, service/provider, guard, pipe, interceptor đều là class.
    *   Provider trong NestJS là object được container quản lý vòng đời và inject vào nơi cần dùng.
    *   OOP tốt giúp code dễ test hơn vì dependency có thể mock qua interface/contract.
    *   Không nhồi business logic vào controller; controller nhận request và gọi service.
*   **Ghi chú mở rộng (nếu có):**
    *   Cần phân biệt DTO, entity/domain model và service. Ba khái niệm này không nên bị trộn lẫn.

---

## 2. Lab mini (Thực hành nhỏ)
*   **Mục tiêu bài thực hành:**
    *   Thử nghiệm OOP bằng TypeScript trước khi vào NestJS.
    *   Tạo mini domain model cho Movie Ticket Booking: `Movie`, `Cinema`, `Showtime`, `Seat`, `TicketPrice`.
    *   Viết service thuần TypeScript như `ShowtimeCatalogService` hoặc `SeatPricingService`.
    *   Chưa cần NestJS ở ngày này; mục tiêu là hiểu class, interface, constructor injection và test được logic.
*   **Mã nguồn mẫu / Cấu hình thử nghiệm:**
    ```typescript
    interface PriceRule {
      calculate(basePrice: number): number;
    }

    class WeekendPriceRule implements PriceRule {
      calculate(basePrice: number): number {
        return Math.round(basePrice * 1.2);
      }
    }

    class Showtime {
      constructor(
        public readonly movieId: string,
        public readonly startsAt: Date,
        private readonly basePrice: number,
        private readonly priceRule: PriceRule,
      ) {}

      getTicketPrice(): number {
        return this.priceRule.calculate(this.basePrice);
      }
    }
    ```
*   **Kết quả chạy thử / Logs / Kiểm thử:**
    ```text
    // Dán kết quả chạy script TypeScript hoặc test unit nhỏ vào đây.
    ```

---

## 3. Câu hỏi phỏng vấn liên quan (Interview Drill)
*   *Câu hỏi:* OOP gồm những trụ cột nào? Vì sao NestJS provider/service phù hợp với DI? Khi nào nên dùng interface thay vì class cụ thể?
*   *Câu trả lời của bạn:*
    *   ...
