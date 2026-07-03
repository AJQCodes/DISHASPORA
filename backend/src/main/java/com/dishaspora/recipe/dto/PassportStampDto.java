package com.dishaspora.recipe.dto;

public record PassportStampDto(String country, String countryName, String cuisine, String flagEmoji,
                               long recipesCooked, long totalRecipes, boolean stamped, String firstCookedAt) {
}
