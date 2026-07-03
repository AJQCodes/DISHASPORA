package com.dishaspora.recipe.service;

import com.dishaspora.auth.entity.User;
import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.ListingType;
import com.dishaspora.common.util.CountryUtil;
import com.dishaspora.marketplace.dto.ListingDto;
import com.dishaspora.marketplace.dto.VendorDto;
import com.dishaspora.marketplace.entity.Listing;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.marketplace.repository.ListingRepository;
import com.dishaspora.marketplace.repository.VendorRepository;
import com.dishaspora.recipe.dto.BasketDto;
import com.dishaspora.recipe.dto.BasketDto.BasketItemDto;
import com.dishaspora.recipe.dto.RecipeDto.IngredientDto;
import com.dishaspora.recipe.entity.Ingredient;
import com.dishaspora.recipe.entity.Recipe;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * One-Click Ingredient Basket: picks the APPROVED ingredient vendor in the
 * user's country whose listings match the most of the recipe's ingredient
 * names (case-insensitive contains match).
 */
@Service
public class BasketService {

    private final ListingRepository listingRepository;
    private final VendorRepository vendorRepository;

    public BasketService(ListingRepository listingRepository, VendorRepository vendorRepository) {
        this.listingRepository = listingRepository;
        this.vendorRepository = vendorRepository;
    }

    public BasketDto buildBasket(Recipe recipe, User user) {
        String country = user.getCountry();
        String currency = CountryUtil.currencyFor(country);

        List<Listing> ingredientListings = listingRepository
                .findByStatusAndTypeAndCountry(ApprovalStatus.APPROVED, ListingType.INGREDIENT, country)
                .stream()
                .filter(Listing::isAvailable)
                .filter(l -> {
                    Vendor v = vendorRepository.findById(l.getVendorId()).orElse(null);
                    return v != null && v.getStatus() == ApprovalStatus.APPROVED;
                })
                .toList();

        // Group listings by vendor and score each vendor by matched ingredient count.
        Map<Long, List<Listing>> byVendor = new HashMap<>();
        ingredientListings.forEach(l -> byVendor.computeIfAbsent(l.getVendorId(), k -> new ArrayList<>()).add(l));

        Long bestVendorId = null;
        int bestScore = -1;
        for (Map.Entry<Long, List<Listing>> entry : byVendor.entrySet()) {
            int score = 0;
            for (Ingredient ingredient : recipe.getIngredients()) {
                if (findMatch(ingredient, entry.getValue()) != null) {
                    score++;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestVendorId = entry.getKey();
            }
        }

        List<BasketItemDto> items = new ArrayList<>();
        List<IngredientDto> unmatched = new ArrayList<>();
        Vendor bestVendor = bestVendorId == null ? null
                : vendorRepository.findById(bestVendorId).orElse(null);
        List<Listing> vendorListings = bestVendorId == null
                ? List.of() : byVendor.getOrDefault(bestVendorId, List.of());

        long totalMinor = 0;
        for (Ingredient ingredient : recipe.getIngredients()) {
            IngredientDto ingredientDto = new IngredientDto(
                    ingredient.getName(), ingredient.getQuantity(), ingredient.getUnit());
            Listing match = findMatch(ingredient, vendorListings);
            if (match != null) {
                items.add(new BasketItemDto(ingredientDto, ListingDto.from(match, bestVendor), 1));
                totalMinor += match.getAmountMinor();
            } else {
                unmatched.add(ingredientDto);
            }
        }

        return new BasketDto(
                bestVendor == null ? null : VendorDto.from(bestVendor),
                items, totalMinor, currency, unmatched);
    }

    private Listing findMatch(Ingredient ingredient, List<Listing> listings) {
        if (ingredient.getName() == null) return null;
        String name = ingredient.getName().toLowerCase(Locale.ROOT).trim();
        for (Listing listing : listings) {
            String title = listing.getTitle() == null ? "" : listing.getTitle().toLowerCase(Locale.ROOT);
            if (title.contains(name) || name.contains(title)) {
                return listing;
            }
        }
        // Fall back to token overlap (e.g. "Fresh tomatoes" vs "Tomatoes (basket)").
        for (Listing listing : listings) {
            String title = listing.getTitle() == null ? "" : listing.getTitle().toLowerCase(Locale.ROOT);
            for (String token : name.split("[^a-z]+")) {
                if (token.length() >= 4 && title.contains(token)) {
                    return listing;
                }
            }
        }
        return null;
    }
}
