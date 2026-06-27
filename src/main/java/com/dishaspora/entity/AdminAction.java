package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

// Matches admin_actions table from 010_create_admin_actions.sql
// Audit trail of every admin decision on the platform
@Entity
@Table(name = "admin_actions")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class AdminAction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_id", nullable = false)
    private User admin;

    @Column(nullable = false)
    private String actionType; // e.g. APPROVE_VENDOR, REJECT_RECIPE, BAN_USER

    // ── What entity was acted on ──────────────────────────────────────────────
    @Column(nullable = false)
    private String targetType; // e.g. VENDOR, RECIPE, USER

    @Column(nullable = false)
    private UUID targetId;

    private String reason; // optional note from admin

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
