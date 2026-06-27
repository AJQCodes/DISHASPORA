package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// SavedRecipe.java
// Matches the database teammate's saved_recipes table
// A user can bookmark/save any recipe for quick access later
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "saved_recipes",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "recipe_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SavedRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // ── The user who saved this recipe ────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ── The recipe that was saved ─────────────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime savedAt = LocalDateTime.now();
}
