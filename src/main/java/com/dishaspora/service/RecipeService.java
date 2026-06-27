package com.dishaspora.service;

import com.dishaspora.dto.RecipeRequest;
import com.dishaspora.entity.Recipe;
import com.dishaspora.entity.SavedRecipe;
import com.dishaspora.entity.User;
import com.dishaspora.repository.RecipeRepository;
import com.dishaspora.repository.SavedRecipeRepository;
import com.dishaspora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RecipeService {

    private final RecipeRepository      recipeRepository;
    private final SavedRecipeRepository savedRecipeRepository;
    private final UserRepository        userRepository;

    // ── Browse ────────────────────────────────────────────────────────────────
    public List<Recipe> getAll(String category, String country) {
        if (category != null && country != null) {
            // FIX: was ignoring country when both params were present
            return recipeRepository.findByApprovalStatusAndCategoryAndCountry(
                    Recipe.ApprovalStatus.APPROVED,
                    Recipe.Category.valueOf(category.toUpperCase()),
                    country);
        }
        if (category != null) {
            return recipeRepository.findByApprovalStatusAndCategory(
                    Recipe.ApprovalStatus.APPROVED,
                    Recipe.Category.valueOf(category.toUpperCase()));
        }
        if (country != null) {
            return recipeRepository.findByApprovalStatusAndCountry(
                    Recipe.ApprovalStatus.APPROVED, country);
        }
        return recipeRepository.findByApprovalStatus(Recipe.ApprovalStatus.APPROVED);
    }

    public Recipe getById(UUID id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));
    }

    public List<Recipe> getPopular() {
        return recipeRepository.findPopular();
    }

    public List<Recipe> search(String query) {
        return recipeRepository.search(query);
    }

    // ── Create / Update / Delete ───────────────────────────────────────────────
    public Recipe create(RecipeRequest request) {
        Recipe recipe = Recipe.builder()
                .title(request.title())
                .category(Recipe.Category.valueOf(request.category().toUpperCase()))
                .culturalOrigin(request.culturalOrigin())
                .calories(request.calories())
                .protein(request.protein())
                .carbs(request.carbs())
                .fat(request.fat())
                .cookTime(request.cookTime())
                .servings(request.servings())
                .mealFrequency(request.mealFrequency())
                .premium(request.premium())
                .country(request.country())
                // FIX: approvalStatus always starts PENDING — callers cannot override this
                .approvalStatus(Recipe.ApprovalStatus.PENDING)
                .build();
        return recipeRepository.save(recipe);
    }

    public Recipe update(UUID id, RecipeRequest request) {
        Recipe existing = getById(id);
        existing.setTitle(request.title());
        existing.setCalories(request.calories());
        existing.setProtein(request.protein());
        existing.setCarbs(request.carbs());
        existing.setFat(request.fat());
        existing.setCookTime(request.cookTime());
        existing.setMealFrequency(request.mealFrequency());
        return recipeRepository.save(existing);
    }

    public void delete(UUID id) {
        recipeRepository.deleteById(id);
    }

    // ── Admin approval ─────────────────────────────────────────────────────────
    public List<Recipe> getPending() {
        return recipeRepository.findByApprovalStatus(Recipe.ApprovalStatus.PENDING);
    }

    public Recipe approve(UUID id) {
        Recipe recipe = getById(id);
        recipe.setApprovalStatus(Recipe.ApprovalStatus.APPROVED);
        return recipeRepository.save(recipe);
    }

    public Recipe reject(UUID id) {
        Recipe recipe = getById(id);
        recipe.setApprovalStatus(Recipe.ApprovalStatus.REJECTED);
        return recipeRepository.save(recipe);
    }

    // ── Saved recipes — matches saved_recipes table ────────────────────────────
    public List<SavedRecipe> getSavedRecipes(String email) {
        User user = getUser(email);
        return savedRecipeRepository.findByUserIdOrderBySavedAtDesc(user.getId());
    }

    @Transactional
    public void saveRecipe(String email, UUID recipeId) {
        User user = getUser(email);
        // only save if not already saved
        if (!savedRecipeRepository.existsByUserIdAndRecipeId(user.getId(), recipeId)) {
            Recipe recipe = getById(recipeId);
            SavedRecipe saved = SavedRecipe.builder()
                    .user(user).recipe(recipe).build();
            savedRecipeRepository.save(saved);
        }
    }

    @Transactional
    public void unsaveRecipe(String email, UUID recipeId) {
        User user = getUser(email);
        savedRecipeRepository.deleteByUserIdAndRecipeId(user.getId(), recipeId);
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
