package com.dishaspora.chat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public final class ChatDtos {
    private ChatDtos() {}

    public record ChatThreadDto(Long id, Long vendorId, String vendorName, String vendorLogoUrl,
                                String lastMessage, String lastAt, long unread) {}

    public record ChatMessageDto(Long id, Long threadId, Long senderId, String senderName,
                                 boolean mine, String body, String createdAt) {}

    public record CreateThreadRequest(@NotNull Long vendorId) {}

    public record SendMessageRequest(@NotBlank String body) {}
}
