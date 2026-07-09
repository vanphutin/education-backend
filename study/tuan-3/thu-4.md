# Theory Deep Dive: Security and production primitives: auth/authz, password hashing, token, cache, queue, logging, monitoring, deployment

- **Tuần**: 3
- **Ngày**: Thứ 4
- **Issue**: [#13](https://github.com/vanphutin/education-backend/issues/13)
- **Giai đoạn**: Deep Foundation + Mini Labs

## Required Reading

- **Cơ bản/Trung bình:** [OWASP - Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- **Nâng cao:** [OWASP - Password Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- **Thực hành (Lab):** [The Odin Project - NodeJS Authentication Lab](https://www.theodinproject.com/lessons/nodejs-authentication)

## 1. Learning Objectives

- Hiểu sâu: Security and production primitives: auth/authz, password hashing, token, cache, queue, logging, monitoring, deployment.
- Giải thích được concept này giải quyết vấn đề backend nào.
- Chuẩn bị kiến thức để Thứ 5-7 làm mini lab.

## 2. Core Concepts

ConceptGiải thích bằng lời của tôiBackend problem nó giải quyếtauth/authz(Viết tóm tắt tại đây)Giải quyết vấn đề liên quan đến auth/authzpassword hashing(Viết tóm tắt tại đây)Giải quyết vấn đề liên quan đến password hashingtoken(Viết tóm tắt tại đây)Giải quyết vấn đề liên quan đến tokencache(Viết tóm tắt tại đây)Giải quyết vấn đề liên quan đến cachequeue(Viết tóm tắt tại đây)Giải quyết vấn đề liên quan đến queuelogging(Viết tóm tắt tại đây)Giải quyết vấn đề liên quan đến loggingmonitoring(Viết tóm tắt tại đây)Giải quyết vấn đề liên quan đến monitoringdeployment(Viết tóm tắt tại đây)Giải quyết vấn đề liên quan đến deployment

## 3. Common Mistakes

- Hiểu sai hoặc lạm dụng auth/authz
- Thiếu error handling cho auth/authz
- Hiểu sai hoặc lạm dụng password hashing
- Thiếu error handling cho password hashing
- Hiểu sai hoặc lạm dụng token
- Thiếu error handling cho token
- Hiểu sai hoặc lạm dụng cache
- Thiếu error handling cho cache
- Hiểu sai hoặc lạm dụng queue
- Thiếu error handling cho queue
- Hiểu sai hoặc lạm dụng logging
- Thiếu error handling cho logging
- Hiểu sai hoặc lạm dụng monitoring
- Thiếu error handling cho monitoring
- Hiểu sai hoặc lạm dụng deployment
- Thiếu error handling cho deployment

## 4. Notes

- Tìm hiểu thêm best practices về auth/authz
- Tìm hiểu thêm best practices về password hashing
- Tìm hiểu thêm best practices về token
- Tìm hiểu thêm best practices về cache
- Tìm hiểu thêm best practices về queue
- Tìm hiểu thêm best practices về logging
- Tìm hiểu thêm best practices về monitoring
- Tìm hiểu thêm best practices về deployment

## 5. Mini Lab Preparation

- Thứ 5-7 sẽ kiểm chứng concept này bằng lab nào?
- Input/output mong đợi là gì?

## 6. Interview Drill

- Question: Cache/queue/logging giải quyết vấn đề gì?
- My answer:
  - ...