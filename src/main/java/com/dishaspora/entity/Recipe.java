package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// Recipe.java
// Updated to match the database teammate's table structure:
//   recipes           — main recipe data
//   recipe_ingredients — separate table for ingredients
//   recipe_steps       — separate table for steps
//   recipe_media       — separate table for video/audio/images
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "recipes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private String culturalOrigin;

    @Column(nullable = false)
    private int calories;

    @Column(nullable = false)
    @Builder.Default
    private double protein = 0;

    @Column(nullable = false)
    @Builder.Default
    private double carbs = 0;

    @Column(nullable = false)
    @Builder.Default
    private double fat = 0;

    @Column(nullable = false)
    private int cookTime;

    @Column(nullable = false)
    private int servings;

    private String mealFrequency;

    // ── Cached rating fields — updated automatically by DB triggers ───────────
    // (014_create_triggers.sql fires after every review insert/update/delete)
    @Column(name = "average_rating", nullable = false)
    @Builder.Default
    private double averageRating = 0.0;

    @Column(name = "review_count", nullable = false)
    @Builder.Default
    private int reviewCount = 0;

    @Column(name = "is_premium", nullable = false)
    @Builder.Default
    private boolean premium = false;

    @Column(nullable = false)
    private String country;

    // ── Cuisine type — links to cuisine_types lookup table ────────────────────
    // Added by 013_create_cuisine_types.sql via ALTER TABLE
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cuisine_type_id")
    private CuisineType cuisineType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ApprovalStatus approvalStatus = ApprovalStatus.PENDING;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    // ── recipe_ingredients table ──────────────────────────────────────────────
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @Builder.Default
    private List<RecipeIngredient> ingredients = new ArrayList<>();

    // ── recipe_steps table ────────────────────────────────────────────────────
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @OrderBy("stepNumber ASC")
    @Builder.Default
    private List<RecipeStep> steps = new ArrayList<>();

    // ── recipe_media table ────────────────────────────────────────────────────
    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @Builder.Default
    private List<RecipeMedia> media = new ArrayList<>();

    // ── Helper: get the first video URL from media list ───────────────────────
    public String getVideoUrl() {
        return media.stream()
                .filter(m -> "VIDEO".equals(m.getMediaType()))
                .map(RecipeMedia::getMediaUrl)
                .findFirst().orElse(null);
    }

    // ── Helper: get the first audio URL from media list ───────────────────────
    public String getAudioUrl() {
        return media.stream()
                .filter(m -> "AUDIO".equals(m.getMediaType()))
                .map(RecipeMedia::getMediaUrl)
                .findFirst().orElse(null);
    }

    public enum Category { LOCAL, CONTINENTAL, FOREIGN, DRINKS }
    public enum ApprovalStatus { PENDING, APPROVED, REJECTED }
}
