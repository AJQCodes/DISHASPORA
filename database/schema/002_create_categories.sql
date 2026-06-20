-- ============================================================
-- 002 CATEGORIES
-- Lookup table for recipe categories shown on the home screen.
-- Admin-manageable so new categories can be added without
-- code changes.
-- ============================================================

CREATE TABLE categories (
    id          SMALLSERIAL     PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL UNIQUE,
    slug        VARCHAR(100)    NOT NULL UNIQUE,
    description TEXT,
    icon_url    TEXT,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  categories       IS 'Recipe categories: Local Dishes, Continental, Foreign Dishes, Drinks. Admin-managed.';
COMMENT ON COLUMN categories.slug  IS 'URL-safe identifier e.g. local-dishes, foreign-dishes';