package com.dishaspora.config.seed;

import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.MealType;
import com.dishaspora.common.enums.Enums.RecipeCategory;
import com.dishaspora.marketplace.entity.Vendor;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.dishaspora.config.seed.SeedSupport.ing;
import static com.dishaspora.config.seed.SeedSupport.st;

/**
 * Seeds the 8 continental/foreign recipes (recipe-25..32), 4 drinks
 * (recipe-33..36) and 2 PENDING recipes (recipe-37..38).
 */
@Component
public class WorldRecipeSeeder {

    private final SeedSupport s;

    public WorldRecipeSeeder(SeedSupport s) {
        this.s = s;
    }

    public void seedContinental(Vendor ghKitchen, Vendor ngKitchen) {
        s.recipe(ghKitchen, "Margherita Pizza",
                "Classic Neapolitan-style pizza with a thin chewy crust, tomato sauce, fresh mozzarella and basil.",
                RecipeCategory.FOREIGN, "Italian", "ITALY", MealType.DINNER, 25, 850, 2, 90, 15,
                "Once a week",
                "Refined flour and cheese make this an indulgence; keep it to pizza night.",
                "Legend says the Margherita was created in Naples in 1889 for Queen Margherita, its toppings mirroring the Italian flag. It remains the purest test of any pizzaiolo.",
                1, 4.7, 104, ApprovalStatus.APPROVED,
                List.of(ing("Pizza flour", "400", "g"), ing("Instant yeast", "1", "tsp"),
                        ing("Fresh tomatoes", "4", "pcs"), ing("Mozzarella", "200", "g"),
                        ing("Fresh basil", "1", "bunch"), ing("Olive oil", "3", "tbsp"),
                        ing("Salt", "1", "tsp"), ing("Sugar", "1/2", "tsp")),
                List.of(st(1, "Knead flour, yeast, water and salt into a smooth dough.", 15),
                        st(2, "Let the dough rise until doubled.", 60),
                        st(3, "Crush tomatoes with salt and a little olive oil for the sauce.", 5),
                        st(4, "Stretch the dough thin, keeping a puffy rim.", 8),
                        st(5, "Top with sauce and torn mozzarella; bake at maximum heat.", 12),
                        st(6, "Finish with basil and a drizzle of olive oil.", 2)));

        s.recipe(ghKitchen, "Beef Burger",
                "Juicy smashed beef patty with melted cheese, lettuce, tomato and burger sauce in a toasted brioche bun.",
                RecipeCategory.CONTINENTAL, "American", "USA", MealType.LUNCH, 26, 790, 2, 20, 15,
                "Once a week",
                "Red meat and a rich bun; a satisfying treat rather than a staple.",
                "The hamburger grew from German immigrant kitchens into America's defining sandwich. The smash technique - pressing the patty onto a screaming-hot griddle - is prized for its crust.",
                2, 4.6, 92, ApprovalStatus.APPROVED,
                List.of(ing("Minced beef (80/20)", "400", "g"), ing("Brioche buns", "2", "pcs"),
                        ing("Cheddar cheese", "2", "slices"), ing("Lettuce", "2", "leaves"),
                        ing("Fresh tomatoes", "1", "pc"), ing("Onions", "1", "pc"),
                        ing("Mayonnaise", "2", "tbsp"), ing("Ketchup", "1", "tbsp"),
                        ing("Mustard", "1", "tsp")),
                List.of(st(1, "Divide the beef into loose balls and season with salt.", 5),
                        st(2, "Mix mayo, ketchup and mustard into a burger sauce.", 3),
                        st(3, "Smash the beef balls onto a very hot griddle.", 4),
                        st(4, "Flip when crusted, top with cheese and finish cooking.", 4),
                        st(5, "Toast the buns in the beef fat.", 3),
                        st(6, "Stack with sauce, lettuce, tomato and onion; serve hot.", 3)));

        s.recipe(ghKitchen, "Chicken Shawarma",
                "Marinated chicken roasted until charred, wrapped in flatbread with garlic sauce, pickles and fries.",
                RecipeCategory.FOREIGN, "Lebanese", "LEBANON", MealType.DINNER, 27, 680, 3, 30, 25,
                "Once a week",
                "Lean chicken but rich sauces; a solid occasional dinner wrap.",
                "Shawarma spread from Levantine spit-roasters across the world, and West African cities embraced it as late-night royalty. The garlic toum is the soul of a proper wrap.",
                3, 4.7, 110, ApprovalStatus.APPROVED,
                List.of(ing("Chicken thighs", "600", "g"), ing("Plain yogurt", "150", "g"),
                        ing("Garlic", "6", "cloves"), ing("Shawarma spice blend", "2", "tbsp"),
                        ing("Flatbreads", "3", "pcs"), ing("Pickles", "6", "pcs"),
                        ing("Fresh tomatoes", "2", "pcs"), ing("Lemon", "1", "pc"),
                        ing("Mayonnaise", "3", "tbsp")),
                List.of(st(1, "Marinate the chicken in yogurt, spices, garlic and lemon.", 15),
                        st(2, "Roast or pan-sear the chicken until charred at the edges.", 20),
                        st(3, "Rest, then slice the chicken thinly.", 5),
                        st(4, "Blend garlic, lemon and mayo into a quick garlic sauce.", 5),
                        st(5, "Warm the flatbreads and layer sauce, chicken, pickles and tomato.", 5),
                        st(6, "Roll tightly, toast the wrap seam-down and serve.", 5)));

        s.recipe(ghKitchen, "Spaghetti Bolognese",
                "Slow-simmered beef and tomato ragu folded through spaghetti with parmesan.",
                RecipeCategory.FOREIGN, "Italian", "ITALY", MealType.DINNER, 28, 720, 4, 15, 75,
                "Once a week",
                "Hearty red-meat pasta; keep portions sensible and add a side salad.",
                "Ragu alla bolognese has simmered in Bologna's kitchens for centuries, though the world knows it best over spaghetti. The secret is patience - the long, low simmer.",
                4, 4.5, 85, ApprovalStatus.APPROVED,
                List.of(ing("Spaghetti", "400", "g"), ing("Minced beef", "500", "g"),
                        ing("Fresh tomatoes", "5", "pcs"), ing("Tomato paste", "2", "tbsp"),
                        ing("Onions", "1", "pc"), ing("Carrots", "1", "pc"),
                        ing("Celery", "1", "stick"), ing("Garlic", "3", "cloves"),
                        ing("Parmesan", "50", "g"), ing("Olive oil", "3", "tbsp")),
                List.of(st(1, "Soften diced onion, carrot and celery in olive oil.", 8),
                        st(2, "Brown the minced beef, breaking it up well.", 8),
                        st(3, "Stir in garlic, tomato paste and chopped tomatoes.", 5),
                        st(4, "Simmer low and slow, topping up with stock.", 60),
                        st(5, "Cook the spaghetti al dente and toss with the ragu.", 10),
                        st(6, "Serve with grated parmesan.", 2)));

        s.recipe(ngKitchen, "Fried Rice",
                "Wok-tossed rice with mixed vegetables, egg, shrimp and soy - a takeaway classic made fresh.",
                RecipeCategory.CONTINENTAL, "Chinese", "CHINA", MealType.LUNCH, 29, 580, 4, 20, 15,
                "2-3 times per week",
                "Veg-heavy and quick; go light on oil and soy to keep it lean.",
                "Fried rice began as a thrifty way to revive yesterday's rice in Chinese kitchens. In West Africa it became a party essential, sharing the celebration table with jollof.",
                5, 4.4, 77, ApprovalStatus.APPROVED,
                List.of(ing("Cooked rice (day-old)", "4", "cups"), ing("Shrimp", "200", "g"),
                        ing("Eggs", "3", "pcs"), ing("Carrots", "2", "pcs"),
                        ing("Green peas", "1", "cup"), ing("Sweet corn", "1/2", "cup"),
                        ing("Spring onions", "4", "stalks"), ing("Soy sauce", "3", "tbsp"),
                        ing("Vegetable oil", "3", "tbsp"), ing("Garlic", "2", "cloves")),
                List.of(st(1, "Dice the vegetables and scramble the eggs; set aside.", 8),
                        st(2, "Stir-fry garlic and shrimp in a hot wok.", 4),
                        st(3, "Add carrots, peas and corn; toss until crisp-tender.", 4),
                        st(4, "Add the rice, breaking clumps, and fry on high heat.", 6),
                        st(5, "Season with soy, return the eggs, and toss with spring onions.", 4)));

        s.recipe(ngKitchen, "Caesar Salad",
                "Crisp romaine with creamy anchovy-parmesan dressing, garlic croutons and grilled chicken.",
                RecipeCategory.CONTINENTAL, "American", "USA", MealType.LUNCH, 30, 430, 2, 20, 15,
                "2-3 times per week",
                "Fresh greens and lean chicken; watch the dressing to keep it light.",
                "The Caesar was improvised in 1924 by Caesar Cardini in Tijuana when the kitchen ran low. Tossed tableside, it became the world's most famous salad.",
                6, 4.3, 54, ApprovalStatus.APPROVED,
                List.of(ing("Romaine lettuce", "2", "heads"), ing("Chicken breast", "300", "g"),
                        ing("Parmesan", "60", "g"), ing("Bread (for croutons)", "3", "slices"),
                        ing("Anchovy fillets", "4", "pcs"), ing("Egg yolk", "1", "pc"),
                        ing("Garlic", "2", "cloves"), ing("Lemon", "1", "pc"),
                        ing("Olive oil", "80", "ml")),
                List.of(st(1, "Season and grill the chicken breast; rest and slice.", 15),
                        st(2, "Toast bread cubes in olive oil and garlic for croutons.", 8),
                        st(3, "Whisk yolk, anchovies, garlic, lemon and oil into a dressing.", 6),
                        st(4, "Toss the chopped romaine with dressing and parmesan.", 4),
                        st(5, "Top with chicken, croutons and shaved parmesan.", 3)));

        s.recipe(ngKitchen, "Grilled Chicken Breast",
                "Herb-marinated chicken breast grilled juicy, with charred vegetables and a lemon finish.",
                RecipeCategory.CONTINENTAL, "Continental", "USA", MealType.DINNER, 31, 390, 2, 15, 20,
                "3-4 times per week",
                "Lean protein with vegetables - one of the lightest mains on the platform.",
                "Simple grilled chicken is the quiet workhorse of continental menus everywhere. Done right - brined, marinated and rested - it proves plain food can be memorable.",
                7, 4.2, 48, ApprovalStatus.APPROVED,
                List.of(ing("Chicken breast", "2", "pcs"), ing("Olive oil", "3", "tbsp"),
                        ing("Garlic", "3", "cloves"), ing("Rosemary", "2", "sprigs"),
                        ing("Lemon", "1", "pc"), ing("Zucchini", "1", "pc"),
                        ing("Bell peppers", "2", "pcs"), ing("Salt and black pepper", "1", "tsp")),
                List.of(st(1, "Butterfly the breasts and marinate in oil, garlic, rosemary and lemon.", 12),
                        st(2, "Preheat the grill or griddle until very hot.", 5),
                        st(3, "Grill the chicken 4-5 minutes per side until charred and cooked.", 10),
                        st(4, "Grill the zucchini and peppers alongside.", 8),
                        st(5, "Rest the chicken, squeeze over lemon and serve.", 4)));

        s.recipe(ngKitchen, "Arabian Beef Kebab",
                "Spiced minced beef kofta kebabs grilled on skewers, served with flatbread, sumac onions and yogurt.",
                RecipeCategory.FOREIGN, "Arabian", "SAUDI ARABIA", MealType.DINNER, 32, 610, 4, 25, 15,
                "Once a week",
                "Grilled red meat with fresh sides; a flavourful weekly indulgence.",
                "Kofta kebabs trace back centuries along Middle Eastern caravan routes, where spiced meat met open fire. Every family spice mix tells its own story of the trade winds.",
                8, 4.5, 59, ApprovalStatus.APPROVED,
                List.of(ing("Minced beef", "600", "g"), ing("Onions", "2", "pcs"),
                        ing("Parsley", "1", "bunch"), ing("Baharat spice blend", "2", "tbsp"),
                        ing("Garlic", "3", "cloves"), ing("Flatbreads", "4", "pcs"),
                        ing("Plain yogurt", "200", "g"), ing("Sumac", "1", "tsp"),
                        ing("Salt", "1", "tsp")),
                List.of(st(1, "Grate the onion and squeeze out the juice.", 5),
                        st(2, "Knead beef with onion, parsley, garlic, baharat and salt.", 10),
                        st(3, "Mould the mix onto flat skewers in long kofta shapes.", 10),
                        st(4, "Grill over high heat, turning once, until charred.", 10),
                        st(5, "Toss sliced onions with sumac; warm the flatbreads.", 5),
                        st(6, "Serve the kebabs with bread, onions and yogurt.", 3)));
    }

    public void seedDrinks(Vendor gh, Vendor ng) {
        s.recipe(gh, "Sobolo",
                "Ghana's ruby hibiscus drink brewed with ginger, cloves and pineapple peel, served chilled.",
                RecipeCategory.DRINK, "Ghanaian", "GH", MealType.DRINK, 33, 120, 6, 10, 30,
                "Daily",
                "Hibiscus is rich in antioxidants; go easy on added sugar.",
                "Sobolo colours every Ghanaian celebration deep red, sold in repurposed bottles at markets and parties. Brewers pride themselves on their spice balance and just-right sweetness.",
                1, 4.6, 72, ApprovalStatus.APPROVED,
                List.of(ing("Dried hibiscus petals", "2", "cups"), ing("Fresh ginger", "3", "thumbs"),
                        ing("Pineapple peel", "1", "fruit's worth"), ing("Cloves", "6", "pcs"),
                        ing("Sugar", "1/2", "cup"), ing("Water", "3", "litres"),
                        ing("Mint leaves", "1", "handful")),
                List.of(st(1, "Rinse the hibiscus petals thoroughly.", 5),
                        st(2, "Boil petals with ginger, cloves and pineapple peel.", 25),
                        st(3, "Steep off the heat until deeply coloured.", 15),
                        st(4, "Strain, sweeten to taste and add mint.", 5),
                        st(5, "Chill well and serve over ice.", 5)));

        s.recipe(ng, "Zobo",
                "Nigeria's spiced hibiscus refresher infused with ginger, garlic hints and pineapple, best ice-cold.",
                RecipeCategory.DRINK, "Nigerian", "NG", MealType.DRINK, 34, 110, 6, 10, 30,
                "Daily",
                "Low-calorie herbal drink when lightly sweetened.",
                "Zobo is Nigeria's answer to soda - hibiscus brewed at home and hawked in traffic in chilled bottles. Each seller's spice infusion is a small trade secret.",
                2, 4.5, 64, ApprovalStatus.APPROVED,
                List.of(ing("Dried zobo (hibiscus) leaves", "2", "cups"), ing("Fresh ginger", "2", "thumbs"),
                        ing("Pineapple", "1/2", "fruit"), ing("Cucumber", "1", "pc"),
                        ing("Cloves", "5", "pcs"), ing("Sugar or dates", "1/2", "cup"),
                        ing("Water", "3", "litres")),
                List.of(st(1, "Wash the zobo leaves well to remove grit.", 5),
                        st(2, "Boil with ginger and cloves until the water is deep crimson.", 25),
                        st(3, "Add pineapple chunks and steep.", 15),
                        st(4, "Strain, sweeten and blend in a little pineapple if desired.", 8),
                        st(5, "Bottle, chill and garnish with cucumber slices.", 5)));

        s.recipe(ng, "Chapman",
                "Nigeria's signature mocktail - a fizzy blend of Fanta, Sprite, blackcurrant and bitters over cucumber and citrus.",
                RecipeCategory.DRINK, "Nigerian", "NG", MealType.DRINK, 35, 180, 2, 10, 0,
                "Once a week",
                "A sweet soda-based mocktail; a festive treat rather than a daily drink.",
                "Invented at a Lagos club bar, the Chapman became the toast of Nigerian socialising. Served in a big beer mug with cucumber ribbons, it says celebration without alcohol.",
                3, 4.4, 51, ApprovalStatus.APPROVED,
                List.of(ing("Fanta", "300", "ml"), ing("Sprite", "300", "ml"),
                        ing("Blackcurrant cordial", "60", "ml"), ing("Angostura bitters", "1", "tsp"),
                        ing("Cucumber", "1/2", "pc"), ing("Lemon", "1", "pc"),
                        ing("Orange", "1", "pc"), ing("Ice cubes", "2", "cups")),
                List.of(st(1, "Fill a large mug with ice, cucumber and citrus slices.", 4),
                        st(2, "Add the blackcurrant cordial and bitters.", 2),
                        st(3, "Pour in Fanta and Sprite gently.", 2),
                        st(4, "Stir once, garnish and serve immediately.", 2)));

        s.recipe(gh, "Mango Smoothie",
                "Thick tropical smoothie of ripe mango, banana and yogurt with a squeeze of lime.",
                RecipeCategory.DRINK, "Continental", "GH", MealType.DRINK, 36, 240, 2, 10, 0,
                "Daily",
                "Whole fruit and yogurt - a nutritious drink; mind natural sugars.",
                "When mango season floods West African markets with golden fruit, blenders hum in every kitchen. This smoothie is the simplest way to bottle sunshine.",
                4, 4.5, 45, ApprovalStatus.APPROVED,
                List.of(ing("Ripe mango", "2", "pcs"), ing("Banana", "1", "pc"),
                        ing("Plain yogurt", "200", "g"), ing("Honey", "1", "tbsp"),
                        ing("Lime", "1/2", "pc"), ing("Ice cubes", "1", "cup")),
                List.of(st(1, "Peel and cube the mango and banana.", 5),
                        st(2, "Blend the fruit with yogurt, honey and ice until smooth.", 3),
                        st(3, "Brighten with lime juice and blend once more.", 1),
                        st(4, "Pour into chilled glasses and serve.", 1)));
    }

    public void seedPending(Vendor gh, Vendor ng) {
        s.recipe(gh, "Ga Kenkey Special",
                "A premium take on Ga kenkey with double-fermented dough and an extra-fiery pepper trio.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.LUNCH, 37, 630, 2, 25, 90,
                "1-2 times per week",
                "Fermented corn staple; hearty and filling.",
                "A modern tribute to the Ga fishing communities of Jamestown, where kenkey pots have boiled for generations by the sea.",
                5, 0, 0, ApprovalStatus.PENDING,
                List.of(ing("Fermented corn dough", "1", "kg"), ing("Corn husks", "10", "pcs"),
                        ing("Scotch bonnet pepper", "5", "pcs"), ing("Onions", "2", "pcs"),
                        ing("Fresh tomatoes", "2", "pcs"), ing("Fried fish", "2", "pcs")),
                List.of(st(1, "Prepare the aflata from half the dough.", 15),
                        st(2, "Knead, shape and wrap the kenkey balls.", 20),
                        st(3, "Boil until firm and fragrant.", 80),
                        st(4, "Grind the triple pepper sauce.", 10),
                        st(5, "Serve with fried fish.", 5)));

        s.recipe(ng, "Ewa Agoyin",
                "Soft-mashed beans with the famous scorched-pepper agoyin sauce, Lagos street style.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.BREAKFAST, 38, 570, 3, 15, 75,
                "2-3 times per week",
                "Bean-based with a rich pepper oil; filling and protein-forward.",
                "Ewa agoyin arrived in Lagos with Beninese cooks whose burnt-pepper sauce turned plain beans into a street food legend, best mopped up with soft agege bread.",
                6, 0, 0, ApprovalStatus.PENDING,
                List.of(ing("Honey beans", "3", "cups"), ing("Palm oil", "200", "ml"),
                        ing("Dried bell peppers", "6", "pcs"), ing("Dried chilli pepper", "3", "pcs"),
                        ing("Onions", "3", "pcs"), ing("Ground crayfish", "2", "tbsp"),
                        ing("Agege bread", "1", "loaf")),
                List.of(st(1, "Boil the beans until very soft and mash lightly.", 70),
                        st(2, "Soak and grind the dried peppers with onions.", 10),
                        st(3, "Fry sliced onions in palm oil until nearly burnt.", 10),
                        st(4, "Add the pepper paste and fry dark and smoky.", 15),
                        st(5, "Serve the mashed beans topped with sauce and bread.", 5)));
    }
}
