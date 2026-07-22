package com.dishaspora.subscription.controller;

import com.dishaspora.auth.dto.UserDto;
import com.dishaspora.auth.entity.User;
import com.dishaspora.common.dto.PaystackInitDto;
import com.dishaspora.subscription.dto.PlanDto;
import com.dishaspora.subscription.service.SubscriptionService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    public record SubscribeRequest(@NotBlank String planCode) {}

    public record VerifyRequest(@NotBlank String reference) {}

    @GetMapping("/plans")
    public List<PlanDto> plans() {
        return PlanDto.all();
    }

    @PostMapping("/subscribe")
    public PaystackInitDto subscribe(@Valid @RequestBody SubscribeRequest request,
                                     @AuthenticationPrincipal User user) {
        return subscriptionService.subscribe(request.planCode(), user);
    }

    @PostMapping("/verify")
    public UserDto verify(@Valid @RequestBody VerifyRequest request, @AuthenticationPrincipal User user) {
        return subscriptionService.verify(request.reference(), user);
    }

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal User user) {
        return subscriptionService.me(user);
    }
}
