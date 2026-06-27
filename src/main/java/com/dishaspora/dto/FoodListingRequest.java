package com.dishaspora.dto;

public record FoodListingRequest(
        String name,
        String description,
        double price,
        String country,
        int stockQuantity,
        String imageUrl
) {}
