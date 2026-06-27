package com.dishaspora.service;

import com.dishaspora.dto.*;
import com.dishaspora.entity.LiveChatMessage;
import com.dishaspora.entity.LiveSession;
import com.dishaspora.entity.User;
import com.dishaspora.repository.LiveChatMessageRepository;
import com.dishaspora.repository.LiveSessionRepository;
import com.dishaspora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// ─────────────────────────────────────────────────────────────────────────────
// LiveSessionService.java
// Business logic for live cooking sessions: starting/ending sessions,
// tracking viewer counts, and broadcasting chat messages in real time.
//
// SimpMessagingTemplate is how the backend pushes a message OUT to every
// connected client subscribed to a topic — this is the real-time part.
// ─────────────────────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
public class LiveSessionService {

    private final LiveSessionRepository      sessionRepository;
    private final LiveChatMessageRepository  chatMessageRepository;
    private final UserRepository              userRepository;
    private final SimpMessagingTemplate        messagingTemplate;

    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("h:mm a");

    // ── Start a new live session (called by a chef/admin) ──────────────────────
    public LiveSessionResponse startSession(StartSessionRequest request) {
        LiveSession session = LiveSession.builder()
                .title(request.title())
                .hostName(request.hostName())
                .videoUrl(request.videoUrl())
                .status(LiveSession.Status.LIVE)
                .build();

        LiveSession saved = sessionRepository.save(session);
        return toResponse(saved);
    }

    // ── End a live session ──────────────────────────────────────────────────────
    public LiveSessionResponse endSession(UUID sessionId) {
        LiveSession session = getSession(sessionId);
        session.setStatus(LiveSession.Status.ENDED);
        session.setEndedAt(LocalDateTime.now());
        LiveSession saved = sessionRepository.save(session);

        // ── Tell every connected viewer the session has ended ──────────────────
        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/status",
                "ENDED"
        );

        return toResponse(saved);
    }

    // ── Get all sessions currently live ─────────────────────────────────────────
    public List<LiveSessionResponse> getLiveSessions() {
        return sessionRepository.findByStatus(LiveSession.Status.LIVE)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── Get one session's details ───────────────────────────────────────────────
    public LiveSessionResponse getSessionDetails(UUID sessionId) {
        return toResponse(getSession(sessionId));
    }

    // ── A viewer joins — increments the count and broadcasts the new total ────
    public void viewerJoined(UUID sessionId) {
        LiveSession session = getSession(sessionId);
        session.addViewer();
        sessionRepository.save(session);
        broadcastViewerCount(session);
    }

    // ── A viewer leaves — decrements the count and broadcasts the new total ───
    public void viewerLeft(UUID sessionId) {
        LiveSession session = getSession(sessionId);
        session.removeViewer();
        sessionRepository.save(session);
        broadcastViewerCount(session);
    }

    // ── Get recent chat history (used when a viewer first joins mid-session) ──
    public List<ChatMessageBroadcast> getRecentMessages(UUID sessionId) {
        List<LiveChatMessage> messages = chatMessageRepository
                .findBySessionIdOrderBySentAtAsc(sessionId);

        return messages.stream()
                .map(this::toChatBroadcast)
                .collect(Collectors.toList());
    }

    // ── Send a chat message — saves it AND broadcasts it instantly ────────────
    // This is the core of the "live chat" feature: every connected viewer
    // sees this message appear immediately, the same as TikTok Live comments
    public void sendMessage(UUID sessionId, String userEmail, SendChatMessageRequest request) {
        LiveSession session = getSession(sessionId);

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        LiveChatMessage message = LiveChatMessage.builder()
                .session(session)
                .user(user)
                .message(request.message())
                .build();

        LiveChatMessage saved = chatMessageRepository.save(message);

        // ── Broadcast to everyone subscribed to this session's chat topic ─────
        ChatMessageBroadcast broadcast = toChatBroadcast(saved);
        messagingTemplate.convertAndSend(
                "/topic/session/" + sessionId + "/chat",
                broadcast
        );
    }

    // ── Helper: broadcast the current viewer count to everyone watching ────────
    private void broadcastViewerCount(LiveSession session) {
        ViewerCountBroadcast broadcast = new ViewerCountBroadcast(
                session.getCurrentViewers(),
                session.getPeakViewers()
        );
        messagingTemplate.convertAndSend(
                "/topic/session/" + session.getId() + "/viewers",
                broadcast
        );
    }

    // ── Helper: look up a session or throw ──────────────────────────────────────
    private LiveSession getSession(UUID sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Live session not found"));
    }

    // ── Helper: convert entity → response DTO ──────────────────────────────────
    private LiveSessionResponse toResponse(LiveSession session) {
        return new LiveSessionResponse(
                session.getId().toString(),
                session.getTitle(),
                session.getHostName(),
                session.getVideoUrl(),
                session.getStatus().name(),
                session.getCurrentViewers(),
                session.getPeakViewers(),
                session.getStartedAt().toString()
        );
    }

    // ── Helper: convert a chat message entity → broadcast DTO ─────────────────
    private ChatMessageBroadcast toChatBroadcast(LiveChatMessage message) {
        return new ChatMessageBroadcast(
                message.getId().toString(),
                message.getUser().getName(),
                message.getMessage(),
                message.getSentAt().format(TIME_FORMAT)
        );
    }
}
