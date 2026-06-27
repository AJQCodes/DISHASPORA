package com.dishaspora.controller;

import com.dishaspora.dto.FoodListingRequest;
import com.dishaspora.dto.OrderItemResponse;
import com.dishaspora.dto.OrderResponse;
import com.dishaspora.dto.PlaceOrderRequest;
import com.dishaspora.dto.VendorRegisterRequest;
import com.dishaspora.entity.FoodListing;
import com.dishaspora.entity.Order;
import com.dishaspora.entity.Vendor;
import com.dishaspora.service.FoodListingService;
import com.dishaspora.service.OrderService;
import com.dishaspora.service.VendorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

// ─────────────────────────────────────────────────────────────────────────────
// MarketplaceController.java
// FIX: /listings now returns real data from FoodListingService instead of an
// empty list. /orders now actually creates and saves orders via OrderService
// instead of doing nothing and returning an empty response.
// ─────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
public class MarketplaceController {

    private final VendorService      vendorService;
    private final FoodListingService foodListingService;
    private final OrderService       orderService;

    // ── Listings ─────────────────────────────────────────────────────────────

    // GET /api/marketplace/listings?country=GH
    @GetMapping("/listings")
    public ResponseEntity<List<FoodListing>> getListings(
            @RequestParam(required = false) String country) {
        return ResponseEntity.ok(foodListingService.getListings(country));
    }

    // GET /api/marketplace/listings/{id}
    @GetMapping("/listings/{id}")
    public ResponseEntity<FoodListing> getListingById(@PathVariable UUID id) {
        return ResponseEntity.ok(foodListingService.getById(id));
    }

    // GET /api/marketplace/listings/vendor/{vendorId} — vendor's own dashboard
    @GetMapping("/listings/vendor/{vendorId}")
    public ResponseEntity<List<FoodListing>> getVendorListings(@PathVariable UUID vendorId) {
        return ResponseEntity.ok(foodListingService.getByVendor(vendorId));
    }

    // POST /api/marketplace/listings/{vendorId} — vendor creates a new listing
    @PostMapping("/listings/{vendorId}")
    public ResponseEntity<FoodListing> createListing(
            @PathVariable UUID vendorId,
            @RequestBody FoodListingRequest request) {
        return ResponseEntity.ok(foodListingService.create(vendorId, request));
    }

    // PUT /api/marketplace/listings/{id} — vendor updates price/stock
    @PutMapping("/listings/{id}")
    public ResponseEntity<FoodListing> updateListing(
            @PathVariable UUID id,
            @RequestBody FoodListingRequest request) {
        return ResponseEntity.ok(foodListingService.update(id, request));
    }

    // DELETE /api/marketplace/listings/{id}
    @DeleteMapping("/listings/{id}")
    public ResponseEntity<Void> deleteListing(@PathVariable UUID id) {
        foodListingService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ── Vendors ───────────────────────────────────────────────────────────────

    @GetMapping("/vendors")
    public ResponseEntity<List<Vendor>> getVendors(
            @RequestParam(required = false) String country) {
        return ResponseEntity.ok(vendorService.getAll(country));
    }

    @GetMapping("/vendors/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable UUID id) {
        return ResponseEntity.ok(vendorService.getById(id));
    }

    @PostMapping("/vendors/register")
    public ResponseEntity<Vendor> registerVendor(
            @RequestBody VendorRegisterRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        Vendor vendor = Vendor.builder()
                .name(request.name())
                .description(request.description())
                .country(request.country())
                .city(request.city())
                .build();

        return ResponseEntity.ok(vendorService.register(vendor, userDetails.getUsername()));
    }

    // ── Orders ────────────────────────────────────────────────────────────────

    // POST /api/marketplace/orders
    // Body: { "vendorId": "...", "items": [{ "listingId": "...", "quantity": 2 }] }
    @PostMapping("/orders")
    public ResponseEntity<OrderResponse> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Order order = orderService.placeOrder(userDetails.getUsername(), request);
        return ResponseEntity.ok(toOrderResponse(order));
    }

    // GET /api/marketplace/orders/my — the logged-in user's own order history
    @GetMapping("/orders/my")
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<OrderResponse> orders = orderService.getMyOrders(userDetails.getUsername())
                .stream().map(this::toOrderResponse).collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    // GET /api/marketplace/orders/vendor/{vendorId} — orders a vendor must fulfill
    @GetMapping("/orders/vendor/{vendorId}")
    public ResponseEntity<List<OrderResponse>> getVendorOrders(@PathVariable UUID vendorId) {
        List<OrderResponse> orders = orderService.getVendorOrders(vendorId)
                .stream().map(this::toOrderResponse).collect(Collectors.toList());
        return ResponseEntity.ok(orders);
    }

    // PATCH /api/marketplace/orders/{id}/status?status=PREPARING
    @PatchMapping("/orders/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable UUID id,
            @RequestParam String status) {
        Order.Status newStatus = Order.Status.valueOf(status.toUpperCase());
        return ResponseEntity.ok(toOrderResponse(orderService.updateStatus(id, newStatus)));
    }

    // ── Helper: convert Order entity → OrderResponse DTO ─────────────────────
    // Avoids LazyInitializationException when Jackson tries to serialize
    // lazy-loaded relationships (User, Vendor, OrderItems) outside a transaction
    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getItemTitle(),
                        item.getFoodListing() != null ? "FOOD" : "INGREDIENT",
                        item.getQuantity(),
                        item.getUnitPrice(),
                        item.getLineTotal()
                ))
                .collect(Collectors.toList());
        return new OrderResponse(
                order.getId().toString(),
                order.getVendor().getName(),
                order.getTotalAmount(),
                order.getStatus().name(),
                order.getCreatedAt().toString(),
                items
        );
    }
}
