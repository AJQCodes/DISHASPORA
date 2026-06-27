package com.dishaspora.service;

import com.dishaspora.dto.PaymentRequest;
import com.dishaspora.dto.PaymentResponse;
import com.dishaspora.entity.Order;
import com.dishaspora.entity.Payment;
import com.dishaspora.entity.User;
import com.dishaspora.repository.OrderRepository;
import com.dishaspora.repository.PaymentRepository;
import com.dishaspora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository   orderRepository;
    private final UserRepository    userRepository;

    // ── Initiate a payment for an order ───────────────────────────────────────
    @Transactional
    public PaymentResponse initiatePayment(String email, PaymentRequest request) {
        User user = getUser(email);

        Order order = orderRepository.findById(UUID.fromString(request.orderId()))
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("This order does not belong to you");
        }

        // Check no payment already exists for this order
        if (paymentRepository.findByOrderId(order.getId()).isPresent()) {
            throw new IllegalArgumentException("A payment has already been initiated for this order");
        }

        Payment payment = Payment.builder()
                .order(order)
                .user(user)
                .amount(order.getTotalAmount())
                .paymentMethod(Payment.PaymentMethod.valueOf(request.paymentMethod().toUpperCase()))
                .transactionRef(request.transactionRef())
                .transactionStatus(Payment.TransactionStatus.PENDING)
                .build();

        Payment saved = paymentRepository.save(payment);
        return toResponse(saved);
    }

    // ── Mark a payment as successful (called after provider confirms) ─────────
    @Transactional
    public PaymentResponse confirmPayment(UUID paymentId, String transactionRef) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setTransactionStatus(Payment.TransactionStatus.SUCCESSFUL);
        payment.setTransactionRef(transactionRef);
        payment.setPaidAt(LocalDateTime.now());

        // Update the order status to CONFIRMED
        Order order = payment.getOrder();
        order.setStatus(Order.Status.confirmed);
        orderRepository.save(order);

        return toResponse(paymentRepository.save(payment));
    }

    // ── Mark a payment as failed ───────────────────────────────────────────────
    @Transactional
    public PaymentResponse failPayment(UUID paymentId, String reason) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setTransactionStatus(Payment.TransactionStatus.FAILED);
        payment.setFailureReason(reason);
        return toResponse(paymentRepository.save(payment));
    }

    // ── Get payment for a specific order ──────────────────────────────────────
    public PaymentResponse getPaymentByOrder(UUID orderId) {
        Payment payment = paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new RuntimeException("No payment found for this order"));
        return toResponse(payment);
    }

    // ── Get all payments made by the logged-in user ───────────────────────────
    public List<PaymentResponse> getMyPayments(String email) {
        User user = getUser(email);
        return paymentRepository.findByUserId(user.getId())
                .stream().map(this::toResponse).collect(Collectors.toList());
    }

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

    private PaymentResponse toResponse(Payment p) {
        return new PaymentResponse(
                p.getId().toString(),
                p.getOrder().getId().toString(),
                p.getAmount(),
                p.getPaymentMethod().name(),
                p.getTransactionStatus().name(),
                p.getTransactionRef(),
                p.getPaidAt() != null ? p.getPaidAt().toString() : null,
                p.getCreatedAt().toString()
        );
    }
}
