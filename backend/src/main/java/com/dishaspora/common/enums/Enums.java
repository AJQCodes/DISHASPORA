package com.dishaspora.common.enums;

public final class Enums {
    private Enums() {}

    public enum Role { USER, VENDOR, ADMIN }

    public enum ApprovalStatus { PENDING, APPROVED, REJECTED }

    public enum RecipeCategory { LOCAL, CONTINENTAL, FOREIGN, DRINK }

    public enum MealType { BREAKFAST, LUNCH, DINNER, SNACK, DRINK }

    public enum VendorType { FOOD, INGREDIENT, BOTH }

    public enum ListingType { FOOD, INGREDIENT }

    public enum OrderStatus { PENDING_PAYMENT, PAID, PREPARING, READY, COMPLETED, CANCELLED }

    public enum FlagType { DUPLICATE_RECIPE, COUNTRY_MISMATCH, CATEGORY_SUSPECT, INAPPROPRIATE, REPEATED_SUBMISSION }

    public enum FlagTargetType { RECIPE, LISTING, VENDOR }

    public enum SubscriptionStatus { PENDING, ACTIVE }
}
