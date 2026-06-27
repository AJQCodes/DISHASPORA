package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

// Matches content_flags table from 010_create_admin_actions.sql
// Flagged content feeding into the admin moderation queue
@Entity
@Table(name = "content_flags")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ContentFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by", nullable = false)
    private User reportedBy;

    // ── What was flagged ──────────────────────────────────────────────────────
    @Column(nullable = false)
    private String targetType; // e.g. RECIPE, VENDOR, REVIEW

    @Column(nullable = false)
    private UUID targetId;

    @Column(nullable = false)
    private String reason; // why it was flagged

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private FlagStatus status = FlagStatus.PENDING;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum FlagStatus { PENDING, REVIEWED, DISMISSED }
}
