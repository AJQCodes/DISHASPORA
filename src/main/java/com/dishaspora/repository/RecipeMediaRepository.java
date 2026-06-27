package com.dishaspora.repository;
import com.dishaspora.entity.RecipeMedia;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface RecipeMediaRepository extends JpaRepository<RecipeMedia, UUID> {
    List<RecipeMedia> findByRecipeId(UUID recipeId);
    List<RecipeMedia> findByRecipeIdAndMediaType(UUID recipeId, String mediaType);
}
