package com.dishaspora.recipe.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.util.List;

public record RecipeRequest(
        @NotBlank String title,
        String description,
        @NotBlank @Pattern(regexp = "LOCAL|CONTINENTAL|FOREIGN|DRINK") String category,
        String cuisine,
        String countryOfOrigin,
        @NotBlank @Pattern(regexp = "BREAKFAST|LUNCH|DINNER|SNACK|DRINK") String mealType,
        String imageUrl,
        @Min(0) int calories,
        @Min(1) int servings,
        @Min(0) int prepMinutes,
        @Min(0) int cookMinutes,
        String mealFrequency,
        String mealFrequencyReason,
        List<RecipeDto.IngredientDto> ingredients,
        List<RecipeDto.RecipeStepDto> steps,
        String story,
        String storyImageUrl,
        String videoUrl,
        String audioUrl) {
}
