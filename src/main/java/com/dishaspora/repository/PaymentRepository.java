package com.dishaspora.repository;

import com.dishaspora.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface PaymentRepository extends JpaRepository<Payment, UUID> {
    Optional<Payment> findByOrderId(UUID orderId);
    List<Payment> findByUserId(UUID userId);
    Optional<Payment> findByTransactionRef(String transactionRef);
}
