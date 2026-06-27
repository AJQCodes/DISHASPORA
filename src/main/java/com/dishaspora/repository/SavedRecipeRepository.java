package com.dishaspora.repository;

import com.dishaspora.entity.SavedRecipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SavedRecipeRepository extends JpaRepository<SavedRecipe, UUID> {
    List<SavedRecipe> findByUserIdOrderBySavedAtDesc(UUID userId);
    Optional<SavedRecipe> findByUserIdAndRecipeId(UUID userId, UUID recipeId);
    boolean existsByUserIdAndRecipeId(UUID userId, UUID recipeId);
    void deleteByUserIdAndRecipeId(UUID userId, UUID recipeId);
}
