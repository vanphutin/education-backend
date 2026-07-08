# Tuần 1 - Backend mindset, Internet, HTTP và API fundamentals

**Giai đoạn:** Core Theory + Mini Labs  
**Chế độ học:** Thứ 2-4 học chuyên sâu. Thứ 5-7 làm mini labs từ kiến thức Thứ 2-4. Chưa bắt đầu dự án thật.


## 1. Mục tiêu tuần

| Hạng mục | Nội dung |
|---|---|
| Goal | Hiểu backend là hệ thống giao tiếp qua mạng, không phải chỉ viết controller trong framework. |
| Focus | Backend mindset, client-server, DNS/TCP/TLS, HTTP, REST, status code, headers, cookies, cache, CORS, API contract. |
| Project rule | Không code, không scaffold, không implement Movie Ticket Booking trong tuần này. Chỉ học sâu và làm mini lab độc lập. |

## 2. Kế hoạch học tập theo ngày

| Ngày | Loại buổi | Trọng tâm |
|---|---|---|
| Thứ 2 | Theory Deep Dive | Backend mindset: framework là công cụ, backend là protocol + data + failure handling |
| Thứ 3 | Theory Deep Dive | Internet fundamentals: DNS, TCP/IP, TLS, latency, timeout, request lifecycle |
| Thứ 4 | Theory Deep Dive | HTTP/API fundamentals: method, status code, headers, body, cookie, cache, CORS, REST constraints |
| Thứ 5 | Mini Lab | HTTP lab: dùng curl/Postman mô phỏng request lifecycle, headers, status code, timeout và CORS |
| Thứ 6-7 | Mini Lab | API design lab: thiết kế API contract nhỏ, idempotency, pagination, filtering và error response |

## 3. Output bắt buộc

- Protocol notes
- HTTP/status-code decision table
- curl/Postman HTTP lab evidence
- API contract mini lab
- Interview answers

## 4. Interview drill


- Vì sao framework không phải là backend?
- Idempotency là gì và API nào cần idempotent?
- HTTP status code sai có thể gây hậu quả gì?


## Required Reading By Day

| Ngày | Cơ bản/Trung bình | Nâng cao |
|---|---|---|
| Mon | [MDN - Overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview) | [RFC 9110 - HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110) |
| Tue | [Cloudflare Learning - What is DNS?](https://www.cloudflare.com/learning/dns/what-is-dns/) | [High Performance Browser Networking - Building Blocks of TCP](https://hpbn.co/building-blocks-of-tcp/) |
| Wed | [MDN - HTTP Messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages) | [High Performance Browser Networking - Transport Layer Security (TLS)](https://hpbn.co/transport-layer-security-tls/) |
| Thu | [MDN - HTTP Request Methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods) | [MDN - Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) |
| Fri-Sat | [MDN - HTTP Response Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status) | [RFC 9110 Section 9.2.2 - Idempotent Methods](https://www.rfc-editor.org/rfc/rfc9110#section-9.2.2) |
