-- ============================================================
-- 013 CUISINE TYPES
-- More granular recipe filtering beyond the 4 main categories.
-- Normalizes cultural origin into a proper lookup table.
-- ============================================================

CREATE TABLE cuisine_types (
    id          SMALLSERIAL     PRIMARY KEY,
    name        VARCHAR(100)    NOT NULL UNIQUE,
    slug        VARCHAR(100)    NOT NULL UNIQUE,
    region      VARCHAR(100),
    is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  cuisine_types         IS 'Granular cuisine type lookup e.g. Ghanaian, Italian, Japanese. Admin-managed.';
COMMENT ON COLUMN cuisine_types.region  IS 'Broader region this cuisine belongs to e.g. West Africa, Europe, East Asia.';


-- Add cuisine_type_id to existing recipes table
ALTER TABLE recipes 
ADD COLUMN cuisine_type_id SMALLINT REFERENCES cuisine_types(id) ON DELETE SET NULL;

CREATE INDEX idx_recipes_cuisine_type_id ON recipes(cuisine_type_id);


-- Seed cuisine types
INSERT INTO cuisine_types (name, slug, region) VALUES
('Ghanaian',    'ghanaian',     'West Africa'),
('Nigerian',    'nigerian',     'West Africa'),
('Kenyan',      'kenyan',       'East Africa'),
('Senegalese',  'senegalese',   'West Africa'),
('Ethiopian',   'ethiopian',    'East Africa'),
('Italian',     'italian',      'Europe'),
('French',      'french',       'Europe'),
('Chinese',     'chinese',      'East Asia'),
('Japanese',    'japanese',     'East Asia'),
('Indian',      'indian',       'South Asia'),
('Mexican',     'mexican',      'Latin America'),
('American',    'american',     'North America'),
('Lebanese',    'lebanese',     'Middle East'),
('Thai',        'thai',         'Southeast Asia'),
('British',     'british',      'Europe');