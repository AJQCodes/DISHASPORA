package com.dishaspora.dto;

public record CartItemResponse(
        String id,
        String itemName,
        String itemType,    // FOOD or INGREDIENT
        double unitPrice,
        int quantity,
        double lineTotal
) {}
