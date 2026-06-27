package com.dishaspora.service;

import com.dishaspora.dto.PlanResponse;
import com.dishaspora.dto.SubscriptionStatusResponse;
import com.dishaspora.entity.Subscription;
import com.dishaspora.entity.SubscriptionPlan;
import com.dishaspora.entity.User;
import com.dishaspora.repository.SubscriptionPlanRepository;
import com.dishaspora.repository.SubscriptionRepository;
import com.dishaspora.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionPlanRepository planRepository;
    private final SubscriptionRepository     subscriptionRepository;
    private final UserRepository             userRepository;

    public List<PlanResponse> getPlans() {
        return planRepository.findByActiveTrue().stream()
                .map(this::toPlanResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public SubscriptionStatusResponse subscribe(String email, Integer planId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new RuntimeException("Subscription plan not found"));

        // Expire any existing active subscription
        subscriptionRepository.findByUserIdAndStatus(user.getId(), Subscription.Status.active)
                .ifPresent(existing -> {
                    existing.setStatus(Subscription.Status.cancelled);
                    subscriptionRepository.save(existing);
                });

        LocalDateTime now     = LocalDateTime.now();
        LocalDateTime endDate = now.plusMonths(1); // default monthly

        Subscription subscription = Subscription.builder()
                .user(user)
                .plan(plan)
                .startDate(now)
                .endDate(endDate)
                .status(Subscription.Status.active)
                .billingCycle(Subscription.BillingCycle.monthly)
                .build();

        subscriptionRepository.save(subscription);
        return toStatusResponse(subscription);
    }

    @Transactional
    public SubscriptionStatusResponse getStatus(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        var activeOpt = subscriptionRepository
                .findByUserIdAndStatus(user.getId(), Subscription.Status.active);

        if (activeOpt.isEmpty()) {
            return new SubscriptionStatusResponse(false, null, null, null, "none", 0);
        }

        Subscription sub = activeOpt.get();

        // Auto-expire if end date has passed
        if (sub.getEndDate() != null && sub.getEndDate().isBefore(LocalDateTime.now())) {
            sub.setStatus(Subscription.Status.expired);
            subscriptionRepository.save(sub);
            return new SubscriptionStatusResponse(
                    false, sub.getPlan().getName(),
                    sub.getStartDate().toString(), sub.getEndDate().toString(),
                    "expired", 0);
        }

        return toStatusResponse(sub);
    }

    @Transactional
    public SubscriptionStatusResponse cancel(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Subscription sub = subscriptionRepository
                .findByUserIdAndStatus(user.getId(), Subscription.Status.active)
                .orElseThrow(() -> new RuntimeException("No active subscription to cancel"));

        sub.setStatus(Subscription.Status.cancelled);
        sub.setCancelledAt(LocalDateTime.now());
        subscriptionRepository.save(sub);

        return new SubscriptionStatusResponse(
                false, sub.getPlan().getName(),
                sub.getStartDate().toString(), sub.getEndDate().toString(),
                "cancelled", 0);
    }

    private PlanResponse toPlanResponse(SubscriptionPlan plan) {
        return new PlanResponse(
                plan.getId().toString(),
                plan.getName(),
                plan.getPriceMonthly(),
                plan.getPriceAnnual(),
                plan.getDescription(),
                plan.isHasVideoAccess(),
                plan.isHasAudioAccess(),
                plan.isHasChatSupport(),
                plan.isHasAdFree(),
                plan.getMaxListings()
        );
    }

    private SubscriptionStatusResponse toStatusResponse(Subscription sub) {
        long daysRemaining = sub.getEndDate() != null
                ? Duration.between(LocalDateTime.now(), sub.getEndDate()).toDays()
                : 0;
        return new SubscriptionStatusResponse(
                true,
                sub.getPlan().getName(),
                sub.getStartDate().toString(),
                sub.getEndDate() != null ? sub.getEndDate().toString() : null,
                "active",
                Math.max(daysRemaining, 0)
        );
    }
}
