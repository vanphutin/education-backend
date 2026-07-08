# Thiết kế AI & Semantic Search (pgvector)

Tài liệu này đặc tả thiết kế kỹ thuật của chức năng Tìm kiếm ngữ nghĩa (Semantic Search) sử dụng công nghệ Vector Embeddings kết hợp PostgreSQL và tiện ích mở rộng `pgvector`.

---

## 1. Mục tiêu kiến trúc

Semantic search giúp khách hàng tìm phim bằng ý định/ngôn ngữ tự nhiên thay vì chỉ tìm khớp từ khóa (keyword search) truyền thống.

*Ví dụ truy vấn:*
*   *"phim nhẹ nhàng để đi date tối nay"*
*   *"phim hành động giống John Wick nhưng ít bạo lực hơn"*
*   *"phim cho gia đình có trẻ em cuối tuần"*

---

## 2. Quy trình xử lý (Search Flow)

### Luồng 1: Tạo và đồng bộ Vector Embeddings
```text
Admin tạo/cập nhật movie
-> tạo movie_embedding_documents status PENDING
-> enqueue job generate-movie-embedding vào BullMQ
-> job gọi embedding provider (OpenAI / Mock)
-> nhận vector -> lưu vector + cập nhật status READY
-> semantic search chỉ sử dụng các document READY
```

### Luồng 2: Tìm kiếm ngữ nghĩa
```text
POST /ai/movie-search
-> validate request
-> optional: AI parse message/intent thành filters (City, Date, Genre,...)
-> tạo query embedding cho message đầu vào
-> query PostgreSQL sử dụng pgvector similarity operator (<-> hoặc <=>)
-> apply các bộ lọc SQL truyền thống: date, city, genre, age rating, available seats
-> rank lại kết quả và chấm điểm tương đồng
-> trả danh sách movies/showtimes kèm lý do đề xuất (reason)
-> log request vào ai_request_logs để giám sát
```

---

## 3. Cấu trúc thư mục Module AI

```text
ai/
  ai.module.ts
  providers/
    ai-provider.interface.ts
    mock-ai.provider.ts
    openai-ai.provider.ts hoặc real-ai.provider.ts
  embeddings/
    embedding-provider.interface.ts
    mock-embedding.provider.ts
    real-embedding.provider.ts
    movie-embedding.service.ts
  search/
    ai-movie-search.service.ts
    semantic-search.repository.ts
  admin-content/
    movie-ai-content.service.ts
```

> [!TIP]
> Trong môi trường Test/CI, luôn kích hoạt `MockAiProvider` và `MockEmbeddingProvider`.
> Trong Demo/Production, cấu hình nhà cung cấp thật qua biến môi trường (Environment Variables):
> ```text
> AI_PROVIDER=mock|openai|other
> EMBEDDING_PROVIDER=mock|openai|other
> ```

---

## 4. Đặc tả Bảng Lưu trữ Embeddings

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE movie_embedding_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
  document_type VARCHAR(50), -- MOVIE_PROFILE | TRAILER_METADATA | REVIEW_SUMMARY
  content TEXT NOT NULL,
  content_hash VARCHAR(64) NOT NULL, -- Tránh tạo lại embedding khi nội dung không đổi
  embedding vector(1536), -- 1536 dimensions cho text-embedding-3-small hoặc ada-002
  embedding_provider VARCHAR(50) NOT NULL, -- openai, mock, ...
  embedding_model VARCHAR(100) NOT NULL,
  embedding_dimensions INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING | READY | FAILED
  error_message TEXT,
  embedded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Lưu ý khi triển khai:
*   Chọn một embedding dimension cố định ngay từ đầu và cấu hình trong config.
*   TypeORM có thể sử dụng migration bằng raw SQL để khai báo kiểu dữ liệu `vector(...)`.
*   Khi truy vấn vector, có thể sử dụng `DataSource.query()` để đạt hiệu năng tối đa và tránh ép TypeORM thực thi các cú pháp phức tạp không được hỗ trợ tốt.
*   Dữ liệu nhỏ có thể dùng Exact Search. Khi tập dữ liệu lớn, cần tạo chỉ mục HNSW (Hierarchical Navigable Small World) để tăng tốc độ tìm kiếm.

---

## 5. Dữ liệu chuẩn bị để tạo Embeddings (Document Template)

Để vector học tốt thông tin phim, chúng ta chuẩn hóa thông tin phim thành một văn bản text thô trước khi gửi qua API Embedding:

```text
Title: [Tiêu đề phim]
Original title: [Tên gốc]
Genres: [Thể loại phim]
Mood tags: [Mood phù hợp]
Age rating: [Giới hạn độ tuổi]
Cast: [Diễn viên chính]
Director: [Đạo diễn]
Synopsis: [Tóm tắt nội dung]
Trailer description: [Mô tả trailer]
Language: [Ngôn ngữ]
```

> [!CAUTION]
> Tuyệt đối không gửi thông tin nhạy cảm của khách hàng, mật khẩu, JWT token hoặc thông tin giao dịch thanh toán sang các AI/Embedding provider bên thứ ba.
