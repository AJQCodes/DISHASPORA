package com.dishaspora.admin.service;

import com.dishaspora.admin.entity.Flag;
import com.dishaspora.admin.repository.FlagRepository;
import com.dishaspora.common.enums.Enums.FlagTargetType;
import com.dishaspora.common.enums.Enums.FlagType;
import com.dishaspora.common.enums.Enums.ListingType;
import com.dishaspora.common.enums.Enums.RecipeCategory;
import com.dishaspora.marketplace.entity.Listing;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.marketplace.repository.ListingRepository;
import com.dishaspora.recipe.entity.Recipe;
import com.dishaspora.recipe.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

/**
 * Runs the automatic moderation checks defined in API.md whenever a recipe or
 * listing is created. Flags never block the publication workflow; they only
 * appear in the admin flags queue.
 */
@Service
public class AutoFlagService {

    private static final List<String> BANNED_WORDS =
            List.of("scam", "fraud", "fake", "stupid", "idiot", "nonsense", "counterfeit");

    private static final List<String> FOOD_KEYWORDS =
            List.of("soup", "rice", "stew", "yam", "fufu", "banku", "kenkey", "porridge", "salad", "pizza", "burger");

    private static final List<String> DRINK_KEYWORDS =
            List.of("juice", "smoothie", "drink", "cocktail", "tea", "sobolo", "zobo", "chapman");

    private final FlagRepository flagRepository;
    private final RecipeRepository recipeRepository;
    private final ListingRepository listingRepository;

    public AutoFlagService(FlagRepository flagRepository,
                           RecipeRepository recipeRepository,
                           ListingRepository listingRepository) {
        this.flagRepository = flagRepository;
        this.recipeRepository = recipeRepository;
        this.listingRepository = listingRepository;
    }

    /** Call AFTER the recipe has been persisted (needs the id). */
    public void checkRecipe(Recipe recipe) {
        String title = safe(recipe.getTitle());
        String description = safe(recipe.getDescription());

        // DUPLICATE_RECIPE: same normalized title already exists (any vendor).
        long sameTitle = recipeRepository.findAll().stream()
                .filter(r -> !r.getId().equals(recipe.getId()))
                .filter(r -> normalize(r.getTitle()).equals(normalize(recipe.getTitle())))
                .count();
        if (sameTitle > 0) {
            flag(FlagType.DUPLICATE_RECIPE, FlagTargetType.RECIPE, recipe.getId(), recipe.getTitle(),
                    "A recipe with the same title already exists on the platform.");
        }

        // CATEGORY_SUSPECT
        if (recipe.getCategory() == RecipeCategory.DRINK && containsAny(title, FOOD_KEYWORDS)) {
            flag(FlagType.CATEGORY_SUSPECT, FlagTargetType.RECIPE, recipe.getId(), recipe.getTitle(),
                    "Category is DRINK but the title looks like a food dish.");
        }
        if (recipe.getCategory() != RecipeCategory.DRINK && containsAny(title, DRINK_KEYWORDS)) {
            flag(FlagType.CATEGORY_SUSPECT, FlagTargetType.RECIPE, recipe.getId(), recipe.getTitle(),
                    "Title looks like a drink but the category is not DRINK.");
        }

        // INAPPROPRIATE
        if (containsAny(title + " " + description, BANNED_WORDS)) {
            flag(FlagType.INAPPROPRIATE, FlagTargetType.RECIPE, recipe.getId(), recipe.getTitle(),
                    "Title or description contains a banned word.");
        }

        // REPEATED_SUBMISSION: same vendor submitted >= 3 items in 10 minutes.
        Instant window = Instant.now().minus(Duration.ofMinutes(10));
        long recent = recipeRepository.countByVendorIdAndCreatedAtAfter(recipe.getVendorId(), window)
                + listingRepository.countByVendorIdAndCreatedAtAfter(recipe.getVendorId(), window);
        if (recent >= 3) {
            flag(FlagType.REPEATED_SUBMISSION, FlagTargetType.RECIPE, recipe.getId(), recipe.getTitle(),
                    "Vendor submitted " + recent + " items within the last 10 minutes.");
        }
    }

    /** Call AFTER the listing has been persisted (needs the id). */
    public void checkListing(Listing listing, Vendor vendor) {
        String title = safe(listing.getTitle());
        String description = safe(listing.getDescription());

        // COUNTRY_MISMATCH
        if (vendor != null && !vendor.getCountry().equalsIgnoreCase(listing.getCountry())) {
            flag(FlagType.COUNTRY_MISMATCH, FlagTargetType.LISTING, listing.getId(), listing.getTitle(),
                    "Listing country (" + listing.getCountry() + ") differs from vendor country ("
                            + vendor.getCountry() + ").");
        }

        // CATEGORY_SUSPECT (drink-vs-food heuristic on listing type)
        if (listing.getType() == ListingType.INGREDIENT && containsAny(title, DRINK_KEYWORDS)) {
            flag(FlagType.CATEGORY_SUSPECT, FlagTargetType.LISTING, listing.getId(), listing.getTitle(),
                    "Ingredient listing title looks like a prepared drink.");
        }

        // INAPPROPRIATE
        if (containsAny(title + " " + description, BANNED_WORDS)) {
            flag(FlagType.INAPPROPRIATE, FlagTargetType.LISTING, listing.getId(), listing.getTitle(),
                    "Title or description contains a banned word.");
        }

        // REPEATED_SUBMISSION
        Instant window = Instant.now().minus(Duration.ofMinutes(10));
        long recent = listingRepository.countByVendorIdAndCreatedAtAfter(listing.getVendorId(), window)
                + recipeRepository.countByVendorIdAndCreatedAtAfter(listing.getVendorId(), window);
        if (recent >= 3) {
            flag(FlagType.REPEATED_SUBMISSION, FlagTargetType.LISTING, listing.getId(), listing.getTitle(),
                    "Vendor submitted " + recent + " items within the last 10 minutes.");
        }
    }

    private void flag(FlagType type, FlagTargetType targetType, Long targetId, String targetTitle, String detail) {
        flagRepository.save(new Flag(type, targetType, targetId, targetTitle, detail));
    }

    private static String normalize(String s) {
        return s == null ? "" : s.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", " ").trim();
    }

    private static boolean containsAny(String text, List<String> words) {
        String lower = text.toLowerCase(Locale.ROOT);
        return words.stream().anyMatch(lower::contains);
    }

    private static String safe(String s) {
        return s == null ? "" : s;
    }
}
