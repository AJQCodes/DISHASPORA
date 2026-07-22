package com.dishaspora.subscription.service;

import com.dishaspora.auth.dto.UserDto;
import com.dishaspora.auth.entity.User;
import com.dishaspora.auth.repository.UserRepository;
import com.dishaspora.common.dto.PaystackInitDto;
import com.dishaspora.common.enums.Enums.SubscriptionStatus;
import com.dishaspora.common.exception.ApiException;
import com.dishaspora.common.exception.NotFoundException;
import com.dishaspora.common.paystack.PaystackClient;
import com.dishaspora.common.util.CountryUtil;
import com.dishaspora.subscription.dto.PlanDto;
import com.dishaspora.subscription.entity.Subscription;
import com.dishaspora.subscription.repository.SubscriptionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;

@Service
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final UserRepository userRepository;
    private final PaystackClient paystackClient;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                               UserRepository userRepository,
                               PaystackClient paystackClient) {
        this.subscriptionRepository = subscriptionRepository;
        this.userRepository = userRepository;
        this.paystackClient = paystackClient;
    }

    @Transactional
    public PaystackInitDto subscribe(String planCode, User user) {
        PlanDto plan = PlanDto.byCode(planCode);
        if (plan == null) {
            throw ApiException.badRequest("Unknown plan: " + planCode);
        }
        String currency = CountryUtil.currencyFor(user.getCountry());
        long amountMinor = "NGN".equals(currency) ? plan.amountMinorNGN() : plan.amountMinorGHS();

        Subscription subscription = new Subscription();
        subscription.setUserId(user.getId());
        subscription.setPlanCode(plan.code());
        subscription.setReference("DSP-SUB-"
                + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase());
        subscription.setStatus(SubscriptionStatus.PENDING);
        subscription.setAmountMinor(amountMinor);
        subscription.setCurrency(currency);
        subscription = subscriptionRepository.save(subscription);

        return paystackClient.initialize(user.getEmail(), amountMinor, currency, subscription.getReference());
    }

    @Transactional
    public UserDto verify(String reference, User currentUser) {
        Subscription subscription = subscriptionRepository.findByReference(reference)
                .orElseThrow(() -> new NotFoundException("Subscription with this reference not found"));
        if (!Objects.equals(subscription.getUserId(), currentUser.getId())) {
            throw ApiException.forbidden("This subscription does not belong to you");
        }
        if (subscription.getStatus() != SubscriptionStatus.ACTIVE) {
            if (!paystackClient.verify(reference)) {
                throw ApiException.badRequest("Payment not confirmed yet");
            }
            subscription.setStatus(SubscriptionStatus.ACTIVE);
            subscriptionRepository.save(subscription);
        }

        User user = userRepository.findById(currentUser.getId()).orElseThrow();
        Instant base = user.isPremiumActive() && user.getPremiumUntil() != null
                ? user.getPremiumUntil() : Instant.now();
        long days = "PREMIUM_YEARLY".equals(subscription.getPlanCode()) ? 365 : 30;
        user.setPremium(true);
        user.setPremiumUntil(base.plus(days, ChronoUnit.DAYS));
        user.setPlanCode(subscription.getPlanCode());
        return UserDto.from(userRepository.save(user));
    }

    public Map<String, Object> me(User user) {
        User fresh = userRepository.findById(user.getId()).orElse(user);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("premium", fresh.isPremiumActive());
        response.put("premiumUntil", fresh.getPremiumUntil() == null ? null : fresh.getPremiumUntil().toString());
        response.put("planCode", fresh.getPlanCode());
        return response;
    }
}
