package com.dishaspora.recipe.repository;

import com.dishaspora.recipe.entity.RecipeReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecipeReviewRepository extends JpaRepository<RecipeReview, Long> {

    List<RecipeReview> findByRecipeIdOrderByCreatedAtDesc(Long recipeId);
}
