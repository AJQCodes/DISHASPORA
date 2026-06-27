package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// VendorDocument.java
// Matches the database teammate's vendor_documents table
// Stores verification documents submitted by vendors when registering
// e.g. business registration certificate, ID, food handling permit
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "vendor_documents")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class VendorDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // ── Which vendor submitted this document ──────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    // ── Type of document: BUSINESS_REG, NATIONAL_ID, FOOD_PERMIT, OTHER ──────
    @Column(nullable = false)
    private String documentType;

    // ── URL where the document file is stored (e.g. Cloudinary) ─────────────
    @Column(nullable = false)
    private String documentUrl;

    // ── Admin reviews the document and marks it verified or rejected ──────────
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    private String rejectionReason;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();

    public enum VerificationStatus { PENDING, VERIFIED, REJECTED }
}
