package com.dishaspora.dto;

public record NotificationResponse(
        String id,
        String title,
        String message,
        String type,
        boolean read,
        String createdAt
) {}
