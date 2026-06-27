package com.dishaspora.repository;

import com.dishaspora.entity.LiveChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// LiveChatMessageRepository.java
// Database queries for live chat messages
// ─────────────────────────────────────────────────────────────────────────────
public interface LiveChatMessageRepository extends JpaRepository<LiveChatMessage, UUID> {

    // ── All messages in a session, oldest first (so chat reads top to bottom) ──
    List<LiveChatMessage> findBySessionIdOrderBySentAtAsc(UUID sessionId);

    // ── Most recent N messages — used when a viewer joins mid-session ──────────
    List<LiveChatMessage> findTop50BySessionIdOrderBySentAtDesc(UUID sessionId);
}
