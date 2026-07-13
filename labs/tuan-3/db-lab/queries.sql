EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, amount, created_at FROM orders
WHERE user_id = 1
ORDER BY created_at DESC, id DESC
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, status, amount, created_at FROM orders
WHERE user_id = 1 AND status = 'PENDING'
ORDER BY created_at DESC, id DESC
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS)
SELECT o.id, o.amount, u.email FROM orders o
JOIN users u ON u.id = o.user_id
WHERE o.status = 'PENDING';
