package com.dishaspora.repository;
import com.dishaspora.entity.RecipeStep;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RecipeStepRepository extends JpaRepository<RecipeStep, UUID> {
    List<RecipeStep> findByRecipeIdOrderByStepNumberAsc(UUID recipeId);
}
