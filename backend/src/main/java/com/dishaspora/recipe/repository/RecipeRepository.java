package com.dishaspora.recipe.repository;

import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.recipe.entity.Recipe;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.Instant;
import java.util.List;

public interface RecipeRepository extends JpaRepository<Recipe, Long>, JpaSpecificationExecutor<Recipe> {

    List<Recipe> findByStatus(ApprovalStatus status);

    List<Recipe> findByStatusOrderByRatingDesc(ApprovalStatus status, Pageable pageable);

    List<Recipe> findByVendorId(Long vendorId);

    boolean existsByTitleIgnoreCase(String title);

    long countByStatusAndCountryOfOrigin(ApprovalStatus status, String countryOfOrigin);

    long countByVendorIdAndCreatedAtAfter(Long vendorId, Instant after);

    long countByStatus(ApprovalStatus status);
}
