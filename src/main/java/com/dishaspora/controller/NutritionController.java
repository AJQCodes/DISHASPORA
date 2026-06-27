package com.dishaspora.controller;

import com.dishaspora.dto.LogMealRequest;
import com.dishaspora.dto.NutritionLogResponse;
import com.dishaspora.service.NutritionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// NutritionController.java
// FIX: Now uses proper DTOs and real persisted data instead of hardcoded values.
// All endpoints require a valid JWT token (the logged-in user).
// ─────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/nutrition")
@RequiredArgsConstructor
public class NutritionController {

    private final NutritionService nutritionService;

    // ── GET /api/nutrition/today ────────────────────────────────────────────────
    // Returns the logged-in user's real nutrition totals for today
    @GetMapping("/today")
    public ResponseEntity<NutritionLogResponse> getTodayLog(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(nutritionService.getTodayLog(userDetails.getUsername()));
    }

    // ── POST /api/nutrition/log ─────────────────────────────────────────────────
    // Body: { recipeId, servings, mealType } OR { recipeName, calories, protein, carbs, fat, mealType }
    @PostMapping("/log")
    public ResponseEntity<NutritionLogResponse> logMeal(
            @Valid @RequestBody LogMealRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(nutritionService.logMeal(userDetails.getUsername(), request));
    }

    // ── DELETE /api/nutrition/log/{mealId} ──────────────────────────────────────
    // Removes a previously logged meal from today's log
    @DeleteMapping("/log/{mealId}")
    public ResponseEntity<NutritionLogResponse> removeMeal(
            @PathVariable UUID mealId,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(nutritionService.removeMeal(userDetails.getUsername(), mealId));
    }

    // ── GET /api/nutrition/history?days=7 ───────────────────────────────────────
    // Returns the user's real logged history over the last N days
    @GetMapping("/history")
    public ResponseEntity<List<NutritionLogResponse>> getHistory(
            @RequestParam(defaultValue = "7") int days,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(nutritionService.getHistory(userDetails.getUsername(), days));
    }
}
