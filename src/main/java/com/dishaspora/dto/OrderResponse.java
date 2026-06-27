package com.dishaspora.dto;

import java.util.List;

// FIX: Added items list so the frontend can see what was ordered
public record OrderResponse(
        String id,
        String vendorName,
        double totalAmount,
        String status,
        String createdAt,
        List<OrderItemResponse> items
) {}
