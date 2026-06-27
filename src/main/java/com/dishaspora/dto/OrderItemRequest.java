package com.dishaspora.dto;

import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// OrderItemRequest.java
// One line in a PlaceOrderRequest.
//
// The client sets EITHER foodListingId OR ingredientListingId — not both.
// OrderService validates that exactly one is provided.
// ─────────────────────────────────────────────────────────────────────────────
public record OrderItemRequest(
        UUID foodListingId,
        UUID ingredientListingId,
        int quantity
) {}
