# Education Tracker Internal App

App này dùng `tien-do-hoc-tap/progress.json` làm JSON DB và chạy bằng Node.js thuần:

```bash
node server.js
```

Dashboard mặc định: `http://localhost:3900`

## Training Timer

Khóa đào tạo bắt đầu từ `2026-07-13` theo timezone `Asia/Saigon`.

Thông tin này nằm trong `tien-do-hoc-tap/progress.json` tại:

```json
{
  "program": {
    "training_start_date": "2026-07-13",
    "timezone": "Asia/Saigon",
    "duration_weeks": 8
  }
}
```

Dashboard dùng mốc này để:

- Đếm ngược trước ngày bắt đầu.
- Tự chọn tuần hiện tại khi mở app.
- Hiển thị ngày hiện tại trong lộ trình 8 tuần.

## JSON DB Safety

Server không ghi thẳng payload vào file một cách mù quáng nữa. Mỗi lần lưu sẽ có:

- `_meta.version` để chống ghi đè khi nhiều nguồn cùng cập nhật.
- `_meta.updated_at` và `_meta.updated_by` để biết lần cập nhật cuối.
- `audit_log` để lưu lịch sử thay đổi.
- Backup tự động trong thư mục `tien-do-hoc-tap/.progress-backups`.
- Ghi atomic: ghi file tạm trước, sau đó rename sang `progress.json`.

## API Chính

### Lấy DB

```http
GET /api/progress
```

Trả về toàn bộ JSON DB kèm `_meta.version`.

### Lưu từ web UI

```http
POST /api/progress
Content-Type: application/json
X-Actor: web-ui
```

Body là toàn bộ DB hiện tại. Server sẽ kiểm tra `_meta.version`; nếu version đã cũ, server trả `409`.

### AI Mentor cập nhật bằng patch

AI mentor nên gửi patch có kiểm soát, không ghi đè toàn bộ file:

```http
POST /api/mentor/apply
Content-Type: application/json
X-Actor: mentor-ai
```

```json
{
  "baseVersion": 3,
  "reason": "Review tuần 1 sau khi học viên gửi PR",
  "operations": [
    {
      "op": "replace",
      "path": "/weeks/0/mentor_feedback",
      "value": "Bạn làm tốt phần REST API. Cần bổ sung test cho error case."
    },
    {
      "op": "replace",
      "path": "/weeks/0/score",
      "value": 8
    }
  ]
}
```

Patch hỗ trợ `add`, `replace`, `remove`. Server không cho patch trực tiếp vào `/_meta` hoặc `/audit_log`.

### Audit và backup

```http
GET /api/audit
GET /api/backups
GET /api/health
```

## Quy Ước Cho AI Mentor

AI mentor chỉ nên cập nhật các vùng dữ liệu nghiệp vụ như:

- `/weeks/{index}/mentor_feedback`
- `/weeks/{index}/score`
- `/weeks/{index}/deliverables/{index}/status`
- `/daily_checkins/-`
- `/mock_interviews/-`

Không nên tự sửa `_meta`, `audit_log`, hoặc cấu trúc gốc của DB nếu không có migration rõ ràng.
