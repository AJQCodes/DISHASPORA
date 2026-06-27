package com.dishaspora.config;

import com.dishaspora.entity.*;
import com.dishaspora.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository             userRepository;
    private final RecipeRepository           recipeRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final RecipeStepRepository       recipeStepRepository;
    private final VendorRepository           vendorRepository;
    private final FoodListingRepository      foodListingRepository;
    private final SubscriptionPlanRepository subscriptionPlanRepository;
    private final PasswordEncoder            passwordEncoder;

    @Override
    public void run(String... args) {
        seedAdmin();
        seedRecipes();
        List<Vendor> vendors = seedVendors();
        seedFoodListings(vendors);
        seedSubscriptionPlans();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail("admin@dishaspora.com")) return;
        userRepository.save(User.builder()
                .name("Dishaspora Admin")
                .email("admin@dishaspora.com")
                .password(passwordEncoder.encode("admin123"))
                .country("GH")
                .role(User.Role.admin)
                .build());
        log.info("✅ Admin seeded — email: admin@dishaspora.com | password: admin123");
    }

    private void seedRecipes() {
        if (recipeRepository.count() > 0) return;

        Recipe jollof = recipeRepository.save(Recipe.builder()
                .title("Jollof Rice").culturalOrigin("West Africa")
                .calories(320).cookTime(35).servings(4).mealFrequency("2x daily")
                .averageRating(4.9).premium(false).country("GH")
                .approvalStatus(Recipe.ApprovalStatus.APPROVED).build());
        saveIngredients(jollof, "2 cups parboiled rice","400g tomatoes","1 onion","250ml chicken stock","2 tbsp oil","Spices");
        saveSteps(jollof, "Blend tomatoes and onion","Fry paste 10 mins","Add stock and season","Add rice and stir","Cover and cook 20 mins on low heat");

        Recipe waakye = recipeRepository.save(Recipe.builder()
                .title("Waakye").culturalOrigin("Ghana")
                .calories(400).cookTime(60).servings(4).mealFrequency("Once daily")
                .averageRating(4.8).premium(false).country("GH")
                .approvalStatus(Recipe.ApprovalStatus.APPROVED).build());
        saveIngredients(waakye, "2 cups rice","1 cup black-eyed beans","Sorghum leaves","Salt");
        saveSteps(waakye, "Soak beans overnight","Boil beans with sorghum leaves","Add rice and cook together","Drain and serve with stew");

        Recipe alfredo = recipeRepository.save(Recipe.builder()
                .title("Chicken Alfredo").culturalOrigin("Italy")
                .calories(450).cookTime(25).servings(2).mealFrequency("Once daily")
                .averageRating(4.7).premium(false).country("GH")
                .approvalStatus(Recipe.ApprovalStatus.APPROVED).build());
        saveIngredients(alfredo, "200g fettuccine","250g chicken breast","200ml heavy cream","50g parmesan","2 garlic cloves","Butter");
        saveSteps(alfredo, "Cook pasta al dente","Pan-fry chicken until golden","Make cream sauce with garlic and butter","Add parmesan and stir","Toss pasta and chicken in sauce");

        Recipe sushi = recipeRepository.save(Recipe.builder()
                .title("Sushi Rolls").culturalOrigin("Japan")
                .calories(280).cookTime(45).servings(3).mealFrequency("Once daily")
                .averageRating(4.8).premium(true).country("GH")
                .approvalStatus(Recipe.ApprovalStatus.APPROVED).build());
        saveIngredients(sushi, "2 cups sushi rice","Nori sheets","Salmon or tuna","Cucumber","Avocado","Soy sauce");
        saveSteps(sushi, "Cook and season sushi rice","Lay nori on bamboo mat","Spread rice evenly","Add fillings","Roll tightly and slice");

        Recipe banku = recipeRepository.save(Recipe.builder()
                .title("Banku & Tilapia").culturalOrigin("Ghana")
                .calories(380).cookTime(40).servings(2).mealFrequency("Once daily")
                .averageRating(4.9).premium(false).country("GH")
                .approvalStatus(Recipe.ApprovalStatus.APPROVED).build());
        saveIngredients(banku, "2 cups fermented corn dough","1 cup cassava dough","Tilapia fish","Pepper sauce","Salt");
        saveSteps(banku, "Mix corn and cassava dough","Cook on medium heat stirring continuously","Grill tilapia with spices","Serve with pepper sauce");

        Recipe smoothie = recipeRepository.save(Recipe.builder()
                .title("Mango Smoothie").culturalOrigin("West Africa")
                .calories(150).cookTime(5).servings(2).mealFrequency("2x daily")
                .averageRating(4.6).premium(false).country("GH")
                .approvalStatus(Recipe.ApprovalStatus.APPROVED).build());
        saveIngredients(smoothie, "2 ripe mangoes","1 cup yogurt","1 cup milk","1 tbsp honey","Ice cubes");
        saveSteps(smoothie, "Peel and dice mangoes","Blend all ingredients until smooth","Pour and serve chilled");

        log.info("✅ 6 recipes seeded with ingredients and steps");
    }

    private void saveIngredients(Recipe recipe, String... ingredients) {
        for (String ingredient : ingredients) {
            recipeIngredientRepository.save(RecipeIngredient.builder()
                    .recipe(recipe).ingredient(ingredient).build());
        }
    }

    private void saveSteps(Recipe recipe, String... steps) {
        for (int i = 0; i < steps.length; i++) {
            recipeStepRepository.save(RecipeStep.builder()
                    .recipe(recipe).stepNumber(i + 1).instruction(steps[i]).build());
        }
    }

    private List<Vendor> seedVendors() {
        if (vendorRepository.count() > 0) {
            return vendorRepository.findAll().stream()
                    .filter(v -> v.getApprovalStatus() == Vendor.ApprovalStatus.approved)
                    .sorted(java.util.Comparator.comparing(Vendor::getName))
                    .toList();
        }

        User u1 = createVendorUser("Akosua Mensah",  "mamaakos@dishaspora.com");
        User u2 = createVendorUser("Kwabena Owusu",  "spicegarden@dishaspora.com");
        User u3 = createVendorUser("Linda Chen",     "asiabites@dishaspora.com");

        List<Vendor> vendors = List.of(
            Vendor.builder().name("Mama Akos Kitchen").description("Authentic Ghanaian home cooking")
                .country("GH").city("Kumasi").averageRating(4.9)
                .featured(false).approvalStatus(Vendor.ApprovalStatus.approved).user(u1).build(),

            Vendor.builder().name("Spice Garden").description("Continental dishes with a local twist")
                .country("GH").city("Accra").averageRating(4.7)
                .featured(true).approvalStatus(Vendor.ApprovalStatus.approved).user(u2).build(),

            Vendor.builder().name("Asia Bites").description("Fresh Asian fusion cuisine")
                .country("GH").city("Kumasi").averageRating(4.8)
                .featured(true).approvalStatus(Vendor.ApprovalStatus.approved).user(u3).build()
        );

        vendorRepository.saveAll(vendors);
        log.info("✅ 3 vendors seeded");
        return vendorRepository.findAll().stream()
                .sorted(java.util.Comparator.comparing(Vendor::getName))
                .toList();
    }

    private User createVendorUser(String name, String email) {
        if (userRepository.existsByEmail(email)) return userRepository.findByEmail(email).get();
        return userRepository.save(User.builder()
                .name(name).email(email)
                .password(passwordEncoder.encode("vendor123"))
                .country("GH").role(User.Role.vendor)
                .build());
    }

    private void seedFoodListings(List<Vendor> vendors) {
        if (foodListingRepository.count() > 0) return;
        if (vendors.size() < 3) return;

        Vendor asiaBites   = vendors.get(0);
        Vendor mamaAkos    = vendors.get(1);
        Vendor spiceGarden = vendors.get(2);

        foodListingRepository.saveAll(List.of(
            FoodListing.builder().name("Waakye Combo").description("Waakye with fish, egg, and shito")
                .price(25).country("GH").stockQuantity(20).vendor(mamaAkos).build(),
            FoodListing.builder().name("Kontomire Stew").description("Cocoyam leaf stew with smoked fish")
                .price(28).country("GH").stockQuantity(15).vendor(mamaAkos).build(),
            FoodListing.builder().name("Jollof + Grilled Chicken").description("Smoky jollof rice with grilled chicken")
                .price(35).country("GH").stockQuantity(18).featured(true).vendor(spiceGarden).build(),
            FoodListing.builder().name("Basmati Rice (2kg)").description("Premium basmati rice")
                .price(18).country("GH").stockQuantity(40).featured(true).vendor(asiaBites).build(),
            FoodListing.builder().name("Kelewele").description("Spiced fried plantain cubes")
                .price(15).country("GH").stockQuantity(25).featured(true).vendor(asiaBites).build()
        ));
        log.info("✅ 5 food listings seeded");
    }

    private void seedSubscriptionPlans() {
        if (subscriptionPlanRepository.count() > 0) return;
        subscriptionPlanRepository.saveAll(List.of(
            SubscriptionPlan.builder().name("Free").planType(SubscriptionPlan.PlanType.free)
                .priceMonthly(0).priceAnnual(0)
                .description("Basic access to recipes and marketplace")
                .hasVideoAccess(false).hasAudioAccess(false).hasChatSupport(false)
                .hasAdFree(false).active(true).build(),

            SubscriptionPlan.builder().name("Premium").planType(SubscriptionPlan.PlanType.premium)
                .priceMonthly(4.99).priceAnnual(49.99)
                .description("Full access to videos, audio guides and live chef chat")
                .hasVideoAccess(true).hasAudioAccess(true).hasChatSupport(true)
                .hasAdFree(true).active(true).build(),

            SubscriptionPlan.builder().name("Vendor Basic").planType(SubscriptionPlan.PlanType.vendor_basic)
                .priceMonthly(9.99).priceAnnual(99.99)
                .description("Sell on Dishaspora with up to 20 listings")
                .hasVideoAccess(false).hasAudioAccess(false).hasChatSupport(false)
                .hasAdFree(false).maxListings(20).active(true).build(),

            SubscriptionPlan.builder().name("Vendor Pro").planType(SubscriptionPlan.PlanType.vendor_pro)
                .priceMonthly(24.99).priceAnnual(249.99)
                .description("Unlimited listings with featured placement")
                .hasVideoAccess(false).hasAudioAccess(false).hasChatSupport(true)
                .hasAdFree(false).active(true).build()
        ));
        log.info("✅ 4 subscription plans seeded");
    }
}
