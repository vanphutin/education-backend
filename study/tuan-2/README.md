# Tuần 2 - TypeScript/OOP, NestJS mental model và backend code organization

**Giai đoạn:** Core Theory + Mini Labs  

**Nhịp bắt buộc:** xem [kế hoạch đọc và TypeScript lab tuần 1-3](../../chuong-trinh-dao-tao/huong-dan/reading-va-lab-plan-tuan-1-3.md). Không tính hoàn thành nếu chỉ đọc hoặc code chạy mà chưa giải thích invariant/failure/test.
**Nhịp học:** Thứ 2-4 học chuyên sâu. Thứ 5-7 làm mini labs từ kiến thức Thứ 2-4. Chưa bắt đầu dự án thật.

Roadmap chi tiết: [chuong-trinh-dao-tao/lo-trinh/tuan-2.md](../../chuong-trinh-dao-tao/lo-trinh/tuan-2.md)

## Daily tickets

- [Thứ 2 - Theory Deep Dive: TypeScript foundation: type, interface, class, generic, error typing, runtime vs compile time](thu-2.md) (Issue #6)
- [Thứ 3 - Theory Deep Dive: OOP for backend: encapsulation, composition over inheritance, polymorphism, value object mindset](thu-3.md) (Issue #7)
- [Thứ 4 - Theory Deep Dive: Dependency Injection and modular design: why DI exists, dependency direction, testability](thu-4.md) (Issue #8)
- [Thứ 5 - Mini Lab: TypeScript/OOP lab: viết domain mini models, validation rules và error handling không dùng framework](thu-5.md) (Issue #9)
- [Thứ 6-7 - Mini Lab: NestJS mental model lab: module/controller/service/provider mini app, chỉ để hiểu framework như công cụ](thu-6-7.md) (Issue #10)

> Tuần 2 chưa làm dự án thật. Thứ 5-7 là mini lab của kiến thức đã học từ Thứ 2-4.

## Learning narrative

```text
Thứ 2: type/state/runtime boundary
           │
           ▼
Thứ 3: invariant/identity/responsibility
           │
           ▼
Thứ 4: dependency/boundary/composition
           │
           ├──► Thứ 5: kiểm chứng domain model không framework
           └──► Thứ 6-7: kiểm chứng request flow và provider graph bằng NestJS
```

Ba ngày đầu không học thuộc định nghĩa rời rạc. Mỗi concept phải trả lời được:

1. Problem/failure nào khiến concept cần tồn tại?
2. Mental model giúp dự đoán code trước khi chạy là gì?
3. Example và counter-example khác nhau ở invariant/boundary nào?
4. Alternative đơn giản hơn là gì?
5. Trade-off và dấu hiệu decision cần đổi là gì?

## Study loop bắt buộc cho ticket lý thuyết

1. Đọc Learning Objectives và ghi mức tự tin trước buổi học.
2. Với mọi snippet/diagram, viết prediction và reasoning trước khi compiler/test xác nhận.
3. Tự điền bảng “giải thích bằng lời của tôi”; không chép handbook hoặc đáp án mẫu.
4. Tạo ít nhất một example và một counter-example mới.
5. Làm design exercise, vẽ diagram/decision table trước khi code.
6. Đối chiếu Common Mistakes với lỗi mình thực sự mắc.
7. Trả lời Self-check/Exit Criteria và Interview Drill bằng tình huống/trade-off.
8. Sau 24 giờ, làm lại exit ticket không nhìn notes; đánh dấu chỗ mental model còn yếu.

Nếu prediction sai, giữ lại prediction cũ và bổ sung điều đã sửa. Sai có evidence là dữ liệu học tập, không phải phần cần xóa.

## Deliverable map

| Ngày | Artifact để review | Điều artifact phải chứng minh |
|---|---|---|
| Thứ 2 | Type/state/data-flow diagram, prediction log, Result-vs-exception và complexity decision | Phân biệt compile-time với runtime; model loại invalid state; chọn structure/failure contract có lý do |
| Thứ 3 | Domain/state/responsibility diagram, invariant/equality table, pattern/refactor decision | Entity/VO/invariant đúng owner; class/function/pattern theo forces; refactor giữ behavior |
| Thứ 4 | Request flow + source dependency graph, composition root, test-boundary matrix | Phân biệt IoC/DI/DIP; layer/port/adapter rõ; test double đúng câu hỏi |
| Thứ 5 | OOP lab tests và evidence trước/sau refactor | Invalid state bị chặn; normalization/equality/Result rõ; refactor an toàn |
| Thứ 6-7 | Nest lab provider override, HTTP tests và error translation evidence | Repository port + in-memory adapter thay được; provider graph hiểu được; HTTP boundary không rò framework vào core |

## Weekly Definition of Done

- [ ] Hoàn thành đủ ba ticket theory trước khi bắt đầu lab tương ứng.
- [ ] Mỗi ticket theory có prediction sai/đúng, example/counter-example, diagram, decision và exit ticket.
- [ ] Không điền phần tự diễn giải bằng cách copy nội dung ngay phía trên; phải dùng ví dụ riêng.
- [ ] OOP lab có test matrix cho invariant, equality, normalization, Result/exception và refactor.
- [ ] Nest lab có request flow, repository port, in-memory adapter, runtime token, provider override và HTTP error translation.
- [ ] Có ít nhất một pattern được từ chối bằng KISS/YAGNI, không xem số lượng pattern là tiêu chí hoàn thành.
- [ ] Interview answer từng ngày đúng chủ đề ngày đó, có context → decision → trade-off → failure/evidence.
