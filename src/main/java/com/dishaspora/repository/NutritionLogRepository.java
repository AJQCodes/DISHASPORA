package com.dishaspora.repository;

import com.dishaspora.entity.NutritionLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

// ─────────────────────────────────────────────────────────────────────────────
// NutritionLogRepository.java
// Database queries for daily nutrition logs
// ─────────────────────────────────────────────────────────────────────────────
public interface NutritionLogRepository extends JpaRepository<NutritionLog, UUID> {

    // ── Find a specific user's log for a specific date ─────────────────────────
    // Used to check "does today's log already exist?" before creating a new one
    Optional<NutritionLog> findByUserIdAndDate(UUID userId, LocalDate date);

    // ── Get a user's logs across a date range (for history/charts) ────────────
    List<NutritionLog> findByUserIdAndDateBetweenOrderByDateDesc(
            UUID userId, LocalDate startDate, LocalDate endDate);

    // ── All logs for a user, most recent first ─────────────────────────────────
    List<NutritionLog> findByUserIdOrderByDateDesc(UUID userId);
}
