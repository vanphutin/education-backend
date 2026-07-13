# Definition of Done V2 - High-intensity Backend Standard

## Week 1-3 Core Theory + Mini Lab Done

- [ ] Notes viết bằng lời của mình, không copy định nghĩa.
- [ ] Có problem framing: actor/outcome, input/output, assumption và constraint.
- [ ] Có ít nhất một mental model bằng sơ đồ, timeline, state table hoặc decision table.
- [ ] Có một worked example và một counterexample/anti-example.
- [ ] Chỉ ra invariant, happy path, edge case và failure case liên quan.
- [ ] Có lab nhỏ hoặc curl/Postman/code snippet chứng minh concept.
- [ ] Có hypothesis trước lab, observation sau lab và giải thích vì sao kết quả xảy ra.
- [ ] Có bảng lỗi phổ biến, misconception và cách kiểm chứng/tránh lỗi.
- [ ] Có mục "sau này áp dụng vào project ở đâu", nhưng chưa code/scaffold project thật.
- [ ] Có interview drill answer.
- [ ] Vượt qua exit check bằng tình huống mới, không chỉ nhắc lại định nghĩa.
- [ ] Thứ 5-7 có mini labs tương ứng với kiến thức đã học Thứ 2-4.

## Week 4-10 Project Delivery Done

- [ ] Có business scenario và system analysis.
- [ ] Có service owner, database/source-of-truth owner và non-owner rõ; không dùng shared DB/cross-service ORM relation như shortcut.
- [ ] Có design before code: HTTP/event contract, compatibility, module/service boundary, validation, logging, local transaction/outbox/inbox/security nếu liên quan.
- [ ] Có implementation đúng scope.
- [ ] Có verification: unit/e2e/curl/contract/duplicate-event-or-retry/Swagger/log/build/migration/health nếu liên quan.
- [ ] Có evidence trong study note/PR.
- [ ] Có tradeoff explanation.
- [ ] Có executable precursor lab cho failure/primitive mới trước khi tích hợp vào project.
- [ ] Test matrix ghi rõ boundary thật của unit, integration, contract, e2e, concurrency và failure smoke test; không dùng fake để claim database/network behavior.
- [ ] Outbound call có deadline/cancellation policy; retry chỉ được thêm khi operation an toàn và có bounded backoff.
- [ ] Clean checkout chạy được bằng documented command; CI chạy typecheck, lint, test và build.
- [ ] Public error/log không rò secret, token, stack trace, internal URL hoặc raw provider payload.
- [ ] Artifact tuyển dụng có README, architecture/ERD/state diagram, OpenAPI, reproducible evidence và 3–5 phút explanation.
