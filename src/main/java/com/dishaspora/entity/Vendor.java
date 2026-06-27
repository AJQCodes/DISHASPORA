package com.dishaspora.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "vendor_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "business_name", nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cultural_specialty")
    private String culturalSpecialty;

    // country stored as plain String for simplicity
    @Column(nullable = false)
    @Builder.Default
    private String country = "";

    @Column(name = "location")
    private String city;

    @Column(name = "contact_info")
    private String contactInfo;

    // Approval workflow
    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, columnDefinition = "approval_status")
    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.pending;

    @Column(name = "admin_feedback", columnDefinition = "TEXT")
    private String rejectionReason;

    // Cached ratings — updated by DB trigger
    @Column(name = "average_rating", nullable = false)
    @Builder.Default
    private double averageRating = 0.0;

    @Column(name = "review_count", nullable = false)
    @Builder.Default
    private int reviewCount = 0;

    @Column(name = "is_featured", nullable = false)
    @Builder.Default
    private boolean featured = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    // ── Enums matching DB ENUM types ───────────────────────────────────────────
    public enum ApprovalStatus { pending, approved, rejected, suspended }

    // ── Convenience helpers ───────────────────────────────────────────────────
    public boolean isApproved() {
        return this.approvalStatus == ApprovalStatus.approved;
    }

    public UUID getUserId() {
        return user != null ? user.getId() : null;
    }
}
