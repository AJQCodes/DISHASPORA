package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "subscription_plans")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(name = "plan_type", nullable = false, columnDefinition = "plan_type")
    private PlanType planType;

    @Column(name = "price_monthly", nullable = false)
    @Builder.Default
    private double priceMonthly = 0.0;

    @Column(name = "price_annual", nullable = false)
    @Builder.Default
    private double priceAnnual = 0.0;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "has_video_access", nullable = false)
    @Builder.Default
    private boolean hasVideoAccess = false;

    @Column(name = "has_audio_access", nullable = false)
    @Builder.Default
    private boolean hasAudioAccess = false;

    @Column(name = "has_chat_support", nullable = false)
    @Builder.Default
    private boolean hasChatSupport = false;

    @Column(name = "has_ad_free", nullable = false)
    @Builder.Default
    private boolean hasAdFree = false;

    @Column(name = "max_listings")
    private Integer maxListings;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum PlanType { free, premium, vendor_basic, vendor_pro }
}
