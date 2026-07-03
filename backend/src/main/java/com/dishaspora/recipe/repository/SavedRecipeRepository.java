package com.dishaspora.recipe.repository;

import com.dishaspora.recipe.entity.SavedRecipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedRecipeRepository extends JpaRepository<SavedRecipe, Long> {

    Optional<SavedRecipe> findByUserIdAndRecipeId(Long userId, Long recipeId);

    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    List<SavedRecipe> findByUserIdOrderByCreatedAtDesc(Long userId);
}
