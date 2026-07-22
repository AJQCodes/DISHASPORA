package com.dishaspora.marketplace.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public final class MarketplaceRequests {
    private MarketplaceRequests() {}

    public record VendorApplyRequest(
            @NotBlank String name,
            String bio,
            @NotBlank @Pattern(regexp = "FOOD|INGREDIENT|BOTH") String type,
            String specialty,
            String location,
            String phone,
            String logoUrl,
            String coverUrl) {}

    public record ListingRequest(
            @NotBlank @Pattern(regexp = "FOOD|INGREDIENT") String type,
            @NotBlank String title,
            String description,
            String imageUrl,
            @Min(0) long amountMinor,
            Long compareAtMinor,
            Boolean available,
            Integer stockQty,
            String quantity,
            String unit,
            Integer prepMinutes,
            Long linkedRecipeId) {}

    public record ReviewRequest(
            @NotNull @Min(1) @Max(5) Integer rating,
            String comment) {}
}
