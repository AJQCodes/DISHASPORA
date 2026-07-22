package com.dishaspora.recipe.service;

import com.dishaspora.admin.service.AutoFlagService;
import com.dishaspora.auth.entity.User;
import com.dishaspora.auth.repository.UserRepository;
import com.dishaspora.common.dto.PageDto;
import com.dishaspora.common.dto.ReviewDto;
import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.MealType;
import com.dishaspora.common.enums.Enums.RecipeCategory;
import com.dishaspora.common.enums.Enums.Role;
import com.dishaspora.common.exception.ApiException;
import com.dishaspora.common.exception.NotFoundException;
import com.dishaspora.marketplace.dto.MarketplaceRequests.ReviewRequest;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.marketplace.repository.VendorRepository;
import com.dishaspora.recipe.dto.RecipeDto;
import com.dishaspora.recipe.dto.RecipeRequest;
import com.dishaspora.recipe.entity.Ingredient;
import com.dishaspora.recipe.entity.Recipe;
import com.dishaspora.recipe.entity.RecipeReview;
import com.dishaspora.recipe.entity.RecipeStep;
import com.dishaspora.recipe.entity.SavedRecipe;
import com.dishaspora.recipe.repository.RecipeRepository;
import com.dishaspora.recipe.repository.RecipeReviewRepository;
import com.dishaspora.recipe.repository.SavedRecipeRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Service
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final RecipeReviewRepository reviewRepository;
    private final SavedRecipeRepository savedRecipeRepository;
    private final VendorRepository vendorRepository;
    private final UserRepository userRepository;
    private final RecipeMapper recipeMapper;
    private final AutoFlagService autoFlagService;

    public RecipeService(RecipeRepository recipeRepository,
                         RecipeReviewRepository reviewRepository,
                         SavedRecipeRepository savedRecipeRepository,
                         VendorRepository vendorRepository,
                         UserRepository userRepository,
                         RecipeMapper recipeMapper,
                         AutoFlagService autoFlagService) {
        this.recipeRepository = recipeRepository;
        this.reviewRepository = reviewRepository;
        this.savedRecipeRepository = savedRecipeRepository;
        this.vendorRepository = vendorRepository;
        this.userRepository = userRepository;
        this.recipeMapper = recipeMapper;
        this.autoFlagService = autoFlagService;
    }

    public PageDto<RecipeDto> search(String q, String category, String cuisine, String mealType,
                                     Integer maxCalories, Integer maxMinutes, String country,
                                     int page, int size, User currentUser) {
        Specification<Recipe> spec = buildSpec(q, category, cuisine, mealType, maxCalories, maxMinutes, country);
        Page<Recipe> result = recipeRepository.findAll(spec,
                PageRequest.of(Math.max(page, 0), Math.min(Math.max(size, 1), 100),
                        Sort.by(Sort.Direction.DESC, "rating")));
        return new PageDto<>(recipeMapper.toDtos(result.getContent(), currentUser),
                result.getTotalElements(), result.getTotalPages());
    }

    public Specification<Recipe> buildSpec(String q, String category, String cuisine, String mealType,
                                           Integer maxCalories, Integer maxMinutes, String country) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("status"), ApprovalStatus.APPROVED));
            if (q != null && !q.isBlank()) {
                String like = "%" + q.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like),
                        cb.like(cb.lower(root.get("cuisine")), like)));
            }
            if (category != null && !category.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("category"),
                            RecipeCategory.valueOf(category.toUpperCase())));
                } catch (IllegalArgumentException e) {
                    throw ApiException.badRequest("Invalid category: " + category);
                }
            }
            if (cuisine != null && !cuisine.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("cuisine")), cuisine.toLowerCase()));
            }
            if (mealType != null && !mealType.isBlank()) {
                try {
                    predicates.add(cb.equal(root.get("mealType"), MealType.valueOf(mealType.toUpperCase())));
                } catch (IllegalArgumentException e) {
                    throw ApiException.badRequest("Invalid mealType: " + mealType);
                }
            }
            if (maxCalories != null) {
                predicates.add(cb.le(root.get("calories"), maxCalories));
            }
            if (maxMinutes != null) {
                predicates.add(cb.le(cb.sum(root.get("prepMinutes"), root.get("cookMinutes")), maxMinutes));
            }
            if (country != null && !country.isBlank()) {
                predicates.add(cb.equal(cb.lower(root.get("countryOfOrigin")), country.toLowerCase()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public List<RecipeDto> trending(User currentUser) {
        List<Recipe> top = recipeRepository.findByStatusOrderByRatingDesc(
                ApprovalStatus.APPROVED, PageRequest.of(0, 10));
        return recipeMapper.toDtos(top, currentUser);
    }

    public RecipeDto getById(Long id, User currentUser) {
        Recipe recipe = find(id);
        if (recipe.getStatus() != ApprovalStatus.APPROVED && !canManage(recipe, currentUser)) {
            throw new NotFoundException("Recipe not found");
        }
        return recipeMapper.toDto(recipe, currentUser);
    }

    @Transactional
    public RecipeDto create(RecipeRequest request, User currentUser) {
        Vendor vendor = requireApprovedVendor(currentUser);
        Recipe recipe = new Recipe();
        applyRequest(recipe, request);
        recipe.setVendorId(vendor.getId());
        recipe.setStatus(ApprovalStatus.PENDING);
        recipe = recipeRepository.save(recipe);
        autoFlagService.checkRecipe(recipe);
        return recipeMapper.toDto(recipe, currentUser);
    }

    @Transactional
    public RecipeDto update(Long id, RecipeRequest request, User currentUser) {
        Recipe recipe = find(id);
        if (!canManage(recipe, currentUser)) {
            throw ApiException.forbidden("You can only edit your own recipes");
        }
        applyRequest(recipe, request);
        recipe.setStatus(ApprovalStatus.PENDING);
        recipe.setRejectionFeedback(null);
        return recipeMapper.toDto(recipeRepository.save(recipe), currentUser);
    }

    @Transactional
    public void save(Long recipeId, User user) {
        Recipe recipe = find(recipeId);
        if (!savedRecipeRepository.existsByUserIdAndRecipeId(user.getId(), recipe.getId())) {
            savedRecipeRepository.save(new SavedRecipe(user.getId(), recipe.getId()));
        }
    }

    @Transactional
    public void unsave(Long recipeId, User user) {
        savedRecipeRepository.findByUserIdAndRecipeId(user.getId(), recipeId)
                .ifPresent(savedRecipeRepository::delete);
    }

    public List<RecipeDto> savedRecipes(User user) {
        List<Recipe> recipes = savedRecipeRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(s -> recipeRepository.findById(s.getRecipeId()).orElse(null))
                .filter(Objects::nonNull)
                .toList();
        return recipeMapper.toDtos(recipes, user);
    }

    public List<ReviewDto> reviews(Long recipeId) {
        find(recipeId);
        return reviewRepository.findByRecipeIdOrderByCreatedAtDesc(recipeId).stream()
                .map(this::toReviewDto)
                .toList();
    }

    @Transactional
    public ReviewDto addReview(Long recipeId, ReviewRequest request, User user) {
        Recipe recipe = find(recipeId);
        RecipeReview review = new RecipeReview();
        review.setRecipeId(recipeId);
        review.setUserId(user.getId());
        review.setRating(request.rating());
        review.setComment(request.comment());
        review = reviewRepository.save(review);

        // Incremental aggregate update so seeded rating history is preserved.
        double total = recipe.getRating() * recipe.getReviewCount() + request.rating();
        recipe.setReviewCount(recipe.getReviewCount() + 1);
        recipe.setRating(total / recipe.getReviewCount());
        recipeRepository.save(recipe);

        return toReviewDto(review);
    }

    private ReviewDto toReviewDto(RecipeReview review) {
        User author = userRepository.findById(review.getUserId()).orElse(null);
        return new ReviewDto(review.getId(), review.getRating(), review.getComment(),
                author == null ? "Unknown" : author.getName(),
                author == null ? null : author.getAvatarUrl(),
                review.getCreatedAt().toString());
    }

    public Recipe find(Long id) {
        return recipeRepository.findById(id).orElseThrow(() -> new NotFoundException("Recipe not found"));
    }

    public Vendor requireApprovedVendor(User user) {
        Vendor vendor = vendorRepository.findByOwnerUserId(user.getId())
                .orElseThrow(() -> ApiException.forbidden("You need a vendor profile to do this"));
        if (vendor.getStatus() != ApprovalStatus.APPROVED) {
            throw ApiException.forbidden("Your vendor profile is not approved yet");
        }
        return vendor;
    }

    private boolean canManage(Recipe recipe, User user) {
        if (user == null) return false;
        if (user.getRole() == Role.ADMIN) return true;
        return vendorRepository.findByOwnerUserId(user.getId())
                .map(v -> Objects.equals(v.getId(), recipe.getVendorId()))
                .orElse(false);
    }

    private void applyRequest(Recipe recipe, RecipeRequest request) {
        recipe.setTitle(request.title());
        recipe.setDescription(request.description());
        recipe.setCategory(RecipeCategory.valueOf(request.category()));
        recipe.setCuisine(request.cuisine());
        recipe.setCountryOfOrigin(request.countryOfOrigin());
        recipe.setMealType(MealType.valueOf(request.mealType()));
        recipe.setImageUrl(request.imageUrl());
        recipe.setCalories(request.calories());
        recipe.setServings(request.servings());
        recipe.setPrepMinutes(request.prepMinutes());
        recipe.setCookMinutes(request.cookMinutes());
        recipe.setMealFrequency(request.mealFrequency());
        recipe.setMealFrequencyReason(request.mealFrequencyReason());
        recipe.setStory(request.story());
        recipe.setStoryImageUrl(request.storyImageUrl());
        recipe.setVideoUrl(request.videoUrl());
        recipe.setVideoSearchUrl(request.videoSearchUrl());
        recipe.setAudioUrl(request.audioUrl());
        recipe.getIngredients().clear();
        if (request.ingredients() != null) {
            request.ingredients().forEach(i ->
                    recipe.getIngredients().add(new Ingredient(i.name(), i.quantity(), i.unit())));
        }
        recipe.getSteps().clear();
        if (request.steps() != null) {
            request.steps().forEach(s ->
                    recipe.getSteps().add(new RecipeStep(s.stepNumber(), s.instruction(),
                            s.durationMinutes(), s.imageUrl())));
        }
    }
}
