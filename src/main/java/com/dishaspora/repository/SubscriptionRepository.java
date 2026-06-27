package com.dishaspora.repository;

import com.dishaspora.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// SubscriptionRepository.java
// Database queries for user subscription records
// ─────────────────────────────────────────────────────────────────────────────
public interface SubscriptionRepository extends JpaRepository<Subscription, UUID> {

    // ── Find a user's currently active subscription, if any ───────────────────
    Optional<Subscription> findByUserIdAndStatus(UUID userId, Subscription.Status status);

    // ── Full subscription history for a user, most recent first ───────────────
    List<Subscription> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
