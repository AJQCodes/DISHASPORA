package com.dishaspora.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PaymentRequest(
        @NotNull String orderId,
        @NotBlank String paymentMethod,   // MOBILE_MONEY, CARD, BANK_TRANSFER
        String transactionRef             // reference from payment provider
) {}
