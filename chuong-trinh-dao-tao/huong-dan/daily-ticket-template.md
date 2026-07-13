# Daily Template - High-intensity Backend

## Core Theory Template (Tuần 1-3)

```md
# Core Study Ticket: <Chủ đề>

## 1. Learning Objectives
- Sau buổi học, tôi có thể <giải thích/so sánh/vẽ/chọn/kiểm chứng> ...

## 2. Problem Framing & Prior Knowledge
- Backend problem/context:
- Kiến thức ngày trước được dùng:
- Assumptions và câu hỏi chưa rõ:

## 3. Knowledge Map & Mental Models
| Concept/mô hình | Cơ chế bằng lời của tôi | Problem nó giải quyết | Trade-off/failure |
|---|---|---|---|
| ... | ... | ... | ... |

## 4. Worked Example & Counterexample
- Worked example:
- Counterexample/anti-example:
- Invariant hoặc contract rút ra:

## 5. Reasoning Artifact
- Chọn một: sequence/state/ERD/dependency diagram, timeline hoặc decision table.
- Happy path:
- Edge case:
- Failure case:

## 6. Common Mistakes & Debug Questions
- Misconception:
- Evidence nào phân biệt expected với actual?
- Boundary đầu tiên có thể sai ở đâu?

## 7. Lab / Design Exercise
- Goal:
- Hypothesis:
- Steps:
- Observation/evidence:
- Explanation:

## 8. External Practice
- Lab/resource:
- Task:
- Evidence:
- What I learned:

## 9. Future Project Note
- Sau tuần 4, kiến thức này có thể dùng ở đâu trong project thật?
- Nếu hiểu sai, bug production nào dễ xảy ra?
- Không code/scaffold Movie Ticket Booking trong tuần 1-3; chỉ code mini lab độc lập để kiểm chứng lý thuyết.

## 10. Exit Check & Interview Drill
- Năm câu tự kiểm tra bằng tình huống mới:
- Question:
- My answer:
```

## Project Delivery Template (Tuần 4-10)

```md
# Project Delivery Ticket: <Tên ticket theo business outcome>

## 1. Business Scenario
- Actor:
- User story:
- Why it matters:

## 2. System Analysis
- Service owner and explicit non-owner:
- Gateway/edge responsibility:
- Database/source-of-truth owner:
- Input:
- Output:
- State involved:
- Sync HTTP contract and timeout:
- Async event/job contract, producer/consumer and delivery semantics:
- Edge cases:
- Failure cases:
- Security/data consistency/performance risk:

## 3. Design Before Code
- API contract:
- API/event contract version and compatibility:
- DB impact (service-local only):
- Module/service boundary:
- Cross-service data need: query, snapshot or event? Why not shared DB?
- Validation/error behavior:
- Logging/audit/integration logs:
- Local transaction/outbox/inbox/idempotency concern:
- Permission/service-trust concern:

## 4. Implementation Checklist
- [ ] ...

## 5. Verification
- Unit test:
- E2E/manual curl:
- Contract test/consumer example:
- Duplicate event/webhook/retry/failure injection:
- Swagger/API docs:
- Migration/seed:
- Health/readiness/trace propagation:
- Build/lint:

## 6. Evidence
- Issue:
- PR/commit:
- Logs/screenshots:
- Docs/ADR:

## 7. External Practice
- Lab/resource:
- Task:
- Evidence:
- What I learned:

## 8. Interview Drill
- Question:
- My answer:
```
