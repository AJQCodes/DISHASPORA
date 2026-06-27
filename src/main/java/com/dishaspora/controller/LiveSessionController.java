package com.dishaspora.controller;

import com.dishaspora.dto.ChatMessageBroadcast;
import com.dishaspora.dto.LiveSessionResponse;
import com.dishaspora.dto.StartSessionRequest;
import com.dishaspora.service.LiveSessionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// LiveSessionController.java
// Normal REST endpoints for live sessions — starting/ending a session,
// listing what's currently live, and fetching chat history.
//
// The REAL-TIME parts (new messages, viewer count updates) happen over the
// WebSocket connection — see LiveChatController and WebSocketConfig.
// This controller is just for the regular request/response parts.
// ─────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/live")
@RequiredArgsConstructor
public class LiveSessionController {

    private final LiveSessionService liveSessionService;

    // ── POST /api/live/sessions — chef/admin starts a new live session ────────
    @PostMapping("/sessions")
    public ResponseEntity<LiveSessionResponse> startSession(
            @Valid @RequestBody StartSessionRequest request) {
        return ResponseEntity.ok(liveSessionService.startSession(request));
    }

    // ── POST /api/live/sessions/{id}/end ────────────────────────────────────────
    @PostMapping("/sessions/{id}/end")
    public ResponseEntity<LiveSessionResponse> endSession(@PathVariable UUID id) {
        return ResponseEntity.ok(liveSessionService.endSession(id));
    }

    // ── GET /api/live/sessions — what's currently live right now ───────────────
    // Used by the Learn screen to show "Chef Kofi is live now"
    @GetMapping("/sessions")
    public ResponseEntity<List<LiveSessionResponse>> getLiveSessions() {
        return ResponseEntity.ok(liveSessionService.getLiveSessions());
    }

    // ── GET /api/live/sessions/{id} ─────────────────────────────────────────────
    @GetMapping("/sessions/{id}")
    public ResponseEntity<LiveSessionResponse> getSession(@PathVariable UUID id) {
        return ResponseEntity.ok(liveSessionService.getSessionDetails(id));
    }

    // ── GET /api/live/sessions/{id}/messages ────────────────────────────────────
    // Used when a viewer joins partway through — loads chat history so far
    @GetMapping("/sessions/{id}/messages")
    public ResponseEntity<List<ChatMessageBroadcast>> getMessages(@PathVariable UUID id) {
        return ResponseEntity.ok(liveSessionService.getRecentMessages(id));
    }
}
