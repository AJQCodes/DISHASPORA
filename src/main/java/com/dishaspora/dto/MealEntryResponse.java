package com.dishaspora.dto;

public record MealEntryResponse(
        String id,
        String recipeName,
        String mealType,
        int servings,
        int calories,
        double protein,
        double carbs,
        double fat
) {}
