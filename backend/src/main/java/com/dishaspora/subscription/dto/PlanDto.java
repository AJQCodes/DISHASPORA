package com.dishaspora.subscription.dto;

import java.util.List;

public record PlanDto(String code, String name, long amountMinorGHS, long amountMinorNGN,
                      String interval, List<String> features) {

    public static final PlanDto PREMIUM_MONTHLY = new PlanDto(
            "PREMIUM_MONTHLY", "Premium Monthly", 3000, 150000, "monthly",
            List.of(
                    "Ask Dishaspora AI cooking assistant",
                    "Recipe videos and audio guides",
                    "Chat directly with vendors",
                    "Recipe Passport perks"));

    public static final PlanDto PREMIUM_YEARLY = new PlanDto(
            "PREMIUM_YEARLY", "Premium Yearly", 30000, 1500000, "yearly",
            List.of(
                    "Everything in Premium Monthly",
                    "2 months free vs monthly billing",
                    "Priority vendor support",
                    "Early access to new features"));

    public static List<PlanDto> all() {
        return List.of(PREMIUM_MONTHLY, PREMIUM_YEARLY);
    }

    public static PlanDto byCode(String code) {
        return all().stream()
                .filter(p -> p.code().equalsIgnoreCase(code))
                .findFirst()
                .orElse(null);
    }
}
