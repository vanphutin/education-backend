import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import pg from 'pg';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is required; use a disposable local PostgreSQL database');
const here = path.dirname(fileURLToPath(import.meta.url));
const pool = new pg.Pool({ connectionString: databaseUrl, max: 6 });

async function expectConstraint(sql: string, params: unknown[], expectedCode: string): Promise<void> {
  try {
    await pool.query(sql, params);
    assert.fail(`Expected SQLSTATE ${expectedCode}`);
  } catch (error) {
    assert.equal((error as { code?: string }).code, expectedCode);
  }
}

async function main(): Promise<void> {
  await pool.query(await readFile(path.join(here, '..', 'schema.sql'), 'utf8'));
  const user = await pool.query<{ id: string }>(
    `INSERT INTO users(email, balance) VALUES ($1, 1000) RETURNING id`, ['learner@example.test'],
  );
  const userId = user.rows[0]?.id;
  assert.ok(userId);
  const order = await pool.query<{ id: string }>(
    `INSERT INTO orders(user_id, status, amount) VALUES ($1, 'PENDING', 300) RETURNING id`, [userId],
  );
  const orderId = order.rows[0]?.id;
  assert.ok(orderId);

  await expectConstraint(`INSERT INTO users(email, balance) VALUES ($1, 0)`, ['learner@example.test'], '23505');
  await expectConstraint(`INSERT INTO users(email, balance) VALUES ('negative@example.test', -1)`, [], '23514');
  await expectConstraint(`INSERT INTO orders(user_id, status, amount) VALUES (999999, 'PENDING', 1)`, [], '23503');

  await pool.query(`INSERT INTO payments(order_id, idempotency_key, amount, status) VALUES ($1, 'payment-1', 300, 'SUCCEEDED')`, [orderId]);
  const transaction = await pool.connect();
  try {
    await transaction.query('BEGIN');
    await transaction.query('UPDATE users SET balance = balance - 100 WHERE id = $1', [userId]);
    await assert.rejects(
      transaction.query(`INSERT INTO payments(order_id, idempotency_key, amount, status) VALUES ($1, 'payment-1', 300, 'SUCCEEDED')`, [orderId]),
      (error: unknown) => (error as { code?: string }).code === '23505',
    );
    await transaction.query('ROLLBACK');
  } finally {
    transaction.release();
  }
  const balance = await pool.query<{ balance: string }>('SELECT balance FROM users WHERE id = $1', [userId]);
  assert.equal(balance.rows[0]?.balance, '1000.00');

  const firstWrite = await pool.query(
    `UPDATE orders SET status = 'PAID', version = version + 1 WHERE id = $1 AND version = 0`, [orderId],
  );
  const staleWrite = await pool.query(
    `UPDATE orders SET status = 'CANCELLED', version = version + 1 WHERE id = $1 AND version = 0`, [orderId],
  );
  assert.equal(firstWrite.rowCount, 1);
  assert.equal(staleWrite.rowCount, 0);

  const a = await pool.connect();
  const b = await pool.connect();
  try {
    await a.query('BEGIN');
    await a.query('SELECT id FROM users WHERE id = $1 FOR UPDATE', [userId]);
    await b.query('BEGIN');
    await b.query(`SET LOCAL lock_timeout = '200ms'`);
    await assert.rejects(
      b.query('UPDATE users SET balance = balance + 1 WHERE id = $1', [userId]),
      (error: unknown) => (error as { code?: string }).code === '55P03',
    );
    await b.query('ROLLBACK');
    await a.query('ROLLBACK');
  } finally {
    a.release(); b.release();
  }

  console.log(JSON.stringify({
    event: 'db_lab.baseline_passed',
    constraintCases: 3,
    rollbackVerified: true,
    optimisticConflictVerified: true,
    lockTimeoutVerified: true,
  }));
}

main().finally(() => pool.end());
