package com.dishaspora.dto;

public record ReviewResponse(
        String id,
        String userName,
        int rating,
        String comment,
        String createdAt
) {}
