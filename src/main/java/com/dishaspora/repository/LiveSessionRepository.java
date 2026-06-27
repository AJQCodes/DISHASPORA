package com.dishaspora.repository;

import com.dishaspora.entity.LiveSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// LiveSessionRepository.java
// Database queries for live cooking sessions
// ─────────────────────────────────────────────────────────────────────────────
public interface LiveSessionRepository extends JpaRepository<LiveSession, UUID> {

    // ── All sessions currently broadcasting ─────────────────────────────────────
    List<LiveSession> findByStatus(LiveSession.Status status);
}
