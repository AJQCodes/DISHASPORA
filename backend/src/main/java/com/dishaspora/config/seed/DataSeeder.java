package com.dishaspora.config.seed;

import com.dishaspora.auth.entity.User;
import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.Role;
import com.dishaspora.common.enums.Enums.VendorType;
import com.dishaspora.marketplace.entity.Listing;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.recipe.entity.Recipe;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds the demo dataset described in docs/API.md. Runs only when the user
 * table is empty so restarts never duplicate data.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final SeedSupport s;
    private final GhanaRecipeSeeder ghanaRecipes;
    private final NigeriaRecipeSeeder nigeriaRecipes;
    private final WorldRecipeSeeder worldRecipes;
    private final ListingSeeder listingSeeder;
    private final MiscSeeder miscSeeder;

    public DataSeeder(SeedSupport s, GhanaRecipeSeeder ghanaRecipes, NigeriaRecipeSeeder nigeriaRecipes,
                      WorldRecipeSeeder worldRecipes, ListingSeeder listingSeeder, MiscSeeder miscSeeder) {
        this.s = s;
        this.ghanaRecipes = ghanaRecipes;
        this.nigeriaRecipes = nigeriaRecipes;
        this.worldRecipes = worldRecipes;
        this.listingSeeder = listingSeeder;
        this.miscSeeder = miscSeeder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (s.users.count() > 0) {
            log.info("DataSeeder skipped: users already present");
            return;
        }
        log.info("DataSeeder: seeding demo data...");

        // ---- Accounts (per API.md) ----
        s.user("Dishaspora Admin", "admin@dishaspora.com", "Admin123!", Role.ADMIN, "GH", 1, false);
        User ama = s.user("Ama Mensah", "ama@demo.com", "Demo123!", Role.USER, "GH", 2, true);
        User chinedu = s.user("Chinedu Okafor", "chinedu@demo.com", "Demo123!", Role.USER, "NG", 3, false);
        User vendorGhOwner = s.user("Akosua Boateng", "vendor.gh@demo.com", "Demo123!", Role.VENDOR, "GH", 4, false);
        User vendorNgOwner = s.user("Emeka Eze", "vendor.ng@demo.com", "Demo123!", Role.VENDOR, "NG", 5, false);
        User ghKitchenOwner = s.user("Kofi Asante", "kitchen.gh@demo.com", "Demo123!", Role.VENDOR, "GH", 6, false);
        User ngKitchenOwner = s.user("Bisi Adeyemi", "kitchen.ng@demo.com", "Demo123!", Role.VENDOR, "NG", 7, false);
        User ghGrocerOwner = s.user("Yaw Darko", "grocer.gh@demo.com", "Demo123!", Role.VENDOR, "GH", 8, false);
        User ngGrocerOwner = s.user("Ngozi Nwosu", "grocer.ng@demo.com", "Demo123!", Role.VENDOR, "NG", 1, false);
        User pendingVendorOwner = s.user("Efua Owusu", "pending.vendor@demo.com", "Demo123!", Role.USER, "GH", 2, false);

        // ---- Vendors ----
        Vendor vGh = s.vendor(vendorGhOwner, "Auntie Ama's Kitchen",
                "Home-style Ghanaian cooking and market-fresh ingredients, straight from Osu.",
                "GH", VendorType.BOTH, 1, 1, "Ghanaian classics", "Osu, Accra", "+233 24 000 1111",
                4.6, 87, ApprovalStatus.APPROVED);
        Vendor vNg = s.vendor(vendorNgOwner, "Mama Nkechi's Pot",
                "Authentic Naija soups, suya and pantry staples from the heart of Lagos.",
                "NG", VendorType.BOTH, 2, 2, "Nigerian soups & grills", "Surulere, Lagos", "+234 80 000 2222",
                4.7, 104, ApprovalStatus.APPROVED);
        Vendor vGhKitchen = s.vendor(ghKitchenOwner, "Accra Fusion Grill",
                "Continental favourites with a West African soul - pizza, burgers and shawarma done right.",
                "GH", VendorType.FOOD, 3, 3, "Continental & grills", "East Legon, Accra", "+233 24 000 3333",
                4.4, 52, ApprovalStatus.APPROVED);
        Vendor vNgKitchen = s.vendor(ngKitchenOwner, "Lagos Bistro",
                "From fried rice to caesar salad - continental plates with Lagos energy.",
                "NG", VendorType.FOOD, 4, 4, "Continental dishes", "Lekki, Lagos", "+234 80 000 4444",
                4.3, 47, ApprovalStatus.APPROVED);
        Vendor vGhGrocer = s.vendor(ghGrocerOwner, "Makola Fresh Market",
                "Market-run ingredient shop: fresh produce, grains, oils and spices delivered same day.",
                "GH", VendorType.INGREDIENT, 5, 1, "Fresh ingredients", "Makola, Accra", "+233 24 000 5555",
                4.5, 63, ApprovalStatus.APPROVED);
        Vendor vNgGrocer = s.vendor(ngGrocerOwner, "Mile 12 Pantry",
                "Everything your Nigerian kitchen needs - from egusi to palm oil - sourced daily from Mile 12.",
                "NG", VendorType.INGREDIENT, 6, 2, "Fresh ingredients", "Ketu, Lagos", "+234 80 000 6666",
                4.6, 71, ApprovalStatus.APPROVED);
        Vendor vPending = s.vendor(pendingVendorOwner, "Efua's Chop Bar",
                "Traditional chop bar meals made with love in Kumasi.",
                "GH", VendorType.FOOD, 7, 3, "Ashanti specialties", "Adum, Kumasi", "+233 24 000 7777",
                0, 0, ApprovalStatus.PENDING);

        // ---- Recipes (36 approved + 2 pending, images recipe-1..38 in order) ----
        ghanaRecipes.seed(vGh);
        nigeriaRecipes.seed(vNg);
        worldRecipes.seedContinental(vGhKitchen, vNgKitchen);
        worldRecipes.seedDrinks(vGh, vNg);
        worldRecipes.seedPending(vGh, vNg);

        // ---- Listings (40 approved + 2 pending) ----
        listingSeeder.seed(vGh, vNg, vGhGrocer, vNgGrocer);

        // ---- Reviews, flags, orders, chat, saved/cooked ----
        miscSeeder.seedReviews(ama, chinedu);

        Recipe pendingRecipe = s.recipes.findByStatus(ApprovalStatus.PENDING).stream()
                .findFirst().orElse(null);
        Listing pendingListing = s.listings.findByStatus(ApprovalStatus.PENDING).stream()
                .findFirst().orElse(null);
        if (pendingRecipe != null && pendingListing != null) {
            miscSeeder.seedFlags(pendingRecipe.getId(), pendingRecipe.getTitle(),
                    pendingListing.getId(), pendingListing.getTitle(),
                    vPending.getId(), vPending.getName());
        }

        miscSeeder.seedOrders(ama, chinedu);
        miscSeeder.seedChat(ama, vGh, vendorGhOwner);
        miscSeeder.seedSavedAndCooked(ama, chinedu);

        log.info("DataSeeder: done. {} users, {} vendors, {} recipes, {} listings seeded.",
                s.users.count(), s.vendors.count(), s.recipes.count(), s.listings.count());
    }
}
