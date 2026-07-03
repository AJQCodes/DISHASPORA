package com.dishaspora.common.dto;

public record ReviewDto(Long id, int rating, String comment, String userName, String userAvatarUrl, String createdAt) {
}
