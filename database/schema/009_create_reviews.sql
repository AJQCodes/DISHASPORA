-- ============================================================
-- 009 REVIEWS
-- Handles ratings and comments for both recipes and vendors.
-- Exactly one target (recipe or vendor) must be set per row.
-- ============================================================

CREATE TABLE reviews (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Target — exactly one must be filled (same pattern as order_items)
    recipe_id       UUID            REFERENCES recipes(id) ON DELETE CASCADE,
    vendor_id       UUID            REFERENCES vendor_profiles(id) ON DELETE CASCADE,

    rating          SMALLINT        NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Exactly one target must be filled, never both, never neither
    CONSTRAINT review_one_target CHECK (
        (recipe_id IS NOT NULL AND vendor_id IS NULL) OR
        (recipe_id IS NULL AND vendor_id IS NOT NULL)
    ),

    -- A user can only review the same recipe or vendor once
    UNIQUE (user_id, recipe_id),
    UNIQUE (user_id, vendor_id)
);

CREATE INDEX idx_reviews_user_id   ON reviews(user_id);
CREATE INDEX idx_reviews_recipe_id ON reviews(recipe_id);
CREATE INDEX idx_reviews_vendor_id ON reviews(vendor_id);
CREATE INDEX idx_reviews_rating    ON reviews(rating);

COMMENT ON TABLE  reviews           IS 'Ratings and comments targeting either a recipe or a vendor. Never both.';
COMMENT ON COLUMN reviews.rating    IS 'Integer 1-5. Used to calculate average_rating cached on recipes and vendor_profiles.';
COMMENT ON COLUMN reviews.recipe_id IS 'Nullable — exactly one of recipe_id or vendor_id must be set.';
COMMENT ON COLUMN reviews.vendor_id IS 'Nullable — exactly one of recipe_id or vendor_id must be set.';