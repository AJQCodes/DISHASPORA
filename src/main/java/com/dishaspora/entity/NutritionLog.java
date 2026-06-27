package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// NutritionLog.java
// One log per user per day — tracks total calories and macros consumed
// Contains a list of NutritionLogMeal entries (breakfast, lunch, dinner, snack)
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "nutrition_logs", uniqueConstraints = {
    // ── One log per user per day — prevents duplicate logs for the same date ──
    @UniqueConstraint(columnNames = {"user_id", "log_date"})
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class NutritionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "log_date", nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    @Builder.Default
    private int totalCalories = 0;

    @Column(nullable = false)
    @Builder.Default
    private double totalProtein = 0;

    @Column(nullable = false)
    @Builder.Default
    private double totalCarbs = 0;

    @Column(nullable = false)
    @Builder.Default
    private double totalFat = 0;

    // ── All individual meals logged for this day ──────────────────────────────
    @OneToMany(mappedBy = "log", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @Builder.Default
    private List<NutritionLogMeal> meals = new ArrayList<>();

    // ── Helper: recalculate totals from the meals list ─────────────────────────
    // Call this after adding or removing a meal
    public void recalculateTotals() {
        this.totalCalories = meals.stream().mapToInt(NutritionLogMeal::getCalories).sum();
        this.totalProtein  = meals.stream().mapToDouble(NutritionLogMeal::getProtein).sum();
        this.totalCarbs    = meals.stream().mapToDouble(NutritionLogMeal::getCarbs).sum();
        this.totalFat      = meals.stream().mapToDouble(NutritionLogMeal::getFat).sum();
    }
}
