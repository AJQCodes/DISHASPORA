package com.dishaspora.dto;

public record ChatMessageResponse(
        String id,
        String senderName,
        String senderType,
        String message,
        boolean read,
        String sentAt
) {}
