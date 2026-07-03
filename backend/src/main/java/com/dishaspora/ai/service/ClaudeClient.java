package com.dishaspora.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Minimal Anthropic Messages API client. Returns null when no API key is
 * configured or when the call fails, so callers can fall back to the
 * rule-based assistant.
 */
@Component
public class ClaudeClient {

    private static final String BASE_URL = "https://api.anthropic.com";
    private static final String MODEL = "claude-sonnet-5";
    private static final String API_VERSION = "2023-06-01";

    private final String apiKey;
    private final RestClient restClient;

    public ClaudeClient(@Value("${anthropic.api-key:}") String apiKey) {
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.restClient = RestClient.builder().baseUrl(BASE_URL).build();
    }

    public boolean isConfigured() {
        return !apiKey.isBlank();
    }

    public record Turn(String role, String content) {}

    /**
     * Sends a chat to Claude and returns the assistant text, or null on failure.
     */
    @SuppressWarnings("unchecked")
    public String chat(String systemPrompt, List<Turn> history, String userMessage) {
        if (!isConfigured()) return null;
        try {
            List<Map<String, String>> messages = new ArrayList<>();
            if (history != null) {
                for (Turn turn : history) {
                    if (turn.content() == null || turn.content().isBlank()) continue;
                    String role = "assistant".equalsIgnoreCase(turn.role()) ? "assistant" : "user";
                    messages.add(Map.of("role", role, "content", turn.content()));
                }
            }
            messages.add(Map.of("role", "user", "content", userMessage));

            Map<String, Object> body = Map.of(
                    "model", MODEL,
                    "max_tokens", 700,
                    "system", systemPrompt,
                    "messages", messages);

            Map<String, Object> response = restClient.post()
                    .uri("/v1/messages")
                    .header("x-api-key", apiKey)
                    .header("anthropic-version", API_VERSION)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);

            if (response == null || !(response.get("content") instanceof List<?> content)) {
                return null;
            }
            StringBuilder text = new StringBuilder();
            for (Object block : content) {
                if (block instanceof Map<?, ?> map && "text".equals(map.get("type"))) {
                    text.append(map.get("text"));
                }
            }
            return text.isEmpty() ? null : text.toString();
        } catch (Exception e) {
            return null;
        }
    }
}
