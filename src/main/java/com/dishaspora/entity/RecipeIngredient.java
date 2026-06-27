package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// RecipeIngredient.java
// Matches the database teammate's recipe_ingredients table
// Each recipe has many ingredient rows
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "recipe_ingredients")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RecipeIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id", nullable = false)
    private Recipe recipe;

    @Column(nullable = false)
    private String ingredient;  // e.g. "2 cups parboiled rice"

    private String quantity;    // e.g. "2 cups"
    private String unit;        // e.g. "cups"
    private String name;        // e.g. "parboiled rice"
}
