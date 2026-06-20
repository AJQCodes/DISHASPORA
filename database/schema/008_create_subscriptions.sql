-- ============================================================
-- 008 SUBSCRIPTION PLANS + USER SUBSCRIPTIONS
-- Handles the premium content and vendor subscription
-- monetization model described in section 11.
-- ============================================================

CREATE TYPE plan_type AS ENUM ('free', 'premium', 'vendor_basic', 'vendor_pro');
CREATE TYPE billing_cycle AS ENUM ('monthly', 'annual');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled');

-- ------------------------------------------------------------
-- SUBSCRIPTION PLANS
-- Defines the available tiers and what each includes.
-- Admin-managed.
-- ------------------------------------------------------------

CREATE TABLE subscription_plans (
    id                  SMALLSERIAL     PRIMARY KEY,
    name                VARCHAR(100)    NOT NULL UNIQUE,
    plan_type           plan_type       NOT NULL,
    price_monthly       NUMERIC(10,2)   NOT NULL CHECK (price_monthly >= 0),
    price_annual        NUMERIC(10,2)   NOT NULL CHECK (price_annual >= 0),
    description         TEXT,

    -- Features included in this plan
    has_video_access        BOOLEAN     NOT NULL DEFAULT FALSE,
    has_audio_access        BOOLEAN     NOT NULL DEFAULT FALSE,
    has_chat_support        BOOLEAN     NOT NULL DEFAULT FALSE,
    has_ad_free             BOOLEAN     NOT NULL DEFAULT FALSE,
    max_listings            INTEGER,

    is_active           BOOLEAN         NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE  subscription_plans                IS 'Available subscription tiers. Admin-managed. Defines what features each plan unlocks.';
COMMENT ON COLUMN subscription_plans.max_listings   IS 'Maximum listings allowed for vendor plans. NULL means unlimited.';
COMMENT ON COLUMN subscription_plans.price_annual   IS 'Annual price — typically discounted vs monthly x 12.';


-- ------------------------------------------------------------
-- USER SUBSCRIPTIONS
-- Links a user to a plan with validity and billing info.
-- ------------------------------------------------------------

CREATE TABLE user_subscriptions (
    id              UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID                    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id         SMALLINT                NOT NULL REFERENCES subscription_plans(id),
    status          subscription_status     NOT NULL DEFAULT 'active',
    billing_cycle   billing_cycle           NOT NULL DEFAULT 'monthly',
    started_at      TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    expires_at      TIMESTAMPTZ             NOT NULL,
    cancelled_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ             NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_subscriptions_user_id  ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan_id  ON user_subscriptions(plan_id);
CREATE INDEX idx_user_subscriptions_status   ON user_subscriptions(status);

COMMENT ON TABLE  user_subscriptions              IS 'Active and historical subscription records per user.';
COMMENT ON COLUMN user_subscriptions.expires_at   IS 'When the current subscription period ends. App checks this to gate premium content.';
COMMENT ON COLUMN user_subscriptions.cancelled_at IS 'Timestamp of cancellation. NULL if still active.';