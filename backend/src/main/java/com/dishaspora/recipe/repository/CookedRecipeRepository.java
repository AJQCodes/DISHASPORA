package com.dishaspora.recipe.repository;

import com.dishaspora.recipe.entity.CookedRecipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CookedRecipeRepository extends JpaRepository<CookedRecipe, Long> {

    Optional<CookedRecipe> findByUserIdAndRecipeId(Long userId, Long recipeId);

    boolean existsByUserIdAndRecipeId(Long userId, Long recipeId);

    List<CookedRecipe> findByUserId(Long userId);

    List<CookedRecipe> findByUserIdAndCountryOfOrigin(Long userId, String countryOfOrigin);
}
