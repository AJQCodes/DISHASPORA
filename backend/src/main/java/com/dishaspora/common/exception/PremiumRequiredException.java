package com.dishaspora.common.exception;

import org.springframework.http.HttpStatus;

public class PremiumRequiredException extends ApiException {

    public PremiumRequiredException(String message) {
        super(HttpStatus.PAYMENT_REQUIRED, message);
    }
}
