package com.dishaspora.service;

import com.dishaspora.dto.OrderItemRequest;
import com.dishaspora.dto.PlaceOrderRequest;
import com.dishaspora.entity.*;
import com.dishaspora.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// OrderService.java
// Handles the full order placement flow for BOTH food listings and ingredient
// listings — matching the polymorphic design of the DB's order_items table.
//
// Each OrderItemRequest carries either a foodListingId OR an ingredientListingId.
// OrderService resolves whichever is present, checks stock, captures the price,
// and links it to the order.
// ─────────────────────────────────────────────────────────────────────────────
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository            orderRepository;
    private final UserRepository             userRepository;
    private final VendorRepository           vendorRepository;
    private final FoodListingRepository      foodListingRepository;
    private final IngredientListingRepository ingredientListingRepository;

    // ── Place a new order ───────────────────────────────────────────────────────
    @Transactional
    public Order placeOrder(String userEmail, PlaceOrderRequest request) {

        // ── Step 1: find the user placing the order ───────────────────────────
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // ── Step 2: find and validate the vendor ──────────────────────────────
        Vendor vendor = vendorRepository.findById(request.vendorId())
                .orElseThrow(() -> new RuntimeException("Vendor not found"));

        if (!vendor.isApproved()) {
            throw new IllegalArgumentException("This vendor is not currently active");
        }

        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Order must contain at least one item");
        }

        // ── Step 3: resolve each item, checking stock as we go ────────────────
        List<OrderItem> orderItems = new ArrayList<>();
        double total = 0;

        for (OrderItemRequest itemReq : request.items()) {
            boolean hasFoodId       = itemReq.foodListingId() != null;
            boolean hasIngredientId = itemReq.ingredientListingId() != null;

            if (hasFoodId && hasIngredientId) {
                throw new IllegalArgumentException(
                    "Each order item must reference either a food listing or an ingredient listing, not both");
            }
            if (!hasFoodId && !hasIngredientId) {
                throw new IllegalArgumentException(
                    "Each order item must reference a food listing or an ingredient listing");
            }
            if (itemReq.quantity() <= 0) {
                throw new IllegalArgumentException("Quantity must be at least 1");
            }

            OrderItem orderItem;

            if (hasFoodId) {
                // ── Food listing ───────────────────────────────────────────────
                FoodListing listing = foodListingRepository.findById(itemReq.foodListingId())
                        .orElseThrow(() -> new RuntimeException("Food listing not found"));

                if (!listing.getVendor().getId().equals(vendor.getId())) {
                    throw new IllegalArgumentException(
                        "Listing '" + listing.getTitle() + "' does not belong to this vendor");
                }
                if (!listing.isAvailable()) {
                    throw new IllegalArgumentException(
                        "'" + listing.getTitle() + "' is currently unavailable");
                }
                if (listing.getStockQuantity() < itemReq.quantity()) {
                    throw new IllegalArgumentException(
                        "Not enough stock for '" + listing.getTitle() + "'");
                }

                double unitPrice = listing.getPrice();
                total += unitPrice * itemReq.quantity();

                // Reduce stock immediately
                listing.setStockQuantity(listing.getStockQuantity() - itemReq.quantity());
                foodListingRepository.save(listing);

                orderItem = OrderItem.builder()
                        .foodListing(listing)
                        .quantity(itemReq.quantity())
                        .unitPrice(unitPrice)
                        .build();

            } else {
                // ── Ingredient listing ─────────────────────────────────────────
                IngredientListing listing = ingredientListingRepository.findById(itemReq.ingredientListingId())
                        .orElseThrow(() -> new RuntimeException("Ingredient listing not found"));

                if (!listing.getVendor().getId().equals(vendor.getId())) {
                    throw new IllegalArgumentException(
                        "Listing '" + listing.getName() + "' does not belong to this vendor");
                }
                if (!listing.isAvailable()) {
                    throw new IllegalArgumentException(
                        "'" + listing.getName() + "' is currently unavailable");
                }
                if (listing.getStockQuantity() < itemReq.quantity()) {
                    throw new IllegalArgumentException(
                        "Not enough stock for '" + listing.getName() + "'");
                }

                double unitPrice = listing.getPrice();
                total += unitPrice * itemReq.quantity();

                // Reduce stock immediately
                listing.setStockQuantity(listing.getStockQuantity() - itemReq.quantity());
                ingredientListingRepository.save(listing);

                orderItem = OrderItem.builder()
                        .ingredientListing(listing)
                        .quantity(itemReq.quantity())
                        .unitPrice(unitPrice)
                        .build();
            }

            orderItems.add(orderItem);
        }

        // ── Step 4: create and save the order ─────────────────────────────────
        Order order = Order.builder()
                .user(user)
                .vendor(vendor)
                .totalAmount(total)
                .status(Order.Status.pending)
                .build();

        Order savedOrder = orderRepository.save(order);

        // ── Step 5: link each item back to the saved order ────────────────────
        for (OrderItem item : orderItems) {
            item.setOrder(savedOrder);
        }
        savedOrder.setItems(orderItems);

        // ── Step 6: bump the vendor's total sales counter ─────────────────────

        return orderRepository.save(savedOrder);
    }

    // ── Get all orders placed by the logged-in user ────────────────────────────
    @Transactional
    public List<Order> getMyOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return orderRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    // ── Get all orders a vendor needs to fulfill ────────────────────────────────
    @Transactional
    public List<Order> getVendorOrders(UUID vendorId) {
        return orderRepository.findByVendorIdOrderByCreatedAtDesc(vendorId);
    }

    // ── Vendor updates an order's status (e.g. PENDING → PREPARING) ───────────
    @Transactional
    public Order updateStatus(UUID orderId, Order.Status newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(newStatus);
        return orderRepository.save(order);
    }
}
