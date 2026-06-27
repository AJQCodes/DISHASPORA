package com.dishaspora.controller;

import com.dishaspora.dto.ReviewRequest;
import com.dishaspora.dto.ReviewResponse;
import com.dishaspora.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // GET /api/reviews/recipe/{recipeId}
    @GetMapping("/recipe/{recipeId}")
    public ResponseEntity<List<ReviewResponse>> getRecipeReviews(@PathVariable UUID recipeId) {
        return ResponseEntity.ok(reviewService.getRecipeReviews(recipeId));
    }

    // GET /api/reviews/vendor/{vendorId}
    @GetMapping("/vendor/{vendorId}")
    public ResponseEntity<List<ReviewResponse>> getVendorReviews(@PathVariable UUID vendorId) {
        return ResponseEntity.ok(reviewService.getVendorReviews(vendorId));
    }

    // POST /api/reviews
    @PostMapping
    public ResponseEntity<ReviewResponse> submitReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.submitReview(userDetails.getUsername(), request));
    }

    // DELETE /api/reviews/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        reviewService.deleteReview(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
