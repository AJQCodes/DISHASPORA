package com.dishaspora.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// OrderItem.java
// A single line item inside an order — e.g. "2x Jollof Rice" or "1kg Tomatoes"
//
// Polymorphic design matching the DB schema:
//   - foodListing is set when the item is a prepared meal
//   - ingredientListing is set when the item is a raw ingredient
//   - Exactly one of the two must be non-null (enforced in OrderService)
// ─────────────────────────────────────────────────────────────────────────────
@Entity
@Table(name = "order_items")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // ── Polymorphic: either a food listing OR an ingredient listing ───────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "food_listing_id")
    private FoodListing foodListing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ingredient_listing_id")
    private IngredientListing ingredientListing;

    @Column(nullable = false)
    private int quantity;

    // ── Price captured at the moment of ordering ──────────────────────────────
    // Stored separately so historical orders are unaffected by future price changes
    @Column(nullable = false)
    private double unitPrice;

    // ── Which order this item belongs to ──────────────────────────────────────
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    // ── Convenience: get the display title regardless of listing type ─────────
    public String getItemTitle() {
        if (foodListing != null) return foodListing.getTitle();
        if (ingredientListing != null) return ingredientListing.getName();
        return "Unknown item";
    }

    // ── Convenience: get the line total ───────────────────────────────────────
    public double getLineTotal() {
        return unitPrice * quantity;
    }
}
