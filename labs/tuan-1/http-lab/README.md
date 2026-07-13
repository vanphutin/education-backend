# HTTP/CORS Lab — Evidence của học viên

Artifact cho [`study/tuan-1/thu-5.md`](../../../study/tuan-1/thu-5.md). Harness dùng hai origin local để kết quả không phụ thuộc Internet hoặc chính sách của API công cộng.

## Chạy lab

Yêu cầu Node.js 20+. Harness được viết bằng TypeScript strict mode.

```powershell
cd labs/tuan-1/http-lab
npm install
npm run dev
```

- Trang lab: `http://127.0.0.1:3000`
- API lab: `http://127.0.0.1:4000`
- Dừng server bằng `Ctrl+C`.

Mở terminal khác và kiểm tra:

```powershell
curl.exe -i http://127.0.0.1:4000/health
```

Không dùng credential thật. Xóa `cookies.txt` và các output tạm sau khi hoàn thành.

## Môi trường

| Mục | Giá trị của tôi |
|---|---|
| Ngày chạy | TBD |
| Node version | TBD |
| OS/shell | TBD |
| Page origin | `http://127.0.0.1:3000` |
| API origin | `http://127.0.0.1:4000` |

## Evidence template

Điền một bảng cho từng experiment trong daily ticket. Giữ nguyên hypothesis đã viết trước khi chạy.

| Experiment/case | Question | Hypothesis trước khi chạy | Command/action | Raw observation | Explanation theo layer/semantics | Evidence chưa chứng minh điều gì? |
|---|---|---|---|---|---|---|
| 1 — anatomy/echo | TBD | TBD | TBD | TBD | TBD | TBD |
| 2A — HTTP 404 | TBD | TBD | TBD | TBD | TBD | TBD |
| 2B — HTTP 503 | TBD | TBD | TBD | TBD | TBD | TBD |
| 2C — no listener | TBD | TBD | TBD | TBD | TBD | TBD |
| 3 — delay/timeout | TBD | TBD | TBD | TBD | TBD | TBD |
| 4 — ETag/304 | TBD | TBD | TBD | TBD | TBD | TBD |
| 5 — cookie jar | TBD | TBD | TBD | TBD | TBD | TBD |
| 6A — simple allow | TBD | TBD | TBD | TBD | TBD | TBD |
| 6B — simple deny | TBD | TBD | TBD | TBD | TBD | TBD |
| 6C — HTTP 403 + CORS | TBD | TBD | TBD | TBD | TBD | TBD |
| 6D — preflight allow | TBD | TBD | TBD | TBD | TBD | TBD |
| 6E — preflight deny | TBD | TBD | TBD | TBD | TBD | TBD |

## Request/timing notes

```text
TBD — dán output text đã bỏ dữ liệu nhạy cảm
```

## CORS decision table

| Case | OPTIONS tới server? | Actual request tới server? | JavaScript đọc response? | HTTP outcome | CORS outcome | Evidence dùng để kết luận |
|---|---:|---:|---:|---|---|---|
| simple allow | TBD | TBD | TBD | TBD | TBD | TBD |
| simple deny | TBD | TBD | TBD | TBD | TBD | TBD |
| HTTP 403 + allow | TBD | TBD | TBD | TBD | TBD | TBD |
| preflight allow | TBD | TBD | TBD | TBD | TBD | TBD |
| preflight deny | TBD | TBD | TBD | TBD | TBD | TBD |

## Reflection

1. HTTP error, network failure, timeout và CORS error khác nhau ở evidence nào?
2. Client timeout có chứng minh server chưa đổi state không?
3. Vì sao `fetch()` có thể resolve với `403` nhưng reject khi CORS chặn?
4. `304` không có response body nhưng browser/client vẫn có thể hiển thị representation từ đâu?
5. Nếu production request chứa secret, evidence/log cần redact ở bước nào?

### Câu trả lời của tôi

TBD

## Exit checklist

- [ ] Health baseline chạy trước các experiment.
- [ ] Mọi case có hypothesis, raw observation và explanation.
- [ ] Có status/exit code/server log khi phân biệt HTTP với network failure.
- [ ] Có timing và cancellation/unknown-outcome reflection.
- [ ] Có ETag/conditional request evidence.
- [ ] Có đủ năm CORS cases bằng Console + Network + server log.
- [ ] Không có password, token, cookie value hoặc authorization value thật trong artifact.
- [ ] File cookie/output tạm đã được xóa.
