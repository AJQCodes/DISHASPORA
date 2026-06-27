package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// RecipeStep.java
// Matches the database teammate's recipe_steps table
// Each recipe has many steps in order
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "recipe_steps")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecipeStep {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @Column(nullable = false)
    private int stepNumber;     // 1, 2, 3...

    @Column(nullable = false, length = 1000)
    private String instruction; // e.g. "Blend tomatoes and onion"

    private String tip;         // optional extra tip for this step
}
