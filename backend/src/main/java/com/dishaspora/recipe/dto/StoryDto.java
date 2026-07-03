package com.dishaspora.recipe.dto;

public record StoryDto(Long id, Long recipeId, String title, String body, String imageUrl,
                       String cuisine, String countryName, String vendorName) {
}
