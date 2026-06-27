package com.dishaspora.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

public record IngredientListingRequest(
        @NotBlank String name,
        String description,
        double price,
        @NotBlank String unit,
        @Min(0) int stockQuantity,
        String imageUrl,
        @NotBlank String country
) {}
