package com.dishaspora.recipe.service;

import com.dishaspora.common.dto.PageDto;
import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.util.CountryUtil;
import com.dishaspora.marketplace.repository.VendorRepository;
import com.dishaspora.recipe.dto.StoryDto;
import com.dishaspora.recipe.entity.Recipe;
import com.dishaspora.recipe.repository.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Food Stories are derived from approved recipes that carry a cultural story.
 */
@Service
public class StoryService {

    private static final int PAGE_SIZE = 10;

    private final RecipeRepository recipeRepository;
    private final VendorRepository vendorRepository;

    public StoryService(RecipeRepository recipeRepository, VendorRepository vendorRepository) {
        this.recipeRepository = recipeRepository;
        this.vendorRepository = vendorRepository;
    }

    public PageDto<StoryDto> stories(String country, int page) {
        List<Recipe> withStories = recipeRepository.findByStatus(ApprovalStatus.APPROVED).stream()
                .filter(r -> r.getStory() != null && !r.getStory().isBlank())
                .filter(r -> country == null || country.isBlank()
                        || country.equalsIgnoreCase(r.getCountryOfOrigin()))
                .toList();
        int totalPages = (int) Math.ceil(withStories.size() / (double) PAGE_SIZE);
        int from = Math.max(page, 0) * PAGE_SIZE;
        List<StoryDto> content = withStories.stream()
                .skip(from)
                .limit(PAGE_SIZE)
                .map(this::toStory)
                .toList();
        return new PageDto<>(content, withStories.size(), totalPages);
    }

    private StoryDto toStory(Recipe r) {
        String vendorName = r.getVendorId() == null ? null
                : vendorRepository.findById(r.getVendorId()).map(v -> v.getName()).orElse(null);
        return new StoryDto(
                r.getId(), r.getId(),
                "The story of " + r.getTitle(),
                r.getStory(),
                r.getStoryImageUrl() != null ? r.getStoryImageUrl() : r.getImageUrl(),
                r.getCuisine(),
                CountryUtil.countryName(r.getCountryOfOrigin()),
                vendorName);
    }
}
