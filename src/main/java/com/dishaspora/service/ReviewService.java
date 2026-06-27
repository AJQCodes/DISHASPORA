package com.dishaspora.service;

import com.dishaspora.dto.ReviewRequest;
import com.dishaspora.dto.ReviewResponse;
import com.dishaspora.entity.Recipe;
import com.dishaspora.entity.Review;
import com.dishaspora.entity.User;
import com.dishaspora.entity.Vendor;
import com.dishaspora.repository.RecipeRepository;
import com.dishaspora.repository.ReviewRepository;
import com.dishaspora.repository.UserRepository;
import com.dishaspora.repository.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository    reviewRepository;
    private final UserRepository      userRepository;
    private final RecipeRepository    recipeRepository;
    private final VendorRepository    vendorRepository;

    // ── Get all reviews for a recipe ──────────────────────────────────────────
    public List<ReviewResponse> getRecipeReviews(UUID recipeId) {
        return reviewRepository.findByRecipeIdOrderByCreatedAtDesc(recipeId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Get all reviews for a vendor ──────────────────────────────────────────
    public List<ReviewResponse> getVendorReviews(UUID vendorId) {
        return reviewRepository.findByVendorIdOrderByCreatedAtDesc(vendorId)
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Submit a review (recipe OR vendor) ────────────────────────────────────
    public ReviewResponse submitReview(String email, ReviewRequest request) {
        User user = getUser(email);

        if (request.recipeId() == null && request.vendorId() == null) {
            throw new IllegalArgumentException("Review must target either a recipe or a vendor");
        }

        Review.ReviewBuilder builder = Review.builder()
                .user(user)
                .rating(request.rating())
                .comment(request.comment());

        if (request.recipeId() != null) {
            Recipe recipe = recipeRepository.findById(UUID.fromString(request.recipeId()))
                    .orElseThrow(() -> new RuntimeException("Recipe not found"));
            // One review per user per recipe
            if (reviewRepository.existsByUserIdAndRecipeId(user.getId(), recipe.getId())) {
                throw new IllegalArgumentException("You have already reviewed this recipe");
            }
            builder.recipe(recipe);
        } else {
            Vendor vendor = vendorRepository.findById(UUID.fromString(request.vendorId()))
                    .orElseThrow(() -> new RuntimeException("Vendor not found"));
            if (reviewRepository.existsByUserIdAndVendorId(user.getId(), vendor.getId())) {
                throw new IllegalArgumentException("You have already reviewed this vendor");
            }
            builder.vendor(vendor);
        }

        // NOTE: average_rating and review_count on recipes/vendors are updated
        // automatically by the DB triggers in 014_create_triggers.sql
        Review saved = reviewRepository.save(builder.build());
        return toResponse(saved);
    }

    // ── Delete a review (user deletes their own) ──────────────────────────────
    public void deleteReview(String email, UUID reviewId) {
        User user = getUser(email);
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        if (!review.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You can only delete your own reviews");
        }
        reviewRepository.delete(review);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private ReviewResponse toResponse(Review r) {
        return new ReviewResponse(
                r.getId().toString(),
                r.getUser().getName(),
                r.getRating(),
                r.getComment(),
                r.getCreatedAt().toString()
        );
    }
}
