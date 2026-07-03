package com.dishaspora.recipe.controller;

import com.dishaspora.auth.entity.User;
import com.dishaspora.common.dto.PageDto;
import com.dishaspora.common.dto.ReviewDto;
import com.dishaspora.marketplace.dto.MarketplaceRequests.ReviewRequest;
import com.dishaspora.recipe.dto.BasketDto;
import com.dishaspora.recipe.dto.RecipeDto;
import com.dishaspora.recipe.dto.RecipeRequest;
import com.dishaspora.recipe.service.BasketService;
import com.dishaspora.recipe.service.PassportService;
import com.dishaspora.recipe.service.PassportService.CookedResult;
import com.dishaspora.recipe.service.RecipeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class RecipeController {

    private final RecipeService recipeService;
    private final PassportService passportService;
    private final BasketService basketService;

    public RecipeController(RecipeService recipeService, PassportService passportService,
                            BasketService basketService) {
        this.recipeService = recipeService;
        this.passportService = passportService;
        this.basketService = basketService;
    }

    @GetMapping("/recipes")
    public PageDto<RecipeDto> search(@RequestParam(required = false) String q,
                                     @RequestParam(required = false) String category,
                                     @RequestParam(required = false) String cuisine,
                                     @RequestParam(required = false) String mealType,
                                     @RequestParam(required = false) Integer maxCalories,
                                     @RequestParam(required = false) Integer maxMinutes,
                                     @RequestParam(required = false) String country,
                                     @RequestParam(defaultValue = "0") int page,
                                     @RequestParam(defaultValue = "20") int size,
                                     @AuthenticationPrincipal User user) {
        return recipeService.search(q, category, cuisine, mealType, maxCalories, maxMinutes, country,
                page, size, user);
    }

    @GetMapping("/recipes/trending")
    public List<RecipeDto> trending(@AuthenticationPrincipal User user) {
        return recipeService.trending(user);
    }

    @GetMapping("/recipes/{id}")
    public RecipeDto get(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return recipeService.getById(id, user);
    }

    @PostMapping("/recipes")
    public ResponseEntity<RecipeDto> create(@Valid @RequestBody RecipeRequest request,
                                            @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recipeService.create(request, user));
    }

    @PutMapping("/recipes/{id}")
    public RecipeDto update(@PathVariable Long id, @Valid @RequestBody RecipeRequest request,
                            @AuthenticationPrincipal User user) {
        return recipeService.update(id, request, user);
    }

    @PostMapping("/recipes/{id}/save")
    public Map<String, Object> save(@PathVariable Long id, @AuthenticationPrincipal User user) {
        recipeService.save(id, user);
        return Map.of("saved", true);
    }

    @DeleteMapping("/recipes/{id}/save")
    public Map<String, Object> unsave(@PathVariable Long id, @AuthenticationPrincipal User user) {
        recipeService.unsave(id, user);
        return Map.of("saved", false);
    }

    @GetMapping("/users/me/saved")
    public List<RecipeDto> saved(@AuthenticationPrincipal User user) {
        return recipeService.savedRecipes(user);
    }

    @PostMapping("/recipes/{id}/cooked")
    public Map<String, Object> cooked(@PathVariable Long id, @AuthenticationPrincipal User user) {
        CookedResult result = passportService.markCooked(recipeService.find(id), user);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("stamp", result.stamp());
        response.put("newStamp", result.newStamp());
        return response;
    }

    @GetMapping("/recipes/{id}/reviews")
    public List<ReviewDto> reviews(@PathVariable Long id) {
        return recipeService.reviews(id);
    }

    @PostMapping("/recipes/{id}/reviews")
    public ResponseEntity<ReviewDto> addReview(@PathVariable Long id,
                                               @Valid @RequestBody ReviewRequest request,
                                               @AuthenticationPrincipal User user) {
        return ResponseEntity.status(HttpStatus.CREATED).body(recipeService.addReview(id, request, user));
    }

    @GetMapping("/passport")
    public Map<String, Object> passport(@AuthenticationPrincipal User user) {
        return passportService.passport(user);
    }

    @GetMapping("/recipes/{id}/basket")
    public BasketDto basket(@PathVariable Long id, @AuthenticationPrincipal User user) {
        return basketService.buildBasket(recipeService.find(id), user);
    }
}
