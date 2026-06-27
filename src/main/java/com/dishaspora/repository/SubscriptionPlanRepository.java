package com.dishaspora.repository;

import com.dishaspora.entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

// ─────────────────────────────────────────────────────────────────────────────
// SubscriptionPlanRepository.java
// Database queries for available subscription plans
// ─────────────────────────────────────────────────────────────────────────────
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Integer> {

    // ── Only show plans that are currently offered ────────────────────────────
    List<SubscriptionPlan> findByActiveTrue();
}
