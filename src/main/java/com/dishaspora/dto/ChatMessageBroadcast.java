package com.dishaspora.dto;

public record ChatMessageBroadcast(
        String id,
        String userName,
        String message,
        String sentAt
) {}
