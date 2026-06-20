-- ============================================================
-- 001 COUNTRIES
-- Lookup table for country-based filtering and transaction
-- restrictions. Referenced by almost every other table.
-- ============================================================

CREATE TABLE countries (
    id          SMALLSERIAL     PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL UNIQUE,
    iso_code    CHAR(2)         NOT NULL UNIQUE,
    is_active   BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  countries            IS 'Lookup table for all countries. is_active controls which countries the platform operates in.';
COMMENT ON COLUMN countries.iso_code   IS '2-letter ISO 3166-1 alpha-2 code e.g. GH, NG, IT';
COMMENT ON COLUMN countries.is_active  IS 'Only active countries appear in dropdowns and allow transactions';