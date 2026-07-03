package com.dishaspora.config.seed;

import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.ListingType;
import com.dishaspora.marketplace.entity.Vendor;
import org.springframework.stereotype.Component;

/**
 * Seeds the marketplace listings: food listings from the kitchens plus
 * ingredient listings that cover the common seed-recipe ingredients per
 * country so the One-Click Ingredient Basket matches well.
 */
@Component
public class ListingSeeder {

    private final SeedSupport s;

    public ListingSeeder(SeedSupport s) {
        this.s = s;
    }

    public void seed(Vendor ghBoth, Vendor ngBoth, Vendor ghGrocer, Vendor ngGrocer) {
        seedFood(ghBoth, ngBoth);
        seedIngredients(ghGrocer, 1);   // GH prices in pesewas
        seedIngredients(ngGrocer, 25);  // NG prices scaled to kobo
        seedPending(ghBoth, ngGrocer);
    }

    private void seedFood(Vendor gh, Vendor ng) {
        ApprovalStatus ok = ApprovalStatus.APPROVED;
        s.listing(gh, ListingType.FOOD, "Jollof Rice with Grilled Chicken",
                "Party jollof with a smoky kick, served with a grilled chicken leg and salad.",
                1, 4500, 6000L, 25, "1", "pack", 31, s.recipeIdByTitle("Jollof Rice"), ok);
        s.listing(gh, ListingType.FOOD, "Waakye Special Combo",
                "Waakye with gari, spaghetti, boiled egg, fried fish and shito.",
                2, 4000, null, 20, "1", "pack", 25, s.recipeIdByTitle("Waakye"), ok);
        s.listing(gh, ListingType.FOOD, "Banku & Grilled Tilapia Combo",
                "Two banku balls with charcoal-grilled tilapia and fresh pepper sauce.",
                3, 6500, 8000L, 15, "1", "pack", 40, s.recipeIdByTitle("Banku & Tilapia"), ok);
        s.listing(gh, ListingType.FOOD, "Kelewele Night Pack",
                "Spicy ginger kelewele with roasted groundnuts, fried fresh to order.",
                4, 1800, null, 40, "1", "pack", 15, s.recipeIdByTitle("Kelewele"), ok);
        s.listing(gh, ListingType.FOOD, "Red Red Bowl",
                "Palm-oil bean stew with caramelised fried plantain and gari sprinkle.",
                5, 3200, null, 22, "1", "bowl", 20, s.recipeIdByTitle("Red Red"), ok);

        s.listing(ng, ListingType.FOOD, "Nigerian Jollof Party Pack",
                "Smoky party jollof with fried plantain and peppered chicken.",
                6, 250000, 300000L, 30, "1", "pack", 35, s.recipeIdByTitle("Nigerian Jollof Rice"), ok);
        s.listing(ng, ListingType.FOOD, "Egusi & Pounded Yam Combo",
                "Rich egusi soup with assorted meat and two wraps of pounded yam.",
                7, 350000, null, 18, "1", "pack", 45, s.recipeIdByTitle("Egusi Soup & Pounded Yam"), ok);
        s.listing(ng, ListingType.FOOD, "Suya Skewers (6 sticks)",
                "Flame-grilled beef suya with yaji, onions and tomatoes.",
                8, 300000, null, 25, "6", "sticks", 20, s.recipeIdByTitle("Suya"), ok);
        s.listing(ng, ListingType.FOOD, "Moi Moi Wraps (4 pack)",
                "Leaf-wrapped moi moi with egg and mackerel filling.",
                9, 200000, 240000L, 20, "4", "wraps", 15, s.recipeIdByTitle("Moi Moi"), ok);
        s.listing(ng, ListingType.FOOD, "Catfish Pepper Soup Bowl",
                "Fresh catfish pepper soup with scent leaves - point-and-kill style.",
                10, 280000, null, 15, "1", "bowl", 25, s.recipeIdByTitle("Pepper Soup"), ok);
    }

    /** 15 ingredient staples per grocer; price base multiplied for NGN scale. */
    private void seedIngredients(Vendor grocer, int priceFactor) {
        ApprovalStatus ok = ApprovalStatus.APPROVED;
        int i = 11; // rotate through listing images 11..20+
        s.listing(grocer, ListingType.INGREDIENT, "Long Grain Rice",
                "Premium long grain rice, perfect for jollof and fried rice.",
                i++, 5000L * priceFactor, null, 60, "5", "kg", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Fresh Tomatoes",
                "Ripe, juicy tomatoes straight from the market.",
                i++, 1500L * priceFactor, null, 80, "1", "kg", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Onions",
                "Firm red onions, the base of every good stew.",
                i++, 1200L * priceFactor, null, 90, "1", "kg", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Scotch Bonnet Pepper",
                "Fiery fresh scotch bonnet pepper for authentic heat.",
                i++, 800L * priceFactor, null, 70, "250", "g", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Whole Chicken",
                "Farm-raised whole chicken, cleaned and ready to cook.",
                i++, 6000L * priceFactor, 7000L * priceFactor, 30, "1.5", "kg", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Beef Cuts",
                "Fresh boneless beef cuts, ideal for stews, suya and kebabs.",
                i++, 5500L * priceFactor, null, 35, "1", "kg", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Fresh Tilapia Fish",
                "Whole fresh tilapia fish, scaled and gutted.",
                i++, 4500L * priceFactor, null, 25, "2", "pcs", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Palm Oil (1L)",
                "Rich red palm oil, unrefined and full of flavour.",
                i++, 2500L * priceFactor, null, 50, "1", "litre", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Black-Eyed Beans",
                "Clean black-eyed beans for waakye, moi moi, akara and red red.",
                i++, 2200L * priceFactor, null, 55, "1", "kg", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Ripe Plantain (bunch)",
                "Sweet ripe plantain, perfect for kelewele, boli and dodo.",
                i++, 1800L * priceFactor, null, 45, "1", "bunch", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Puna Yam Tuber",
                "Large puna yam tuber for pounded yam, asaro and boiling.",
                i++, 2800L * priceFactor, null, 40, "1", "tuber", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Garri (1kg)",
                "Crisp white garri, toasted to perfection.",
                i++, 1000L * priceFactor, null, 65, "1", "kg", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Egusi (Melon Seeds)",
                "Ground egusi melon seeds for rich, nutty soups.",
                i++, 2000L * priceFactor, null, 40, "500", "g", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "Groundnut Paste",
                "Smooth roasted groundnut paste for soups and sauces.",
                i++, 1600L * priceFactor, null, 45, "500", "g", null, null, ok);
        s.listing(grocer, ListingType.INGREDIENT, "African Spice Mix",
                "House blend of curry, thyme, ginger, cloves and dried pepper spices.",
                i, 900L * priceFactor, null, 75, "200", "g", null, null, ok);
    }

    private void seedPending(Vendor gh, Vendor ngGrocer) {
        s.listing(gh, ListingType.FOOD, "Fufu Friday Bundle",
                "Fufu with light soup and goat meat, Fridays only.",
                19, 5500, null, 10, "1", "pack", 45, s.recipeIdByTitle("Fufu & Light Soup"),
                ApprovalStatus.PENDING);
        s.listing(ngGrocer, ListingType.INGREDIENT, "Dried Crayfish",
                "Aromatic dried crayfish, whole and ground options.",
                20, 45000, null, 30, "250", "g", null, null, ApprovalStatus.PENDING);
    }
}
