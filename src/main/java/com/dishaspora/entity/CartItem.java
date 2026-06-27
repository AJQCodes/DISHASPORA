package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

// Matches cart_items table from 007_create_orders.sql
// Items in a user's active cart before they confirm checkout
@Entity
@Table(name = "cart_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ── Polymorphic: either a food listing or ingredient listing ─────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_listing_id")
    private FoodListing foodListing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_listing_id")
    private IngredientListing ingredientListing;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime addedAt = LocalDateTime.now();
}
