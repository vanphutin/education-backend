# Mini Lab Ticket: HTTP lab: dùng curl/Postman mô phỏng request lifecycle, headers, status code, timeout và CORS

- **Tuần**: 1
- **Ngày**: Thứ 5
- **Issue**: [#4](https://github.com/vanphutin/education-backend/issues/4)
- **Giai đoạn**: Core Theory + Guided Mini Labs
- **Thời lượng gợi ý**: 4-5 giờ
- **Artifact phải hoàn thành:** [`labs/tuan-1/http-lab/README.md`](../../labs/tuan-1/http-lab/README.md)

## Required Reading

- [curl - Everything curl: verbose](https://everything.curl.dev/usingcurl/verbose/)
- [MDN - HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [MDN - Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- Ôn lại [Thứ 3 - request lifecycle](thu-3.md) và [Thứ 4 - HTTP semantics](thu-4.md).

## 1. Learning Objectives đo được

Sau lab, người học có thể:

1. Dùng `curl -v`, `-i` và timing để chỉ ra request line, request headers, response status, response headers, body và các phase timing.
2. Phân biệt HTTP `4xx/5xx`, connection failure, client timeout và CORS error bằng **ít nhất hai evidence** cho mỗi loại.
3. Chứng minh CORS là browser policy bằng hai origin local được kiểm soát; phân biệt simple request, successful preflight và failed preflight.
4. Chứng minh `ETag` + `If-None-Match` tạo `304` và giải thích body được lấy từ cache nào.
5. Ghi đủ chuỗi **hypothesis → command/action → observation → explanation** cho mọi thí nghiệm; không sửa hypothesis sau khi đã xem kết quả.

## 2. Lab Rule: evidence, không đoán

Mỗi thí nghiệm phải đi theo vòng lặp:

```text
Question → Hypothesis (trước khi chạy)
         → Controlled action
         → Raw observation
         → Explanation theo layer/semantics
         → New question nếu evidence chưa đủ
```

Phân biệt bốn cột:

| Thành phần | Ví dụ đúng | Không chấp nhận |
|---|---|---|
| Hypothesis | "Port 4999 không có listener nên TCP connect sẽ fail trước HTTP; sẽ không có status code." | "Chắc là lỗi mạng." |
| Action | command đầy đủ, URL, header, timeout | chỉ ghi "dùng curl" |
| Observation | exit code, status/header, timing, browser Network/Console, server log | diễn giải thay cho raw evidence |
| Explanation | mapping evidence → DNS/TCP/TLS/HTTP/browser layer | chép lại output không có lý do |

Không dùng production API, credential hoặc token thật. Lab local giúp kết quả lặp lại được và không phụ thuộc `httpbin`, GitHub, proxy công ty hay Internet.

## 3. Setup môi trường local có kiểm soát

Yêu cầu: Node.js 20+; harness dùng Node built-in APIs và TypeScript strict mode. `tsx` chỉ chạy source TypeScript, không thay thế việc hiểu HTTP.

```powershell
cd labs/tuan-1/http-lab
npm install
npm run typecheck
npm run dev
```

Giữ terminal này để xem server log. Mở terminal thứ hai cho `curl.exe`. Hai origin:

- Lab page: `http://127.0.0.1:3000`
- API: `http://127.0.0.1:4000`

Kiểm tra baseline:

```powershell
curl.exe -i http://127.0.0.1:4000/health
```

Kết quả kỳ vọng là HTTP `200`. Nếu baseline không chạy, dừng và sửa setup trước; không dùng kết quả lỗi setup cho các thí nghiệm sau.

## 4. Experiment 1 — Anatomy và request boundary

### Câu hỏi

Custom header đi qua HTTP boundary ra sao? `-v` và `-i` cho evidence khác nhau thế nào?

### Trước khi chạy — Phần của người học

- **Hypothesis:**
- **Expected status/header/body:**

### Action

```powershell
curl.exe -v -i http://127.0.0.1:4000/echo `
  -H "X-Lab-Name: YOUR_NAME" `
  -H "Accept: application/json"
```

`-v` hiển thị protocol conversation/debug detail (thường ở stderr); `-i` đưa response headers vào output. Dòng bắt đầu bằng `>` là dữ liệu gửi đi, `<` là dữ liệu nhận về trong verbose output.

### Sau khi chạy — Phần của người học

- **Raw observation:**
- **Request line + 2 request headers:**
- **Response status + 2 response headers:**
- **Server quan sát header nào:**
- **Explanation:**

Không gửi header `Authorization` thật. Nếu muốn quan sát, chỉ dùng giá trị giả `Bearer LAB_ONLY_NOT_A_SECRET` và không commit screenshot chứa secret.

## 5. Experiment 2 — HTTP error khác network failure

Chạy ba case; ghi cả HTTP status (nếu có) và process exit code `$LASTEXITCODE`.

### Case A: HTTP 404

```powershell
curl.exe -i http://127.0.0.1:4000/status/404
$LASTEXITCODE
```

### Case B: HTTP 503 với `--fail-with-body`

```powershell
curl.exe --fail-with-body -i http://127.0.0.1:4000/status/503
$LASTEXITCODE
```

### Case C: TCP connection failure ở port không có listener

```powershell
curl.exe -v --connect-timeout 2 http://127.0.0.1:4999/
$LASTEXITCODE
```

### Evidence table — Phần của người học

| Case | Hypothesis trước khi chạy | Có HTTP status/body? | Exit code | Server API có log request? | Layer kết luận + explanation |
|---|---|---|---:|---|---|
| A: 404 | | | | | |
| B: 503 | | | | | |
| C: no listener | | | | | |

Câu hỏi bắt buộc: vì sao curl mặc định có thể exit `0` khi server trả `404`, và `--fail-with-body` thay đổi **CLI behavior** chứ không thay đổi HTTP response như thế nào?

## 6. Experiment 3 — Latency, timeout và cancellation

### Baseline timing

```powershell
curl.exe -sS -o NUL `
  -w "lookup=%{time_namelookup}s connect=%{time_connect}s ttfb=%{time_starttransfer}s total=%{time_total}s`n" `
  "http://127.0.0.1:4000/delay?ms=200"
```

### Client timeout trước server delay

```powershell
curl.exe -v --max-time 1 "http://127.0.0.1:4000/delay?ms=2000"
$LASTEXITCODE
```

Quan sát cả client output và server log `response-closed-before-finish`. Harness truyền tín hiệu close để hủy timer, minh họa cooperative cancellation trong phạm vi lab.

### Evidence — Phần của người học

- **Hypothesis trước baseline:**
- **Hypothesis trước timeout:**
- **Timing quan sát được:**
- **Có HTTP status trong case timeout không:**
- **Server thấy điều gì sau khi client dừng:**
- **Explanation: `--max-time` bảo vệ tài nguyên nào:**
- **Counterfactual: nếu DB đã commit trước timeout thì cancellation có undo commit không:**

## 7. Experiment 4 — Cache validator

### Lấy representation và validator

```powershell
curl.exe -i http://127.0.0.1:4000/cache/book
```

Ghi lại `ETag`, rồi revalidate:

```powershell
curl.exe -i http://127.0.0.1:4000/cache/book `
  -H 'If-None-Match: \"book-v1\"'
```

Trong Windows PowerShell cũ, `curl.exe` cần `\"` để ký tự dấu ngoặc kép thật sự đi vào entity tag. Kiểm tra bằng `-v`: request header phải là `If-None-Match: "book-v1"`, không phải `book-v1` không có ngoặc kép.

### Evidence — Phần của người học

- **Hypothesis trước request 1:**
- **Hypothesis trước request 2:**
- **Status/body/ETag request 1:**
- **Status/body request 2:**
- **Explanation: `304` tiết kiệm gì và body hiển thị cuối cùng đến từ đâu:**
- **Counterexample: dùng `If-Match` cho GET revalidation có đúng mục đích không:**

## 8. Experiment 5 — Cookie metadata bằng curl

```powershell
curl.exe -i -c cookies.txt http://127.0.0.1:4000/cookie/set
curl.exe -i -b cookies.txt http://127.0.0.1:4000/cookie/show
```

Chỉ file cookie lab giả được tạo; xóa sau khi kết thúc. Đọc `Set-Cookie`, nhận diện `HttpOnly`, `SameSite`, `Path` và giải thích vì sao curl cần `-b`/cookie jar còn browser có thể tự gửi theo policy.

### Evidence — Phần của người học

- **Hypothesis:**
- **Set-Cookie quan sát được:**
- **Cookie request thứ hai server nhận:**
- **Explanation:**

## 9. Experiment 6 — CORS trên hai origin local

Mở `http://127.0.0.1:3000`, sau đó mở DevTools → **Console** và **Network**. Chạy từng command riêng.

### A. Simple GET được phép đọc

```js
fetch('http://127.0.0.1:4000/cors/simple-allow')
  .then(async r => ({ status: r.status, ok: r.ok, body: await r.json() }))
  .then(console.log).catch(console.error)
```

### B. Simple GET server xử lý nhưng browser không cho script đọc

```js
fetch('http://127.0.0.1:4000/cors/simple-deny')
  .then(async r => ({ status: r.status, body: await r.text() }))
  .then(console.log).catch(console.error)
```

Đối chiếu Console, Network và server log. Browser error không đủ để kết luận server chưa nhận request.

### C. HTTP 403 có CORS header hợp lệ

```js
fetch('http://127.0.0.1:4000/cors/http-403')
  .then(async r => ({ status: r.status, ok: r.ok, body: await r.json() }))
  .then(console.log).catch(console.error)
```

`fetch()` không reject chỉ vì HTTP `403`; hãy kiểm `response.ok/status`.

### D. Preflight thành công rồi mới gửi actual PUT

```js
fetch('http://127.0.0.1:4000/cors/preflight-allow', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json', 'X-Lab-Name': 'YOUR_NAME' },
  body: JSON.stringify({ price: 120000 })
}).then(async r => ({ status: r.status, body: await r.json() }))
  .then(console.log).catch(console.error)
```

### E. Preflight bị từ chối; actual request không được gửi

```js
fetch('http://127.0.0.1:4000/cors/preflight-deny', {
  method: 'PUT',
  headers: { 'X-Lab-Name': 'YOUR_NAME' },
  body: 'test'
}).then(r => r.text()).then(console.log).catch(console.error)
```

### CORS decision table — Phần của người học

| Case | Hypothesis trước khi chạy | OPTIONS thấy ở Network/server? | Actual request tới server? | JS đọc response? | HTTP hay CORS outcome? Giải thích |
|---|---|---|---|---|---|
| A: simple allow | | | | | |
| B: simple deny | | | | | |
| C: HTTP 403 + CORS allow | | | | | |
| D: preflight allow | | | | | |
| E: preflight deny | | | | | |

## 10. Common Mistakes & Debug Questions

| Sai lầm | Cách phát hiện/sửa |
|---|---|
| Chỉ chụp terminal, không có hypothesis/explanation | ghi hypothesis trước; sau đó map raw evidence tới layer |
| Thấy curl exit 0 và kết luận business success | đọc status/body; hiểu curl exit code mặc định |
| Thấy timeout và kết luận server rollback | kiểm server/DB bằng operation id; outcome có thể unknown |
| Dùng public API nên kết quả đổi theo mạng/rate limit | chạy harness local và lưu port/origin rõ ràng |
| Gọi CORS là network failure | so sánh server log, browser Network và curl |
| Chỉ xem Console khi debug CORS | xem preflight, actual request và response headers trong Network |
| Cho rằng `fetch` reject với 4xx/5xx | kiểm `response.ok`/`status`; reject thường do network/CORS/abort |
| Copy secret thật vào header/screenshot | chỉ dùng dữ liệu giả và kiểm evidence trước commit |
| Dùng `Invoke-WebRequest` nhưng ghi là curl | trên PowerShell gọi rõ `curl.exe` để option có nghĩa như tài liệu |

## 11. Deliverables & Exit Criteria

Hoàn thành artifact ở [`labs/tuan-1/http-lab/README.md`](../../labs/tuan-1/http-lab/README.md).

- [ ] Harness chạy local và baseline health trả 200.
- [ ] Có evidence anatomy request/response và custom header.
- [ ] Phân biệt HTTP 404/503 với connection failure bằng status, exit code và server log.
- [ ] Có timing, client timeout và server cancellation observation.
- [ ] Conditional GET trả 304 với đúng validator.
- [ ] Cookie jar evidence không chứa secret thật.
- [ ] Cả 5 CORS cases có hypothesis, Network/server evidence và explanation.
- [ ] Mỗi experiment có ít nhất một counterexample hoặc điều evidence chưa chứng minh.
- [ ] Không commit file `cookies.txt`, token, credential hoặc dữ liệu nhạy cảm.

## 12. Self-check & Interview Drill — Phần của người học

1. `curl` nhận `503` khác connect timeout ở những evidence nào?
2. Browser Console báo CORS có chứng minh actual request không tới server không?
3. Vì sao `fetch()` resolve với `403` nhưng có thể reject với CORS?
4. `304` có phải response body rỗng do resource rỗng không?
5. Client abort có tự động rollback side effect phía server không?

- **Question:** Hãy phân biệt network failure, HTTP error, timeout và CORS error bằng quy trình quan sát cụ thể.
- **My answer:**
