-- ============================================================
-- 007 CART ITEMS + ORDERS + ORDER ITEMS
-- Handles the full purchase flow from cart to confirmed order.
-- One order = one vendor (multiple vendors = multiple orders).
-- ============================================================

CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'preparing',
    'ready_for_pickup',
    'completed',
    'cancelled'
);

CREATE TYPE payment_status AS ENUM (
    'unpaid',
    'paid',
    'refunded'
);

-- ------------------------------------------------------------
-- CART ITEMS
-- Working cart before checkout. Cleared after order is placed.
-- ------------------------------------------------------------

CREATE TABLE cart_items (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    food_listing_id         UUID        REFERENCES food_listings(id) ON DELETE CASCADE,
    ingredient_listing_id   UUID        REFERENCES ingredient_listings(id) ON DELETE CASCADE,
    quantity                INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
    added_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Exactly one listing type must be filled, never both, never neither
    CONSTRAINT cart_one_listing_type CHECK (
        (food_listing_id IS NOT NULL AND ingredient_listing_id IS NULL) OR
        (food_listing_id IS NULL AND ingredient_listing_id IS NOT NULL)
    )
);

CREATE INDEX idx_cart_items_user_id               ON cart_items(user_id);
CREATE INDEX idx_cart_items_food_listing_id       ON cart_items(food_listing_id);
CREATE INDEX idx_cart_items_ingredient_listing_id ON cart_items(ingredient_listing_id);

COMMENT ON TABLE  cart_items                        IS 'Items in a users active cart before checkout.';
COMMENT ON COLUMN cart_items.food_listing_id        IS 'Nullable — exactly one of food or ingredient listing must be set.';
COMMENT ON COLUMN cart_items.ingredient_listing_id  IS 'Nullable — exactly one of food or ingredient listing must be set.';


-- ------------------------------------------------------------
-- ORDERS
-- One order per vendor. Confirmed from cart at checkout.
-- ------------------------------------------------------------

CREATE TABLE orders (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vendor_id       UUID            NOT NULL REFERENCES vendor_profiles(id) ON DELETE RESTRICT,
    status          order_status    NOT NULL DEFAULT 'pending',
    total_amount    NUMERIC(10,2)   NOT NULL CHECK (total_amount >= 0),
    payment_status  payment_status  NOT NULL DEFAULT 'unpaid',
    country_id      SMALLINT        NOT NULL REFERENCES countries(id),
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id   ON orders(user_id);
CREATE INDEX idx_orders_vendor_id ON orders(vendor_id);
CREATE INDEX idx_orders_status    ON orders(status);
CREATE INDEX idx_orders_country_id ON orders(country_id);

COMMENT ON TABLE  orders            IS 'One order per vendor. Multiple vendors in a cart produce multiple orders at checkout.';
COMMENT ON COLUMN orders.country_id IS 'Confirms same-country transaction constraint at order level.';


-- ------------------------------------------------------------
-- ORDER ITEMS
-- Line items belonging to an order. Price is snapshotted
-- at time of purchase so historical orders are unaffected
-- by future listing price changes.
-- ------------------------------------------------------------

CREATE TABLE order_items (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                UUID            NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    food_listing_id         UUID            REFERENCES food_listings(id) ON DELETE SET NULL,
    ingredient_listing_id   UUID            REFERENCES ingredient_listings(id) ON DELETE SET NULL,
    quantity                INTEGER         NOT NULL CHECK (quantity > 0),
    unit_price              NUMERIC(10,2)   NOT NULL CHECK (unit_price >= 0),
    subtotal                NUMERIC(10,2)   NOT NULL CHECK (subtotal >= 0),

    -- Exactly one listing type must be filled
    CONSTRAINT order_item_one_listing_type CHECK (
        (food_listing_id IS NOT NULL AND ingredient_listing_id IS NULL) OR
        (food_listing_id IS NULL AND ingredient_listing_id IS NOT NULL)
    )
);

CREATE INDEX idx_order_items_order_id               ON order_items(order_id);
CREATE INDEX idx_order_items_food_listing_id        ON order_items(food_listing_id);
CREATE INDEX idx_order_items_ingredient_listing_id  ON order_items(ingredient_listing_id);

COMMENT ON TABLE  order_items            IS 'Line items for each order. unit_price is snapshotted at checkout time.';
COMMENT ON COLUMN order_items.unit_price IS 'Price copied from listing at time of purchase. Never join to listing for historical price.';
COMMENT ON COLUMN order_items.subtotal   IS 'quantity x unit_price. Stored to avoid recalculation.';