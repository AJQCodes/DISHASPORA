package com.dishaspora.controller;

import com.dishaspora.dto.RecipeRequest;
import com.dishaspora.entity.Recipe;
import com.dishaspora.entity.SavedRecipe;
import com.dishaspora.service.RecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
public class RecipeController {

    private final RecipeService recipeService;

    // ── Browse recipes ─────────────────────────────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Recipe>> getAll(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String country) {
        return ResponseEntity.ok(recipeService.getAll(category, country));
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Recipe>> getPopular() {
        return ResponseEntity.ok(recipeService.getPopular());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Recipe>> search(@RequestParam String q) {
        return ResponseEntity.ok(recipeService.search(q));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Recipe> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(recipeService.getById(id));
    }

    // ── Create / Update / Delete (vendor and admin only) ───────────────────────
    @PostMapping
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Recipe> create(@Valid @RequestBody RecipeRequest request) {
        return ResponseEntity.ok(recipeService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('VENDOR', 'ADMIN')")
    public ResponseEntity<Recipe> update(@PathVariable UUID id, @Valid @RequestBody RecipeRequest request) {
        return ResponseEntity.ok(recipeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        recipeService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Saved recipes (matches database teammate's saved_recipes table) ─────────
    // GET /api/recipes/saved — get all recipes the logged-in user has saved
    @GetMapping("/saved")
    public ResponseEntity<List<SavedRecipe>> getSaved(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recipeService.getSavedRecipes(userDetails.getUsername()));
    }

    // POST /api/recipes/{id}/save — save a recipe
    @PostMapping("/{id}/save")
    public ResponseEntity<Void> saveRecipe(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        recipeService.saveRecipe(userDetails.getUsername(), id);
        return ResponseEntity.ok().build();
    }

    // DELETE /api/recipes/{id}/save — unsave a recipe
    @DeleteMapping("/{id}/save")
    public ResponseEntity<Void> unsaveRecipe(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserDetails userDetails) {
        recipeService.unsaveRecipe(userDetails.getUsername(), id);
        return ResponseEntity.noContent().build();
    }
}
