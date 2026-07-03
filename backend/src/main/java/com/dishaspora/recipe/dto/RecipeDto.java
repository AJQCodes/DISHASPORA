package com.dishaspora.recipe.dto;

import java.util.List;

public record RecipeDto(Long id, String title, String description, String category, String cuisine,
                        String countryOfOrigin, String mealType, String imageUrl,
                        int calories, int servings, int prepMinutes, int cookMinutes,
                        String mealFrequency, String mealFrequencyReason,
                        List<IngredientDto> ingredients, List<RecipeStepDto> steps,
                        String story, String storyImageUrl,
                        String videoUrl, String audioUrl, boolean hasVideo, boolean hasAudio,
                        Long vendorId, String vendorName, String status,
                        double rating, int reviewCount, boolean savedByMe, boolean cookedByMe) {

    public record IngredientDto(String name, String quantity, String unit) {}

    public record RecipeStepDto(int stepNumber, String instruction, Integer durationMinutes, String imageUrl) {}
}
