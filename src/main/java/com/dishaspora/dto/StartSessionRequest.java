package com.dishaspora.dto;

public record StartSessionRequest(
        String title,
        String hostName,
        String videoUrl
) {}
