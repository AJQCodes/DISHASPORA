package com.dishaspora.repository;

import com.dishaspora.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// OrderRepository.java
// Database queries for customer orders
// ─────────────────────────────────────────────────────────────────────────────
public interface OrderRepository extends JpaRepository<Order, UUID> {

    // ── All orders placed by a specific user, most recent first ───────────────
    List<Order> findByUserIdOrderByCreatedAtDesc(UUID userId);

    // ── All orders a vendor needs to fulfill ───────────────────────────────────
    List<Order> findByVendorIdOrderByCreatedAtDesc(UUID vendorId);

    // ── Orders filtered by status, e.g. all PENDING orders for a vendor ────────
    List<Order> findByVendorIdAndStatus(UUID vendorId, Order.Status status);
}
