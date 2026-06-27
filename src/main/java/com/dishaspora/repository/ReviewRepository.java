package com.dishaspora.repository;

import com.dishaspora.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {
    List<Review> findByRecipeIdOrderByCreatedAtDesc(UUID recipeId);
    List<Review> findByVendorIdOrderByCreatedAtDesc(UUID vendorId);
    List<Review> findByUserId(UUID userId);
    boolean existsByUserIdAndRecipeId(UUID userId, UUID recipeId);
    boolean existsByUserIdAndVendorId(UUID userId, UUID vendorId);
}
