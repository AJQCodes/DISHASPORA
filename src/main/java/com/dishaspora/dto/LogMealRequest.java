package com.dishaspora.dto;

public record LogMealRequest(
        String recipeId,
        String recipeName,
        int servings,
        String mealType,
        Integer calories,
        Double protein,
        Double carbs,
        Double fat
) {}
