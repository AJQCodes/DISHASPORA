-- ============================================================
-- 010 ADMIN ACTIONS + CONTENT FLAGS
-- Tracks all admin decisions and automatically or manually
-- flagged content. Supports the moderation workflow in
-- sections 7.1 and 7.2 of the proposal.
-- ============================================================

CREATE TYPE admin_action_type AS ENUM (
    'vendor_approved',
    'vendor_rejected',
    'vendor_suspended',
    'recipe_approved',
    'recipe_rejected',
    'listing_approved',
    'listing_rejected',
    'dispute_resolved',
    'user_suspended',
    'user_reinstated'
);

CREATE TABLE admin_actions (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id        UUID                NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    action_type     admin_action_type   NOT NULL,
    notes           TEXT,

    -- Target — which entity this action was performed on
    -- Only one should be filled per row
    target_user_id      UUID        REFERENCES users(id) ON DELETE SET NULL,
    target_vendor_id    UUID        REFERENCES vendor_profiles(id) ON DELETE SET NULL,
    target_recipe_id    UUID        REFERENCES recipes(id) ON DELETE SET NULL,
    target_listing_id   UUID,

    performed_at    TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_admin_actions_admin_id      ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_action_type   ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_performed_at  ON admin_actions(performed_at);

COMMENT ON TABLE  admin_actions             IS 'Audit trail of every admin decision on the platform.';
COMMENT ON COLUMN admin_actions.admin_id    IS 'The admin user who performed the action.';
COMMENT ON COLUMN admin_actions.notes       IS 'Written feedback or reason for the action.';
COMMENT ON COLUMN admin_actions.target_listing_id IS 'UUID reference to either food_listings or ingredient_listings. No hard FK due to dual target.';


-- ------------------------------------------------------------
-- CONTENT FLAGS
-- Records of automatically or manually flagged content.
-- Feeds into the admin moderation queue.
-- ------------------------------------------------------------

CREATE TYPE flag_type AS ENUM (
    'duplicate_recipe',
    'incorrect_country',
    'miscategorized',
    'inappropriate_content',
    'suspicious_submission',
    'spam'
);

CREATE TYPE flag_status AS ENUM (
    'open',
    'reviewed',
    'dismissed',
    'actioned'
);

CREATE TABLE content_flags (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    flag_type       flag_type       NOT NULL,
    status          flag_status     NOT NULL DEFAULT 'open',
    raised_by       UUID            REFERENCES users(id) ON DELETE SET NULL,
    notes           TEXT,

    -- Target content being flagged
    target_recipe_id    UUID        REFERENCES recipes(id) ON DELETE CASCADE,
    target_listing_id   UUID,
    target_user_id      UUID        REFERENCES users(id) ON DELETE CASCADE,

    -- Admin who reviewed the flag
    reviewed_by     UUID            REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at     TIMESTAMPTZ,

    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_flags_status       ON content_flags(status);
CREATE INDEX idx_content_flags_flag_type    ON content_flags(flag_type);
CREATE INDEX idx_content_flags_raised_by    ON content_flags(raised_by);
CREATE INDEX idx_content_flags_reviewed_by  ON content_flags(reviewed_by);

COMMENT ON TABLE  content_flags             IS 'Flagged content feeding into the admin moderation queue. Can be raised by users or the system automatically.';
COMMENT ON COLUMN content_flags.raised_by   IS 'NULL if flagged automatically by the system rather than a user.';
COMMENT ON COLUMN content_flags.status      IS 'open = needs review, reviewed = admin looked at it, dismissed = not an issue, actioned = admin took action.';