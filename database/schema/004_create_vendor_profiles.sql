-- ============================================================
-- 004 VENDOR PROFILES + VENDOR DOCUMENTS
-- Extends a user into a vendor with business details and the
-- admin approval workflow. vendor_documents holds supporting
-- files submitted during registration.
-- ============================================================

CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

CREATE TABLE vendor_profiles (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID            NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name           VARCHAR(255)    NOT NULL,
    description             TEXT,
    cultural_specialty      VARCHAR(255),
    country_id              SMALLINT        NOT NULL REFERENCES countries(id),
    location                VARCHAR(255),
    contact_info            VARCHAR(255),

    -- Approval workflow
    approval_status         approval_status NOT NULL DEFAULT 'pending',
    admin_feedback          TEXT,
    reviewed_by             UUID            REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at             TIMESTAMPTZ,

    -- Vendor subscription / monetization
    subscription_plan       VARCHAR(50),
    subscription_expiry     DATE,

    -- Featured listing / sponsored content
    is_featured             BOOLEAN         NOT NULL DEFAULT FALSE,
    featured_until          DATE,

    -- Cached rating
    average_rating          NUMERIC(3,2)    CHECK (average_rating BETWEEN 0 AND 5),
    review_count            INTEGER         NOT NULL DEFAULT 0,

    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vendor_profiles_user_id         ON vendor_profiles(user_id);
CREATE INDEX idx_vendor_profiles_country_id      ON vendor_profiles(country_id);
CREATE INDEX idx_vendor_profiles_approval_status ON vendor_profiles(approval_status);

COMMENT ON TABLE  vendor_profiles                  IS 'Business profile for users with the vendor role. One row per vendor.';
COMMENT ON COLUMN vendor_profiles.user_id          IS 'One-to-one link back to users. Cascades on delete.';
COMMENT ON COLUMN vendor_profiles.reviewed_by      IS 'FK to the admin user who processed the application.';
COMMENT ON COLUMN vendor_profiles.approval_status  IS 'Single source of truth for whether a vendor can operate on the platform.';


-- ------------------------------------------------------------
-- VENDOR DOCUMENTS
-- ------------------------------------------------------------

CREATE TYPE document_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE vendor_documents (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id       UUID                NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    document_type   VARCHAR(100)        NOT NULL,
    file_url        TEXT                NOT NULL,
    status          document_status     NOT NULL DEFAULT 'pending',
    admin_notes     TEXT,
    uploaded_at     TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    reviewed_at     TIMESTAMPTZ
);

CREATE INDEX idx_vendor_documents_vendor_id ON vendor_documents(vendor_id);

COMMENT ON TABLE  vendor_documents               IS 'Supporting documents uploaded by vendors during registration.';
COMMENT ON COLUMN vendor_documents.file_url      IS 'URL pointing to cloud storage. Files are not stored in the DB.';
COMMENT ON COLUMN vendor_documents.document_type IS 'e.g. business_registration, national_id, food_handling_certificate';