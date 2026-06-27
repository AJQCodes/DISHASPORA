package com.dishaspora.dto;

public record PlanResponse(
        String id,
        String name,
        double priceMonthly,
        double priceAnnual,
        String description,
        boolean hasVideoAccess,
        boolean hasAudioAccess,
        boolean hasChatSupport,
        boolean hasAdFree,
        Integer maxListings
) {}
