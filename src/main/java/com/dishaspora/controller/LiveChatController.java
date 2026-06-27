package com.dishaspora.controller;

import com.dishaspora.dto.SendChatMessageRequest;
import com.dishaspora.service.LiveSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// LiveChatController.java
// Handles messages arriving OVER the WebSocket connection itself (not a
// normal HTTP request). This is different from @RestController — @MessageMapping
// methods respond to STOMP messages sent to "/app/..." destinations.
//
// FLOW:
//   1. Viewer's app sends a message to /app/session/{sessionId}/chat
//   2. This method receives it here
//   3. LiveSessionService saves it and broadcasts it to /topic/session/{id}/chat
//   4. Every viewer subscribed to that topic receives it instantly
// ─────────────────────────────────────────────────────────────────────────────
@Controller
@RequiredArgsConstructor
public class LiveChatController {

    private final LiveSessionService liveSessionService;

    // ── A viewer sends a chat message ───────────────────────────────────────────
    @MessageMapping("/session/{sessionId}/chat")
    public void handleChatMessage(
            @DestinationVariable UUID sessionId,
            SendChatMessageRequest request,
            SimpMessageHeaderAccessor headerAccessor) {

        // ── Get the authenticated user from the WebSocket session ──────────────
        Authentication auth = (Authentication) headerAccessor.getUser();
        String userEmail = auth != null ? auth.getName() : "anonymous";

        liveSessionService.sendMessage(sessionId, userEmail, request);
    }

    // ── A viewer's app signals they joined the session ─────────────────────────
    @MessageMapping("/session/{sessionId}/join")
    public void handleViewerJoin(@DestinationVariable UUID sessionId) {
        liveSessionService.viewerJoined(sessionId);
    }

    // ── A viewer's app signals they left the session ───────────────────────────
    @MessageMapping("/session/{sessionId}/leave")
    public void handleViewerLeave(@DestinationVariable UUID sessionId) {
        liveSessionService.viewerLeft(sessionId);
    }
}
