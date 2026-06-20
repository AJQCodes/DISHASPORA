-- ============================================================
-- 011 NOTIFICATIONS + CHAT MESSAGES
-- Notifications handles system alerts to users (order updates,
-- approval results etc). Chat messages handles the premium
-- cooking support conversations between users and vendors.
-- ============================================================

CREATE TYPE notification_type AS ENUM (
    'order_confirmed',
    'order_ready',
    'order_cancelled',
    'vendor_approved',
    'vendor_rejected',
    'recipe_approved',
    'recipe_rejected',
    'listing_approved',
    'listing_rejected',
    'new_review',
    'subscription_expiring',
    'subscription_expired'
);

CREATE TABLE notifications (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID                NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type   notification_type   NOT NULL,
    title               VARCHAR(255)        NOT NULL,
    message             TEXT                NOT NULL,
    is_read             BOOLEAN             NOT NULL DEFAULT FALSE,

    -- Optional reference to the entity this notification is about
    reference_id        UUID,
    reference_type      VARCHAR(50),

    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id      ON notifications(user_id);
CREATE INDEX idx_notifications_is_read      ON notifications(is_read);
CREATE INDEX idx_notifications_created_at   ON notifications(created_at);

COMMENT ON TABLE  notifications                  IS 'System notifications sent to users. Drives the bell icon alerts screen.';
COMMENT ON COLUMN notifications.is_read          IS 'FALSE until user opens the notification. Used for unread badge count.';
COMMENT ON COLUMN notifications.reference_id     IS 'UUID of the entity this notification relates to e.g. an order_id or recipe_id.';
COMMENT ON COLUMN notifications.reference_type   IS 'Type of the referenced entity e.g. order, recipe, vendor. Used alongside reference_id.';


-- ------------------------------------------------------------
-- CHAT MESSAGES
-- Premium cooking support conversations between users
-- and vendors. Only accessible to subscribed users.
-- ------------------------------------------------------------

CREATE TYPE message_sender_type AS ENUM ('user', 'vendor');

CREATE TABLE chat_messages (
    id              UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID                    NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id       UUID                    NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    sender_type     message_sender_type     NOT NULL,
    message         TEXT                    NOT NULL,
    is_read         BOOLEAN                 NOT NULL DEFAULT FALSE,
    sent_at         TIMESTAMPTZ             NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_chat_messages_user_id      ON chat_messages(user_id);
CREATE INDEX idx_chat_messages_vendor_id    ON chat_messages(vendor_id);
CREATE INDEX idx_chat_messages_sent_at      ON chat_messages(sent_at);

COMMENT ON TABLE  chat_messages                 IS 'Premium chat support messages between users and vendors. Access gated by subscription.';
COMMENT ON COLUMN chat_messages.sender_type     IS 'Whether the message was sent by the user or the vendor.';
COMMENT ON COLUMN chat_messages.is_read         IS 'FALSE until the recipient opens the message.';