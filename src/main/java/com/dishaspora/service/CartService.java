package com.dishaspora.service;

import com.dishaspora.dto.CartItemRequest;
import com.dishaspora.dto.CartItemResponse;
import com.dishaspora.entity.CartItem;
import com.dishaspora.entity.FoodListing;
import com.dishaspora.entity.IngredientListing;
import com.dishaspora.entity.User;
import com.dishaspora.repository.CartItemRepository;
import com.dishaspora.repository.FoodListingRepository;
import com.dishaspora.repository.IngredientListingRepository;
import com.dishaspora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository         cartItemRepository;
    private final UserRepository             userRepository;
    private final FoodListingRepository      foodListingRepository;
    private final IngredientListingRepository ingredientListingRepository;

    // ── Get current user's cart ────────────────────────────────────────────────
    public List<CartItemResponse> getCart(String email) {
        User user = getUser(email);
        return cartItemRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    // ── Add an item to cart ────────────────────────────────────────────────────
    public CartItemResponse addToCart(String email, CartItemRequest request) {
        User user = getUser(email);

        if (request.foodListingId() == null && request.ingredientListingId() == null) {
            throw new IllegalArgumentException("Must specify either a food listing or ingredient listing");
        }

        CartItem.CartItemBuilder builder = CartItem.builder()
                .user(user)
                .quantity(request.quantity());

        if (request.foodListingId() != null) {
            FoodListing listing = foodListingRepository
                    .findById(UUID.fromString(request.foodListingId()))
                    .orElseThrow(() -> new RuntimeException("Food listing not found"));
            if (!listing.isAvailable()) throw new IllegalArgumentException("This item is unavailable");
            builder.foodListing(listing);
        } else {
            IngredientListing listing = ingredientListingRepository
                    .findById(UUID.fromString(request.ingredientListingId()))
                    .orElseThrow(() -> new RuntimeException("Ingredient listing not found"));
            if (!listing.isAvailable()) throw new IllegalArgumentException("This item is unavailable");
            builder.ingredientListing(listing);
        }

        return toResponse(cartItemRepository.save(builder.build()));
    }

    // ── Remove a single item from cart ─────────────────────────────────────────
    public void removeFromCart(String email, UUID cartItemId) {
        User user = getUser(email);
        CartItem item = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        if (!item.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("This cart item does not belong to you");
        }
        cartItemRepository.delete(item);
    }

    // ── Clear the entire cart ──────────────────────────────────────────────────
    @Transactional
    public void clearCart(String email) {
        User user = getUser(email);
        cartItemRepository.deleteByUserId(user.getId());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private CartItemResponse toResponse(CartItem item) {
        if (item.getFoodListing() != null) {
            FoodListing f = item.getFoodListing();
            return new CartItemResponse(
                    item.getId().toString(), f.getTitle(), "FOOD",
                    f.getPrice(), item.getQuantity(), f.getPrice() * item.getQuantity());
        } else {
            IngredientListing i = item.getIngredientListing();
            return new CartItemResponse(
                    item.getId().toString(), i.getName(), "INGREDIENT",
                    i.getPrice(), item.getQuantity(), i.getPrice() * item.getQuantity());
        }
    }
}
