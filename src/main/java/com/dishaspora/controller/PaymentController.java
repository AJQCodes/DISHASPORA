package com.dishaspora.controller;

import com.dishaspora.dto.PaymentRequest;
import com.dishaspora.dto.PaymentResponse;
import com.dishaspora.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // POST /api/payments — initiate payment for an order
    @PostMapping
    public ResponseEntity<PaymentResponse> initiatePayment(
            @Valid @RequestBody PaymentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(paymentService.initiatePayment(userDetails.getUsername(), request));
    }

    // GET /api/payments/my — all payments by logged-in user
    @GetMapping("/my")
    public ResponseEntity<List<PaymentResponse>> getMyPayments(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(paymentService.getMyPayments(userDetails.getUsername()));
    }

    // GET /api/payments/order/{orderId}
    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentResponse> getPaymentByOrder(@PathVariable UUID orderId) {
        return ResponseEntity.ok(paymentService.getPaymentByOrder(orderId));
    }

    // POST /api/payments/{id}/confirm — admin/system confirms payment
    @PostMapping("/{id}/confirm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> confirmPayment(
            @PathVariable UUID id,
            @RequestParam String transactionRef) {
        return ResponseEntity.ok(paymentService.confirmPayment(id, transactionRef));
    }

    // POST /api/payments/{id}/fail — admin/system marks payment failed
    @PostMapping("/{id}/fail")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PaymentResponse> failPayment(
            @PathVariable UUID id,
            @RequestParam String reason) {
        return ResponseEntity.ok(paymentService.failPayment(id, reason));
    }
}
