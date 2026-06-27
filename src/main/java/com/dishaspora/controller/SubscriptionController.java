package com.dishaspora.controller;

import com.dishaspora.dto.PlanResponse;
import com.dishaspora.dto.SubscribeRequest;
import com.dishaspora.dto.SubscriptionStatusResponse;
import com.dishaspora.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ─────────────────────────────────────────────────────────────────────────────
// SubscriptionController.java
// Endpoints for browsing plans, subscribing, checking status, and cancelling.
// Matches what your project proposal calls "Subscription Service" — plan
// management, user subscriptions, and premium access control.
// ─────────────────────────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // ── GET /api/subscriptions/plans ────────────────────────────────────────────
    // Public — anyone can see what plans are available, even before logging in
    @GetMapping("/plans")
    public ResponseEntity<List<PlanResponse>> getPlans() {
        return ResponseEntity.ok(subscriptionService.getPlans());
    }

    // ── POST /api/subscriptions/subscribe ───────────────────────────────────────
    // Body: { "planId": "..." }
    // Requires a valid JWT token (the logged-in user)
    @PostMapping("/subscribe")
    public ResponseEntity<SubscriptionStatusResponse> subscribe(
            @Valid @RequestBody SubscribeRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        Integer planId = Integer.parseInt(request.planId());
        return ResponseEntity.ok(subscriptionService.subscribe(userDetails.getUsername(), planId));
    }

    // ── GET /api/subscriptions/status ───────────────────────────────────────────
    // Returns whether the logged-in user is currently premium, and for how long
    @GetMapping("/status")
    public ResponseEntity<SubscriptionStatusResponse> getStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(subscriptionService.getStatus(userDetails.getUsername()));
    }

    // ── POST /api/subscriptions/cancel ──────────────────────────────────────────
    // Cancels the user's active subscription (they keep access until it expires)
    @PostMapping("/cancel")
    public ResponseEntity<SubscriptionStatusResponse> cancel(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(subscriptionService.cancel(userDetails.getUsername()));
    }
}
