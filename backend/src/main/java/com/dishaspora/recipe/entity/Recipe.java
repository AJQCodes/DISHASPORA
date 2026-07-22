package com.dishaspora.recipe.entity;

import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.MealType;
import com.dishaspora.common.enums.Enums.RecipeCategory;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "recipes")
public class Recipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RecipeCategory category = RecipeCategory.LOCAL;

    private String cuisine;

    /** ISO code (GH/NG) or free country name for foreign dishes. */
    private String countryOfOrigin;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MealType mealType = MealType.LUNCH;

    private String imageUrl;

    private int calories;

    private int servings;

    private int prepMinutes;

    private int cookMinutes;

    private String mealFrequency;

    @Column(length = 1000)
    private String mealFrequencyReason;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    @OrderColumn(name = "ingredient_order")
    private List<Ingredient> ingredients = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "recipe_steps", joinColumns = @JoinColumn(name = "recipe_id"))
    @OrderColumn(name = "step_order")
    private List<RecipeStep> steps = new ArrayList<>();

    @Column(length = 4000)
    private String story;

    private String storyImageUrl;

    private String videoUrl;

    /**
     * Public "watch it being cooked" link. Unlike videoUrl this is never premium-gated,
     * and the mapper derives one from the title when it is not set.
     */
    private String videoSearchUrl;

    private String audioUrl;

    @Column(nullable = false)
    private Long vendorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApprovalStatus status = ApprovalStatus.PENDING;

    private String rejectionFeedback;

    private double rating;

    private int reviewCount;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public int totalMinutes() { return prepMinutes + cookMinutes; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public RecipeCategory getCategory() { return category; }
    public void setCategory(RecipeCategory category) { this.category = category; }
    public String getCuisine() { return cuisine; }
    public void setCuisine(String cuisine) { this.cuisine = cuisine; }
    public String getCountryOfOrigin() { return countryOfOrigin; }
    public void setCountryOfOrigin(String countryOfOrigin) { this.countryOfOrigin = countryOfOrigin; }
    public MealType getMealType() { return mealType; }
    public void setMealType(MealType mealType) { this.mealType = mealType; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public int getCalories() { return calories; }
    public void setCalories(int calories) { this.calories = calories; }
    public int getServings() { return servings; }
    public void setServings(int servings) { this.servings = servings; }
    public int getPrepMinutes() { return prepMinutes; }
    public void setPrepMinutes(int prepMinutes) { this.prepMinutes = prepMinutes; }
    public int getCookMinutes() { return cookMinutes; }
    public void setCookMinutes(int cookMinutes) { this.cookMinutes = cookMinutes; }
    public String getMealFrequency() { return mealFrequency; }
    public void setMealFrequency(String mealFrequency) { this.mealFrequency = mealFrequency; }
    public String getMealFrequencyReason() { return mealFrequencyReason; }
    public void setMealFrequencyReason(String mealFrequencyReason) { this.mealFrequencyReason = mealFrequencyReason; }
    public List<Ingredient> getIngredients() { return ingredients; }
    public void setIngredients(List<Ingredient> ingredients) { this.ingredients = ingredients; }
    public List<RecipeStep> getSteps() { return steps; }
    public void setSteps(List<RecipeStep> steps) { this.steps = steps; }
    public String getStory() { return story; }
    public void setStory(String story) { this.story = story; }
    public String getStoryImageUrl() { return storyImageUrl; }
    public void setStoryImageUrl(String storyImageUrl) { this.storyImageUrl = storyImageUrl; }
    public String getVideoUrl() { return videoUrl; }
    public void setVideoUrl(String videoUrl) { this.videoUrl = videoUrl; }

    public String getVideoSearchUrl() { return videoSearchUrl; }
    public void setVideoSearchUrl(String videoSearchUrl) { this.videoSearchUrl = videoSearchUrl; }
    public String getAudioUrl() { return audioUrl; }
    public void setAudioUrl(String audioUrl) { this.audioUrl = audioUrl; }
    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }
    public ApprovalStatus getStatus() { return status; }
    public void setStatus(ApprovalStatus status) { this.status = status; }
    public String getRejectionFeedback() { return rejectionFeedback; }
    public void setRejectionFeedback(String rejectionFeedback) { this.rejectionFeedback = rejectionFeedback; }
    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }
    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
