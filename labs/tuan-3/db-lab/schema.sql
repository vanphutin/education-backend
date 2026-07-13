DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email text NOT NULL,
  balance numeric(14,2) NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT users_email_unique UNIQUE (email)
);

CREATE TABLE orders (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id bigint NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status text NOT NULL CHECK (status IN ('DRAFT', 'PENDING', 'PAID', 'CANCELLED')),
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
  order_id bigint NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  sku text NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(14,2) NOT NULL CHECK (unit_price >= 0),
  PRIMARY KEY (order_id, sku)
);

CREATE TABLE payments (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  order_id bigint NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  idempotency_key text NOT NULL,
  amount numeric(14,2) NOT NULL CHECK (amount > 0),
  status text NOT NULL CHECK (status IN ('SUCCEEDED', 'FAILED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payments_idempotency_unique UNIQUE (idempotency_key)
);

CREATE UNIQUE INDEX payments_one_success_per_order_idx ON payments(order_id) WHERE status = 'SUCCEEDED';
CREATE INDEX orders_user_created_idx ON orders(user_id, created_at DESC, id DESC);
CREATE INDEX orders_user_status_created_idx ON orders(user_id, status, created_at DESC, id DESC);
