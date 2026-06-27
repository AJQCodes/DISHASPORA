package com.dishaspora.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

// ─────────────────────────────────────────────────────────────────────────────
// WebSocketConfig.java
// Sets up the real-time connection used for live chat and live viewer counts.
//
// HOW IT WORKS (STOMP over WebSocket — the standard Spring Boot approach):
//   - Frontend connects once to ws://your-ip:8080/ws
//   - Frontend "subscribes" to a topic like /topic/session/{sessionId}/chat
//   - Whenever anyone sends a message, the backend "publishes" to that topic
//   - Every subscribed client receives it instantly — this is what makes
//     chat feel live, the same idea behind TikTok Live's comment feed
// ─────────────────────────────────────────────────────────────────────────────
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    // ── Register the WebSocket endpoint the frontend connects to ───────────────
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")   // allow connections from the Expo app
                .withSockJS();                    // fallback for environments without raw WebSocket support
    }

    // ── Configure the message routing prefixes ─────────────────────────────────
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // ── Messages FROM backend TO clients go through "/topic" ───────────────
        registry.enableSimpleBroker("/topic");

        // ── Messages FROM clients TO backend go through "/app" ─────────────────
        registry.setApplicationDestinationPrefixes("/app");
    }
}
