package com.dishaspora.common.dto;

public record PaystackInitDto(String authorizationUrl, String reference, String publicKey,
                              long amountMinor, String currency) {
}
