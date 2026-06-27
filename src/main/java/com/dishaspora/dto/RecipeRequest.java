package com.dishaspora.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

// FIX: RecipeController was accepting the raw Recipe entity in request body,
// which allowed callers to set approvalStatus = APPROVED directly (security hole).
// This DTO only exposes the fields a vendor/user should be able to set.
public record RecipeRequest(
        @NotBlank String title,
        @NotBlank String category,       // LOCAL, CONTINENTAL, FOREIGN, DRINKS
        @NotBlank String culturalOrigin,
        @NotNull @Min(0) Integer calories,
        double protein,
        double carbs,
        double fat,
        @Min(1) int cookTime,
        @Min(1) int servings,
        String mealFrequency,
        boolean premium,
        @NotBlank String country
) {}
