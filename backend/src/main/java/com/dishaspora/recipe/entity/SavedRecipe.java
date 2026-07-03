package com.dishaspora.recipe.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "saved_recipes", uniqueConstraints = @UniqueConstraint(columnNames = {"userId", "recipeId"}))
public class SavedRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long recipeId;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public SavedRecipe() {}

    public SavedRecipe(Long userId, Long recipeId) {
        this.userId = userId;
        this.recipeId = recipeId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getRecipeId() { return recipeId; }
    public void setRecipeId(Long recipeId) { this.recipeId = recipeId; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
