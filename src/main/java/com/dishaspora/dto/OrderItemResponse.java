package com.dishaspora.dto;

// ─────────────────────────────────────────────────────────────────────────────
// OrderItemResponse.java
// Represents one line item in the order response sent to the client.
// itemTitle works for both food listings and ingredient listings.
// ─────────────────────────────────────────────────────────────────────────────
public record OrderItemResponse(
        String itemTitle,
        String itemType,   // "FOOD" or "INGREDIENT"
        int quantity,
        double unitPrice,
        double lineTotal
) {}
