package com.dishaspora.dto;
import java.util.List;

public record NutritionLogResponse(
        String id,
        String date,
        int totalCalories,
        double totalProtein,
        double totalCarbs,
        double totalFat,
        List<MealEntryResponse> meals
) {}
