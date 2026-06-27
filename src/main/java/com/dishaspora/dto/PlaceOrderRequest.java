package com.dishaspora.dto;
import java.util.List;

public record PlaceOrderRequest(
        java.util.UUID vendorId,
        List<OrderItemRequest> items
) {}
