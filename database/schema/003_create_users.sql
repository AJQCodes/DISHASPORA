-- ============================================================
-- 003 USERS
-- Core identity and credentials table. Handles both regular
-- users, vendors, and admins via the role column.
-- ============================================================

CREATE TYPE user_role AS ENUM ('user', 'vendor', 'admin');

CREATE TABLE users (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    email               VARCHAR(255)    NOT NULL UNIQUE,
    password_hash       TEXT            NOT NULL,
    role                user_role       NOT NULL DEFAULT 'user',
    full_name           VARCHAR(255)    NOT NULL,
    profile_picture_url TEXT,
    phone_number        VARCHAR(20),
    country_id          SMALLINT        REFERENCES countries(id) ON DELETE SET NULL,
    is_verified         BOOLEAN         NOT NULL DEFAULT FALSE,
    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    last_login_at       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email      ON users(email);
CREATE INDEX idx_users_country_id ON users(country_id);
CREATE INDEX idx_users_role       ON users(role);

COMMENT ON TABLE  users                IS 'Core user table. Vendors and admins are also stored here, differentiated by role.';
COMMENT ON COLUMN users.password_hash  IS 'Bcrypt hashed password. Never store plain text.';
COMMENT ON COLUMN users.country_id     IS 'Drives country-based content filtering and transaction restrictions.';