package com.dishaspora.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "food_listings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FoodListing {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(nullable = false)
    private String name;

    // Keep getTitle() for backward compatibility with OrderItem.getItemTitle()
    public String getTitle() { return name; }

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private double price;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    // Maps to DB's availability_status column
    @Column(name = "availability_status", nullable = false, length = 20)
    @Builder.Default
    private String availabilityStatus = "available";

    @Column(name = "quantity_available")
    @Builder.Default
    private int stockQuantity = 0;

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

    @Column(name = "average_rating")
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

    // Convenience method for availability check
    public boolean isAvailable() {
        return "available".equals(availabilityStatus);
    }
}
