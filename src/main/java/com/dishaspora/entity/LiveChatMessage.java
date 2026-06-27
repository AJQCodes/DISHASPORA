package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// LiveChatMessage.java
// A single chat message sent during a live session — like TikTok Live
// comments scrolling up the screen.
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "live_chat_messages")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class LiveChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private LiveSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String message;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime sentAt = LocalDateTime.now();
}
