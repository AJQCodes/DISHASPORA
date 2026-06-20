-- ============================================================
-- 014 RATING UPDATE TRIGGERS
-- Automatically updates average_rating and review_count on
-- recipes and vendor_profiles whenever a review is inserted,
-- updated, or deleted. Keeps cached fields always accurate.
-- ============================================================

-- Function that recalculates and updates the rating
CREATE OR REPLACE FUNCTION update_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update recipe rating if this review targets a recipe
    IF NEW.recipe_id IS NOT NULL THEN
        UPDATE recipes
        SET 
            average_rating = (
                SELECT ROUND(AVG(rating)::NUMERIC, 2)
                FROM reviews
                WHERE recipe_id = NEW.recipe_id
            ),
            review_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE recipe_id = NEW.recipe_id
            )
        WHERE id = NEW.recipe_id;
    END IF;

    -- Update vendor rating if this review targets a vendor
    IF NEW.vendor_id IS NOT NULL THEN
        UPDATE vendor_profiles
        SET
            average_rating = (
                SELECT ROUND(AVG(rating)::NUMERIC, 2)
                FROM reviews
                WHERE vendor_id = NEW.vendor_id
            ),
            review_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE vendor_id = NEW.vendor_id
            )
        WHERE id = NEW.vendor_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger that fires after every insert or update on reviews
CREATE TRIGGER trigger_update_rating
AFTER INSERT OR UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_rating();


-- Function to handle rating recalculation after a review is deleted
CREATE OR REPLACE FUNCTION update_rating_on_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate recipe rating after deletion
    IF OLD.recipe_id IS NOT NULL THEN
        UPDATE recipes
        SET
            average_rating = (
                SELECT ROUND(AVG(rating)::NUMERIC, 2)
                FROM reviews
                WHERE recipe_id = OLD.recipe_id
            ),
            review_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE recipe_id = OLD.recipe_id
            )
        WHERE id = OLD.recipe_id;
    END IF;

    -- Recalculate vendor rating after deletion
    IF OLD.vendor_id IS NOT NULL THEN
        UPDATE vendor_profiles
        SET
            average_rating = (
                SELECT ROUND(AVG(rating)::NUMERIC, 2)
                FROM reviews
                WHERE vendor_id = OLD.vendor_id
            ),
            review_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE vendor_id = OLD.vendor_id
            )
        WHERE id = OLD.vendor_id;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger that fires after every delete on reviews
CREATE TRIGGER trigger_update_rating_on_delete
AFTER DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_rating_on_delete();