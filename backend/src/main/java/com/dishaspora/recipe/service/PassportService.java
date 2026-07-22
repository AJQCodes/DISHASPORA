package com.dishaspora.recipe.service;

import com.dishaspora.auth.entity.User;
import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.util.CountryUtil;
import com.dishaspora.recipe.dto.PassportStampDto;
import com.dishaspora.recipe.entity.CookedRecipe;
import com.dishaspora.recipe.entity.Recipe;
import com.dishaspora.recipe.repository.CookedRecipeRepository;
import com.dishaspora.recipe.repository.RecipeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class PassportService {

    private final CookedRecipeRepository cookedRecipeRepository;
    private final RecipeRepository recipeRepository;

    public PassportService(CookedRecipeRepository cookedRecipeRepository, RecipeRepository recipeRepository) {
        this.cookedRecipeRepository = cookedRecipeRepository;
        this.recipeRepository = recipeRepository;
    }

    public record CookedResult(PassportStampDto stamp, boolean newStamp) {}

    @Transactional
    public CookedResult markCooked(Recipe recipe, User user) {
        String country = recipe.getCountryOfOrigin();
        boolean firstInCountry = cookedRecipeRepository
                .findByUserIdAndCountryOfOrigin(user.getId(), country).isEmpty();
        boolean alreadyCooked = cookedRecipeRepository
                .existsByUserIdAndRecipeId(user.getId(), recipe.getId());
        if (!alreadyCooked) {
            cookedRecipeRepository.save(new CookedRecipe(user.getId(), recipe.getId(), country));
        }
        PassportStampDto stamp = buildStamp(user, country, recipe.getCuisine());
        return new CookedResult(stamp, firstInCountry && !alreadyCooked);
    }

    public Map<String, Object> passport(User user) {
        List<CookedRecipe> cooked = cookedRecipeRepository.findByUserId(user.getId());
        // Countries in the recipe catalog, keeping insertion order (stamped ones computed per country).
        Map<String, String> countryCuisine = new LinkedHashMap<>();
        for (Recipe r : recipeRepository.findByStatus(ApprovalStatus.APPROVED)) {
            if (r.getCountryOfOrigin() != null) {
                countryCuisine.putIfAbsent(r.getCountryOfOrigin(), r.getCuisine());
            }
        }
        List<PassportStampDto> stamps = countryCuisine.entrySet().stream()
                .map(e -> buildStamp(user, e.getKey(), e.getValue()))
                .toList();
        long countriesStamped = stamps.stream().filter(PassportStampDto::stamped).count();
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("stamps", stamps);
        response.put("countriesStamped", countriesStamped);
        response.put("totalCooked", (long) cooked.size());
        return response;
    }

    private PassportStampDto buildStamp(User user, String country, String cuisine) {
        List<CookedRecipe> cookedInCountry =
                cookedRecipeRepository.findByUserIdAndCountryOfOrigin(user.getId(), country);
        long totalRecipes = recipeRepository.countByStatusAndCountryOfOrigin(ApprovalStatus.APPROVED, country);
        Instant firstCookedAt = cookedInCountry.stream()
                .map(CookedRecipe::getCookedAt)
                .min(Comparator.naturalOrder())
                .orElse(null);
        return new PassportStampDto(
                country,
                CountryUtil.countryName(country),
                cuisine,
                CountryUtil.flagEmoji(country),
                cookedInCountry.size(),
                totalRecipes,
                !cookedInCountry.isEmpty(),
                firstCookedAt == null ? null : firstCookedAt.toString());
    }
}
