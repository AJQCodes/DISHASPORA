package com.dishaspora.recipe.dto;

import com.dishaspora.marketplace.dto.ListingDto;
import com.dishaspora.marketplace.dto.VendorDto;
import com.dishaspora.recipe.dto.RecipeDto.IngredientDto;

import java.util.List;

public record BasketDto(VendorDto vendor, List<BasketItemDto> items, long totalMinor, String currency,
                        List<IngredientDto> unmatched) {

    public record BasketItemDto(IngredientDto ingredient, ListingDto listing, int qty) {}
}
