package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// LiveSession.java
// Represents one "live cooking session" — e.g. Chef Kofi going live to teach
// Waakye. Viewers join this session's chat room and see the viewer count.
//
// NOTE: this tracks the SESSION and its CHAT in real time via WebSockets.
// The actual video shown during a session is a pre-recorded/embedded video
// (see videoUrl) — true live camera broadcasting would need a service like
// Agora or Mux, which is out of scope here (see chat discussion).
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "live_sessions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LiveSession {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;              // e.g. "Live: How to make Waakye"

    @Column(nullable = false)
    private String hostName;           // e.g. "Chef Kofi"

    // ── The video that plays during this "live" session ────────────────────────
    private String videoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private Status status = Status.LIVE;

    // ── Running totals, updated as viewers join/leave/chat ─────────────────────
    @Column(nullable = false)
    @Builder.Default
    private int currentViewers = 0;

    @Column(nullable = false)
    @Builder.Default
    private int peakViewers = 0;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime startedAt = LocalDateTime.now();

    private LocalDateTime endedAt;

    public enum Status { LIVE, ENDED }

    // ── Helper: call when a viewer joins ────────────────────────────────────────
    public void addViewer() {
        currentViewers++;
        if (currentViewers > peakViewers) peakViewers = currentViewers;
    }

    // ── Helper: call when a viewer leaves ───────────────────────────────────────
    public void removeViewer() {
        if (currentViewers > 0) currentViewers--;
    }
}
