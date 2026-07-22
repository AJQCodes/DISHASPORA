package com.dishaspora.recipe.service;

import com.dishaspora.auth.entity.User;
import com.dishaspora.common.enums.Enums.Role;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.marketplace.repository.VendorRepository;
import com.dishaspora.recipe.dto.RecipeDto;
import com.dishaspora.recipe.entity.Ingredient;
import com.dishaspora.recipe.entity.Recipe;
import com.dishaspora.recipe.entity.RecipeStep;
import com.dishaspora.recipe.repository.CookedRecipeRepository;
import com.dishaspora.recipe.repository.SavedRecipeRepository;
import org.springframework.stereotype.Component;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Component
public class RecipeMapper {

    private final VendorRepository vendorRepository;
    private final SavedRecipeRepository savedRecipeRepository;
    private final CookedRecipeRepository cookedRecipeRepository;

    public RecipeMapper(VendorRepository vendorRepository,
                        SavedRecipeRepository savedRecipeRepository,
                        CookedRecipeRepository cookedRecipeRepository) {
        this.vendorRepository = vendorRepository;
        this.savedRecipeRepository = savedRecipeRepository;
        this.cookedRecipeRepository = cookedRecipeRepository;
    }

    public RecipeDto toDto(Recipe recipe, User currentUser) {
        Vendor vendor = recipe.getVendorId() == null ? null
                : vendorRepository.findById(recipe.getVendorId()).orElse(null);
        boolean savedByMe = currentUser != null
                && savedRecipeRepository.existsByUserIdAndRecipeId(currentUser.getId(), recipe.getId());
        boolean cookedByMe = currentUser != null
                && cookedRecipeRepository.existsByUserIdAndRecipeId(currentUser.getId(), recipe.getId());
        return toDto(recipe, vendor, currentUser, savedByMe, cookedByMe);
    }

    public List<RecipeDto> toDtos(List<Recipe> recipes, User currentUser) {
        return recipes.stream().map(r -> toDto(r, currentUser)).toList();
    }

    private RecipeDto toDto(Recipe r, Vendor vendor, User currentUser, boolean savedByMe, boolean cookedByMe) {
        boolean premiumMedia = canSeePremiumMedia(r, vendor, currentUser);
        return new RecipeDto(
                r.getId(), r.getTitle(), r.getDescription(),
                r.getCategory().name(), r.getCuisine(), r.getCountryOfOrigin(), r.getMealType().name(),
                r.getImageUrl(), r.getCalories(), r.getServings(), r.getPrepMinutes(), r.getCookMinutes(),
                r.getMealFrequency(), r.getMealFrequencyReason(),
                mapIngredients(r.getIngredients()), mapSteps(r.getSteps()),
                r.getStory(), r.getStoryImageUrl(),
                premiumMedia ? r.getVideoUrl() : null,
                videoSearchUrl(r),
                premiumMedia ? r.getAudioUrl() : null,
                r.getVideoUrl() != null, r.getAudioUrl() != null,
                r.getVendorId(), vendor == null ? null : vendor.getName(),
                r.getStatus().name(),
                Math.round(r.getRating() * 10.0) / 10.0, r.getReviewCount(),
                savedByMe, cookedByMe);
    }

    /**
     * Every recipe gets a working "watch the preparation" link. Recipes that carry
     * their own curated link keep it; the rest fall back to a YouTube search for the
     * dish, which always resolves and never rots.
     */
    private static String videoSearchUrl(Recipe recipe) {
        String stored = recipe.getVideoSearchUrl();
        if (stored != null && !stored.isBlank()) return stored;
        String title = recipe.getTitle();
        if (title == null || title.isBlank()) return null;
        return "https://www.youtube.com/results?search_query="
                + URLEncoder.encode(title + " recipe", StandardCharsets.UTF_8);
    }

    private boolean canSeePremiumMedia(Recipe recipe, Vendor vendor, User user) {
        if (user == null) return false;
        if (user.getRole() == Role.ADMIN) return true;
        if (vendor != null && Objects.equals(vendor.getOwnerUserId(), user.getId())) return true;
        return user.isPremiumActive();
    }

    public static List<RecipeDto.IngredientDto> mapIngredients(List<Ingredient> ingredients) {
        return ingredients.stream()
                .map(i -> new RecipeDto.IngredientDto(i.getName(), i.getQuantity(), i.getUnit()))
                .toList();
    }

    public static List<RecipeDto.RecipeStepDto> mapSteps(List<RecipeStep> steps) {
        return steps.stream()
                .map(s -> new RecipeDto.RecipeStepDto(s.getStepNumber(), s.getInstruction(),
                        s.getDurationMinutes(), s.getImageUrl()))
                .toList();
    }
}
