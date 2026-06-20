-- ============================================================
-- 005 RECIPES + RECIPE INGREDIENTS + RECIPE STEPS + RECIPE MEDIA
-- Core recipe content. Each recipe has one-to-many
-- relationships with its ingredients, steps, and media.
-- ============================================================

CREATE TABLE recipes (
    id                              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title                           VARCHAR(255)    NOT NULL,
    description                     TEXT,
    category_id                     SMALLINT        NOT NULL REFERENCES categories(id),
    cultural_origin                 VARCHAR(100),
    country_id                      SMALLINT        REFERENCES countries(id),

    -- Nutrition
    calories                        INTEGER         CHECK (calories >= 0),
    serving_size                    VARCHAR(50),
    meal_frequency_recommendation   VARCHAR(255),

    -- Ownership & approval
    created_by                      UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approval_status                 approval_status NOT NULL DEFAULT 'pending',
    is_premium                      BOOLEAN         NOT NULL DEFAULT FALSE,

    -- Cached engagement
    average_rating                  NUMERIC(3,2)    CHECK (average_rating BETWEEN 0 AND 5),
    review_count                    INTEGER         NOT NULL DEFAULT 0,
    save_count                      INTEGER         NOT NULL DEFAULT 0,

    created_at                      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recipes_category_id     ON recipes(category_id);
CREATE INDEX idx_recipes_country_id      ON recipes(country_id);
CREATE INDEX idx_recipes_created_by      ON recipes(created_by);
CREATE INDEX idx_recipes_approval_status ON recipes(approval_status);
CREATE INDEX idx_recipes_calories        ON recipes(calories);

COMMENT ON TABLE  recipes                 IS 'Core recipe table. Approved recipes are visible to users filtered by country.';
COMMENT ON COLUMN recipes.cultural_origin IS 'Free text region/culture label e.g. West Africa, Italy. Separate from country_id which drives filtering.';
COMMENT ON COLUMN recipes.is_premium      IS 'If true, video and audio content requires an active subscription.';


-- ------------------------------------------------------------
-- RECIPE INGREDIENTS
-- ------------------------------------------------------------

CREATE TABLE recipe_ingredients (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id               UUID            NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_name         VARCHAR(255)    NOT NULL,
    quantity                NUMERIC(10,2),
    unit                    VARCHAR(50),
    ingredient_listing_id   UUID,
    sort_order              SMALLINT        NOT NULL DEFAULT 0
);

CREATE INDEX idx_recipe_ingredients_recipe_id ON recipe_ingredients(recipe_id);

COMMENT ON TABLE  recipe_ingredients                       IS 'Ingredient list for each recipe. Ordered by sort_order.';
COMMENT ON COLUMN recipe_ingredients.ingredient_listing_id IS 'Optional cross-service reference to ingredient_listings. Not a hard FK due to microservices boundary.';


-- ------------------------------------------------------------
-- RECIPE STEPS
-- ------------------------------------------------------------

CREATE TABLE recipe_steps (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id    UUID        NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    step_number  SMALLINT    NOT NULL,
    instruction  TEXT        NOT NULL,
    media_url    TEXT,
    UNIQUE (recipe_id, step_number)
);

CREATE INDEX idx_recipe_steps_recipe_id ON recipe_steps(recipe_id);

COMMENT ON TABLE recipe_steps IS 'Step-by-step cooking instructions. step_number determines display order.';


-- ------------------------------------------------------------
-- RECIPE MEDIA
-- ------------------------------------------------------------

CREATE TYPE media_type AS ENUM ('image', 'video', 'audio');

CREATE TABLE recipe_media (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id   UUID        NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    media_type  media_type  NOT NULL,
    media_url   TEXT        NOT NULL,
    is_premium  BOOLEAN     NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_recipe_media_recipe_id ON recipe_media(recipe_id);

COMMENT ON TABLE  recipe_media            IS 'Media assets attached to a recipe. Premium media requires an active subscription.';
COMMENT ON COLUMN recipe_media.is_premium IS 'Videos and audio guides are premium per section 11 of the proposal.';


-- ------------------------------------------------------------
-- SAVED RECIPES
-- ------------------------------------------------------------

CREATE TABLE saved_recipes (
    user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipe_id   UUID        NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    saved_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, recipe_id)
);

CREATE INDEX idx_saved_recipes_user_id   ON saved_recipes(user_id);
CREATE INDEX idx_saved_recipes_recipe_id ON saved_recipes(recipe_id);

COMMENT ON TABLE saved_recipes IS 'Tracks which recipes each user has bookmarked. Composite PK prevents duplicates.';