package com.dishaspora.recipe.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "cooked_recipes", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "recipeId"}))
public class CookedRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long recipeId;

    /** Denormalized from the recipe for fast passport grouping. */
    private String countryOfOrigin;

    @Column(nullable = false)
    private Instant cookedAt = Instant.now();

    public CookedRecipe() {}

    public CookedRecipe(Long userId, Long recipeId, String countryOfOrigin) {
        this.userId = userId;
        this.recipeId = recipeId;
        this.countryOfOrigin = countryOfOrigin;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getRecipeId() { return recipeId; }
    public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }
    public String getCountryOfOrigin() { return countryOfOrigin; }
    public void setCountryOfOrigin(String countryOfOrigin) { this.countryOfOrigin = countryOfOrigin; }
    public Instant getCookedAt() { return cookedAt; }
    public void setCookedAt(Instant cookedAt) { this.cookedAt = cookedAt; }
}
