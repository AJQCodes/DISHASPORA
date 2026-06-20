-- ============================================================
-- 012 PAYMENTS
-- Detailed transaction records tied to orders.
-- Provides a full payment audit trail beyond the simple
-- payment_status field on the orders table.
-- ============================================================

CREATE TYPE payment_method AS ENUM (
    'mobile_money',
    'card',
    'bank_transfer'
);

CREATE TYPE payment_transaction_status AS ENUM (
    'pending',
    'successful',
    'failed',
    'refunded'
);

CREATE TABLE payments (
    id                  UUID                        PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID                        NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
    user_id             UUID                        NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    amount              NUMERIC(10,2)               NOT NULL CHECK (amount >= 0),
    payment_method      payment_method              NOT NULL,
    transaction_status  payment_transaction_status  NOT NULL DEFAULT 'pending',
    transaction_ref     VARCHAR(255)                UNIQUE,
    failure_reason      TEXT,
    paid_at             TIMESTAMPTZ,
    created_at          TIMESTAMPTZ                 NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ                 NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id           ON payments(order_id);
CREATE INDEX idx_payments_user_id            ON payments(user_id);
CREATE INDEX idx_payments_transaction_status ON payments(transaction_status);

COMMENT ON TABLE  payments                 IS 'Full payment audit trail for every order transaction.';
COMMENT ON COLUMN payments.transaction_ref IS 'Reference number from payment provider e.g. Mobile Money transaction ID.';
COMMENT ON COLUMN payments.failure_reason  IS 'Populated if transaction_status is failed. Helps with debugging and dispute resolution.';