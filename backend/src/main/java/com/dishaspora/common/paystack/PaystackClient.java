package com.dishaspora.common.paystack;

import com.dishaspora.common.dto.PaystackInitDto;
import com.dishaspora.common.exception.ApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * Thin wrapper around the Paystack transaction API.
 * When no secret key is configured the client runs in MOCK mode so the whole
 * platform can be demoed locally without real Paystack credentials.
 */
@Component
public class PaystackClient {

    private static final String BASE_URL = "https://api.paystack.co";

    private final String secretKey;
    private final String publicKey;
    private final RestClient restClient;

    public PaystackClient(@Value("${paystack.secret-key:}") String secretKey,
                          @Value("${paystack.public-key:}") String publicKey) {
        this.secretKey = secretKey == null ? "" : secretKey.trim();
        this.publicKey = publicKey == null ? "" : publicKey.trim();
        this.restClient = RestClient.builder().baseUrl(BASE_URL).build();
    }

    public boolean isMockMode() {
        return secretKey.isBlank();
    }

    public String publicKey() {
        return publicKey;
    }

    /**
     * Initializes a Paystack transaction and returns the checkout details.
     */
    @SuppressWarnings("unchecked")
    public PaystackInitDto initialize(String email, long amountMinor, String currency, String reference) {
        if (isMockMode()) {
            return new PaystackInitDto(
                    "https://checkout.paystack.com/mock/" + reference,
                    reference, publicKey, amountMinor, currency);
        }
        try {
            Map<String, Object> body = Map.of(
                    "email", email,
                    "amount", amountMinor,
                    "currency", currency,
                    "reference", reference);
            Map<String, Object> response = restClient.post()
                    .uri("/transaction/initialize")
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + secretKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            if (response == null || !(response.get("data") instanceof Map)) {
                throw new ApiException(HttpStatus.BAD_GATEWAY, "Paystack initialize failed");
            }
            Map<String, Object> data = (Map<String, Object>) response.get("data");
            return new PaystackInitDto(
                    String.valueOf(data.get("authorization_url")),
                    String.valueOf(data.get("reference")),
                    publicKey, amountMinor, currency);
        } catch (ApiException e) {
            throw e;
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Paystack initialize failed: " + e.getMessage());
        }
    }

    /**
     * Verifies a Paystack transaction. In mock mode every reference verifies successfully.
     */
    @SuppressWarnings("unchecked")
    public boolean verify(String reference) {
        if (isMockMode()) {
            return true;
        }
        try {
            Map<String, Object> response = restClient.get()
                    .uri("/transaction/verify/{reference}", reference)
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + secretKey)
                    .retrieve()
                    .body(Map.class);
            if (response == null || !(response.get("data") instanceof Map)) {
                return false;
            }
            Map<String, Object> data = (Map<String, Object>) response.get("data");
            return "success".equalsIgnoreCase(String.valueOf(data.get("status")));
        } catch (Exception e) {
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Paystack verify failed: " + e.getMessage());
        }
    }
}
