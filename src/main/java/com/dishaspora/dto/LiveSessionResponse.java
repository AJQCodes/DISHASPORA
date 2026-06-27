package com.dishaspora.dto;

public record LiveSessionResponse(
        String id,
        String title,
        String hostName,
        String videoUrl,
        String status,
        int currentViewers,
        int peakViewers,
        String startedAt
) {}
