package com.dishaspora.repository;

import com.dishaspora.entity.Recipe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface RecipeRepository extends JpaRepository<Recipe, UUID> {

    List<Recipe> findByApprovalStatus(Recipe.ApprovalStatus status);

    List<Recipe> findByApprovalStatusAndCountry(Recipe.ApprovalStatus status, String country);

    List<Recipe> findByApprovalStatusAndCategory(Recipe.ApprovalStatus status, Recipe.Category category);

    List<Recipe> findByApprovalStatusAndCategoryAndCountry(
            Recipe.ApprovalStatus status, Recipe.Category category, String country);

    @Query("SELECT r FROM Recipe r WHERE r.approvalStatus = com.dishaspora.entity.Recipe.ApprovalStatus.APPROVED ORDER BY r.averageRating DESC")
    List<Recipe> findPopular();

    @Query("SELECT r FROM Recipe r WHERE r.approvalStatus = com.dishaspora.entity.Recipe.ApprovalStatus.APPROVED AND " +
           "(LOWER(r.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(r.culturalOrigin) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Recipe> search(@Param("q") String q);
}
