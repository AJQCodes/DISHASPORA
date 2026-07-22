package com.dishaspora.order.repository;

import com.dishaspora.order.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Order> findByVendorIdOrderByCreatedAtDesc(Long vendorId);

    Optional<Order> findByReference(String reference);

    List<Order> findTop10ByOrderByCreatedAtDesc();
}
