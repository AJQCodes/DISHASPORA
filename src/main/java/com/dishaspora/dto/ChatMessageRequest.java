package com.dishaspora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ChatMessageRequest(
        @NotNull String vendorId,
        @NotBlank String message
) {}
