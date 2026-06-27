package com.dishaspora.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ingredient_listings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class IngredientListing {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false, length = 50)
    private String unit;

    @Column(name = "quantity_available", nullable = false)
    @Builder.Default
    private int stockQuantity = 0;

    @Column(name = "image_url")
    private String imageUrl;

    // country as plain String
    @Column(nullable = false)
    @Builder.Default
    private String country = "";

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, columnDefinition = "approval_status")
    @Builder.Default
    private Vendor.ApprovalStatus approvalStatus = Vendor.ApprovalStatus.pending;

    @Column(name = "admin_notes", columnDefinition = "TEXT")
    private String adminNotes;

    @Column(name = "is_featured", nullable = false)
    @Builder.Default
    private boolean featured = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Convenience — ingredient listings don't have availability_status in DB,
    // so we derive availability from stockQuantity
    public boolean isAvailable() {
        return stockQuantity > 0;
    }
}
