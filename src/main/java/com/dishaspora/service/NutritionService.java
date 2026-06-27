package com.dishaspora.service;

import com.dishaspora.dto.LogMealRequest;
import com.dishaspora.dto.MealEntryResponse;
import com.dishaspora.dto.NutritionLogResponse;
import com.dishaspora.entity.NutritionLog;
import com.dishaspora.entity.NutritionLogMeal;
import com.dishaspora.entity.Recipe;
import com.dishaspora.entity.User;
import com.dishaspora.repository.NutritionLogRepository;
import com.dishaspora.repository.RecipeRepository;
import com.dishaspora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// ─────────────────────────────────────────────────────────────────────────────
// NutritionService.java
// FIX: This previously returned hardcoded fake numbers (1240 kcal, 62g protein
// etc.) regardless of what the user actually logged. Now it persists real
// meal entries to the database and calculates true daily totals.
// ─────────────────────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
public class NutritionService {

    private final UserRepository          userRepository;
    private final RecipeRepository        recipeRepository;
    private final NutritionLogRepository  nutritionLogRepository;

    // ── Get today's nutrition log for the logged-in user ───────────────────────
    // Creates an empty log if one doesn't exist yet for today
    public NutritionLogResponse getTodayLog(String email) {
        User user = getUser(email);
        LocalDate today = LocalDate.now();

        NutritionLog log = nutritionLogRepository
                .findByUserIdAndDate(user.getId(), today)
                .orElseGet(() -> createEmptyLog(user, today));

        return toResponse(log);
    }

    // ── Log a meal — either from a recipe, or a custom manual entry ───────────
    public NutritionLogResponse logMeal(String email, LogMealRequest request) {
        User user = getUser(email);
        LocalDate today = LocalDate.now();

        // ── Find today's log, or create a new one if this is the first meal ────
        NutritionLog log = nutritionLogRepository
                .findByUserIdAndDate(user.getId(), today)
                .orElseGet(() -> createEmptyLog(user, today));

        // ── Determine nutrition values: from a linked recipe, or manual entry ──
        int    calories;
        double protein, carbs, fat;
        String recipeName;
        Recipe recipe = null;

        if (request.recipeId() != null && !request.recipeId().isBlank()) {
            // ── Logging a real recipe — pull its nutrition data and multiply by servings ──
            recipe = recipeRepository.findById(UUID.fromString(request.recipeId()))
                    .orElseThrow(() -> new RuntimeException("Recipe not found"));

            calories   = recipe.getCalories() * request.servings();
            protein    = recipe.getProtein()  * request.servings();
            carbs      = recipe.getCarbs()    * request.servings();
            fat        = recipe.getFat()      * request.servings();
            recipeName = recipe.getTitle();

        } else {
            // ── Custom/manual meal entry — use whatever the user typed in ──────
            calories   = request.calories()   != null ? request.calories()   : 0;
            protein    = request.protein()    != null ? request.protein()    : 0;
            carbs      = request.carbs()      != null ? request.carbs()      : 0;
            fat        = request.fat()        != null ? request.fat()        : 0;
            recipeName = request.recipeName() != null ? request.recipeName() : "Custom meal";
        }

        // ── Build and attach the new meal entry ─────────────────────────────────
        NutritionLogMeal meal = NutritionLogMeal.builder()
                .log(log)
                .recipe(recipe)
                .recipeName(recipeName)
                .mealType(NutritionLogMeal.MealType.valueOf(request.mealType().toUpperCase()))
                .servings(request.servings())
                .calories(calories)
                .protein(protein)
                .carbs(carbs)
                .fat(fat)
                .build();

        log.getMeals().add(meal);

        // ── Recalculate the day's totals from all meals (including the new one) ──
        log.recalculateTotals();

        NutritionLog saved = nutritionLogRepository.save(log);
        return toResponse(saved);
    }

    // ── Remove a logged meal (e.g. user made a mistake) ────────────────────────
    public NutritionLogResponse removeMeal(String email, UUID mealId) {
        User user = getUser(email);
        LocalDate today = LocalDate.now();

        NutritionLog log = nutritionLogRepository
                .findByUserIdAndDate(user.getId(), today)
                .orElseThrow(() -> new RuntimeException("No log found for today"));

        log.getMeals().removeIf(m -> m.getId().equals(mealId));
        log.recalculateTotals();

        NutritionLog saved = nutritionLogRepository.save(log);
        return toResponse(saved);
    }

    // ── Get a user's nutrition history over the last N days ────────────────────
    public List<NutritionLogResponse> getHistory(String email, int days) {
        User user = getUser(email);
        LocalDate end   = LocalDate.now();
        LocalDate start = end.minusDays(days);

        return nutritionLogRepository
                .findByUserIdAndDateBetweenOrderByDateDesc(user.getId(), start, end)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ── Helper: look up the authenticated user ──────────────────────────────────
    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    // ── Helper: create a fresh empty log for a new day ──────────────────────────
    private NutritionLog createEmptyLog(User user, LocalDate date) {
        NutritionLog log = NutritionLog.builder()
                .user(user)
                .date(date)
                .build();
        return nutritionLogRepository.save(log);
    }

    // ── Helper: convert entity → response DTO for the frontend ────────────────
    private NutritionLogResponse toResponse(NutritionLog log) {
        List<MealEntryResponse> mealResponses = log.getMeals().stream()
                .map(m -> new MealEntryResponse(
                        m.getId().toString(),
                        m.getRecipeName(),
                        m.getMealType().name().toLowerCase(),
                        m.getServings(),
                        m.getCalories(),
                        m.getProtein(),
                        m.getCarbs(),
                        m.getFat()
                ))
                .collect(Collectors.toList());

        return new NutritionLogResponse(
                log.getId().toString(),
                log.getDate().toString(),
                log.getTotalCalories(),
                log.getTotalProtein(),
                log.getTotalCarbs(),
                log.getTotalFat(),
                mealResponses
        );
    }
}
