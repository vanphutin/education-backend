# Tuần 1 - Backend mindset, Internet, HTTP và API fundamentals

**Giai đoạn:** Core Theory + Guided Mini Labs

**Nhịp bắt buộc:** xem [kế hoạch đọc và TypeScript lab tuần 1-3](../../chuong-trinh-dao-tao/huong-dan/reading-va-lab-plan-tuan-1-3.md). Mỗi ngày lý thuyết 5,5–6,5 giờ; lab dùng TypeScript strict mode và phải có executable evidence.

**Nhịp học:** Thứ 2-4 xây mental model. Thứ 5-7 dùng evidence để kiểm chứng và thiết kế contract. Chưa bắt đầu dự án thật.

Roadmap và exit criteria: [chuong-trinh-dao-tao/lo-trinh/tuan-1.md](../../chuong-trinh-dao-tao/lo-trinh/tuan-1.md)

## Năng lực trọng tâm

- Phân rã bài toán theo actor, use case, boundary, state, invariant, side effect và failure.
- Lần theo request qua DNS, TCP, TLS, HTTP, proxy, application và dependency.
- Phân biệt network failure, timeout, HTTP error, domain conflict và CORS error bằng evidence.
- Thiết kế API contract-first thay vì bắt đầu từ controller hoặc framework.
- Giải thích trade-off của timeout, retry, cache, idempotency và optimistic concurrency.

## Daily tickets

- [Thứ 2 - Theory Deep Dive: Backend mindset: framework là công cụ, backend là protocol + data + failure handling](thu-2.md) (Issue #1)
- [Thứ 3 - Theory Deep Dive: Internet fundamentals: DNS, TCP/IP, TLS, latency, timeout, request lifecycle](thu-3.md) (Issue #2)
- [Thứ 4 - Theory Deep Dive: HTTP/API fundamentals: method, status code, headers, body, cookie, cache, CORS, REST constraints](thu-4.md) (Issue #3)
- [Thứ 5 - Mini Lab: HTTP lab: dùng curl/Postman mô phỏng request lifecycle, headers, status code, timeout và CORS](thu-5.md) (Issue #4)
- [Thứ 6-7 - Mini Lab: API design lab: thiết kế API contract nhỏ, idempotency, pagination, filtering và error response](thu-6-7.md) (Issue #5)

## Artifact của tuần

- [HTTP lab evidence](../../labs/tuan-1/http-lab/README.md)
- [API design contract](../../labs/tuan-1/api-design/contract.md)

## Cách học mỗi ticket

1. Đọc objective và mental model trước, chưa vội dùng framework.
2. Tự hoàn thành các bảng/câu hỏi có nhãn **Phần của người học**.
3. Với worked example, giải thích lại bằng lời của mình và tìm ít nhất một counterexample.
4. Ở lab, luôn ghi hypothesis trước khi chạy lệnh; command/output một mình chưa phải evidence đầy đủ.
5. Chỉ đánh dấu hoàn thành khi đạt exit criteria, không chỉ vì đã đọc hết tài liệu.

> Không code hoặc scaffold trong Movie Ticket Booking ở tuần 1. Code harness local, nếu có, chỉ là thiết bị thí nghiệm độc lập để quan sát protocol.
