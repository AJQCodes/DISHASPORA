package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// NutritionLogMeal.java
// A single meal entry inside a daily NutritionLog
// e.g. "Lunch — Jollof Rice — 320 kcal"
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "nutrition_log_meals")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NutritionLogMeal {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // ── Which day's log this meal belongs to ──────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "log_id", nullable = false)
    private NutritionLog log;

    // ── Which recipe was eaten (optional — could be a custom meal too) ────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipe_id")
    private Recipe recipe;

    // ── Display name shown to the user, e.g. "Jollof Rice" ────────────────────
    @Column(nullable = false)
    private String recipeName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MealType mealType;

    @Column(nullable = false)
    private int servings;

    // ── Nutrition values captured at the moment of logging ────────────────────
    // (multiplied by servings already, ready to sum directly)
    @Column(nullable = false)
    private int calories;

    @Column(nullable = false)
    private double protein;

    @Column(nullable = false)
    private double carbs;

    @Column(nullable = false)
    private double fat;

    public enum MealType { BREAKFAST, LUNCH, DINNER, SNACK }
}
