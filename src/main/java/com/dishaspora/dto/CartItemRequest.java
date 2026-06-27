package com.dishaspora.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record CartItemRequest(
        String foodListingId,       // set one, leave the other null
        String ingredientListingId,
        @NotNull @Min(1) Integer quantity
) {}
