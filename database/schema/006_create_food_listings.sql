-- ============================================================
-- 006 FOOD LISTINGS + INGREDIENT LISTINGS
-- Marketplace tables where vendors list prepared meals and
-- raw ingredients for sale. Both are country-restricted.
-- ============================================================

CREATE TABLE food_listings (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id           UUID                NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    name                VARCHAR(255)        NOT NULL,
    description         TEXT,
    price               NUMERIC(10,2)       NOT NULL CHECK (price >= 0),
    image_url           TEXT,

    -- Link to recipe (optional - supports the 3 pathways in section 6)
    recipe_id           UUID                REFERENCES recipes(id) ON DELETE SET NULL,

    -- Availability
    availability_status VARCHAR(20)         NOT NULL DEFAULT 'available'
                        CHECK (availability_status IN ('available', 'sold_out', 'inactive')),
    quantity_available  INTEGER             CHECK (quantity_available >= 0),

    -- Country restriction
    country_id          SMALLINT            NOT NULL REFERENCES countries(id),

    -- Approval
    approval_status     approval_status     NOT NULL DEFAULT 'pending',
    admin_notes         TEXT,

    -- Engagement
    average_rating      NUMERIC(3,2)        CHECK (average_rating BETWEEN 0 AND 5),
    review_count        INTEGER             NOT NULL DEFAULT 0,

    -- Monetization
    is_featured         BOOLEAN             NOT NULL DEFAULT FALSE,
    featured_until      DATE,

    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_food_listings_vendor_id        ON food_listings(vendor_id);
CREATE INDEX idx_food_listings_country_id       ON food_listings(country_id);
CREATE INDEX idx_food_listings_approval_status  ON food_listings(approval_status);
CREATE INDEX idx_food_listings_recipe_id        ON food_listings(recipe_id);

COMMENT ON TABLE  food_listings             IS 'Prepared meals listed for sale by vendors. Country-restricted transactions.';
COMMENT ON COLUMN food_listings.recipe_id   IS 'Optional link to a recipe — supports the buy prepared meal pathway from section 6.';
COMMENT ON COLUMN food_listings.price       IS 'NUMERIC not float — avoids floating point rounding errors on money values.';


-- ------------------------------------------------------------
-- INGREDIENT LISTINGS
-- ------------------------------------------------------------

CREATE TABLE ingredient_listings (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id           UUID                NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    name                VARCHAR(255)        NOT NULL,
    description         TEXT,
    price               NUMERIC(10,2)       NOT NULL CHECK (price >= 0),
    unit                VARCHAR(50)         NOT NULL,
    quantity_available  INTEGER             NOT NULL CHECK (quantity_available >= 0),
    image_url           TEXT,

    -- Country restriction
    country_id          SMALLINT            NOT NULL REFERENCES countries(id),

    -- Approval
    approval_status     approval_status     NOT NULL DEFAULT 'pending',
    admin_notes         TEXT,

    -- Monetization
    is_featured         BOOLEAN             NOT NULL DEFAULT FALSE,
    featured_until      DATE,

    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ingredient_listings_vendor_id       ON ingredient_listings(vendor_id);
CREATE INDEX idx_ingredient_listings_country_id      ON ingredient_listings(country_id);
CREATE INDEX idx_ingredient_listings_approval_status ON ingredient_listings(approval_status);

COMMENT ON TABLE  ingredient_listings       IS 'Raw ingredients listed for sale by vendors. Country-restricted transactions.';
COMMENT ON COLUMN ingredient_listings.unit  IS 'e.g. kg, grams, pieces, liters, bunches';
COMMENT ON COLUMN ingredient_listings.price IS 'NUMERIC not float — avoids floating point rounding errors on money values.';