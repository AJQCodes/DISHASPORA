package com.dishaspora.dto;

public record SubscriptionStatusResponse(
        boolean isPremium,
        String planName,
        String startDate,
        String endDate,
        String status,
        long daysRemaining
) {}
