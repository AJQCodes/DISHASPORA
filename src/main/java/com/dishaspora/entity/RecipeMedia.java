package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// RecipeMedia.java
// Matches the database teammate's recipe_media table
// Stores video, audio, and image URLs for a recipe
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "recipe_media")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecipeMedia {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    // ── Media type: VIDEO, AUDIO, or IMAGE ────────────────────────────────────
    @Column(nullable = false)
    private String mediaType;

    // ── The actual URL from Cloudinary or wherever it's hosted ────────────────
    @Column(nullable = false)
    private String mediaUrl;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime uploadedAt = LocalDateTime.now();
}
