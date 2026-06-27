package com.dishaspora.dto;

public record PaymentResponse(
        String id,
        String orderId,
        double amount,
        String paymentMethod,
        String transactionStatus,
        String transactionRef,
        String paidAt,
        String createdAt
) {}
