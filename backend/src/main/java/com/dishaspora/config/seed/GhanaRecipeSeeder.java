package com.dishaspora.config.seed;

import com.dishaspora.common.enums.Enums.ApprovalStatus;
import com.dishaspora.common.enums.Enums.MealType;
import com.dishaspora.common.enums.Enums.RecipeCategory;
import com.dishaspora.marketplace.entity.Vendor;
import com.dishaspora.recipe.entity.Recipe;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.dishaspora.config.seed.SeedSupport.ing;
import static com.dishaspora.config.seed.SeedSupport.st;

/** Seeds the ~12 approved Ghanaian recipes (images recipe-1..12). */
@Component
public class GhanaRecipeSeeder {

    private final SeedSupport s;

    public GhanaRecipeSeeder(SeedSupport s) {
        this.s = s;
    }

    public void seed(Vendor v) {
        Recipe jollof = s.recipe(v, "Jollof Rice",
                "Smoky Ghanaian party jollof cooked in a rich tomato and pepper base, finished over low heat for that signature bottom-of-the-pot flavour.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.LUNCH, 1, 620, 4, 20, 45,
                "2-3 times per week",
                "Balanced but rice-heavy; pair with extra vegetables or lean protein on repeat days.",
                "Jollof is West Africa's most loved rice dish and the heart of every Ghanaian party. Families guard their pepper-base recipes like treasure, and the friendly Ghana-Nigeria jollof rivalry has made the dish world famous.",
                1, 4.8, 132, ApprovalStatus.APPROVED,
                List.of(ing("Long grain rice", "3", "cups"), ing("Fresh tomatoes", "5", "pcs"),
                        ing("Tomato paste", "3", "tbsp"), ing("Onions", "2", "pcs"),
                        ing("Scotch bonnet pepper", "2", "pcs"), ing("Chicken", "1", "kg"),
                        ing("Vegetable oil", "120", "ml"), ing("Ginger and garlic paste", "2", "tbsp"),
                        ing("Curry powder", "1", "tbsp"), ing("Bay leaves", "2", "pcs")),
                List.of(st(1, "Blend tomatoes, one onion, scotch bonnet, ginger and garlic into a smooth pepper mix.", 10),
                        st(2, "Season the chicken and brown it in hot oil; set aside.", 10),
                        st(3, "Fry sliced onion and tomato paste in the same oil until deep red.", 8),
                        st(4, "Pour in the pepper mix, curry powder and bay leaves; simmer until thickened.", 12),
                        st(5, "Stir in washed rice and chicken stock, cover with foil and a lid.", 5),
                        st(6, "Cook on low heat until the rice is fluffy, stirring once halfway.", 25),
                        st(7, "Rest for 5 minutes, fluff and serve with the chicken.", 5)));
        jollof.setVideoUrl("/uploads/sample-jollof-video.mp4");
        jollof.setAudioUrl("/uploads/sample-jollof-audio.mp3");
        s.recipes.save(jollof);

        s.recipe(v, "Waakye",
                "Rice and beans simmered with dried millet leaves, served the classic street way with gari, spaghetti, boiled egg and shito.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.BREAKFAST, 2, 580, 4, 15, 60,
                "2-3 times per week",
                "Beans add fibre and protein, making this a filling but heavy plate best spaced out.",
                "Waakye began as a northern Ghanaian breakfast and conquered the whole country. The millet leaves that stain the rice its famous burgundy colour are still sold in little bundles at every market.",
                2, 4.7, 98, ApprovalStatus.APPROVED,
                List.of(ing("Rice", "2", "cups"), ing("Black-eyed beans", "1", "cup"),
                        ing("Dried millet leaves (waakye leaves)", "5", "pcs"), ing("Baking soda", "1/4", "tsp"),
                        ing("Gari", "1", "cup"), ing("Boiled eggs", "4", "pcs"),
                        ing("Spaghetti", "200", "g"), ing("Shito (black pepper sauce)", "4", "tbsp")),
                List.of(st(1, "Soak the beans for a few hours, then boil with baking soda until almost soft.", 30),
                        st(2, "Add the washed millet leaves and simmer until the water turns deep red.", 10),
                        st(3, "Remove the leaves, add rice and enough water, and season with salt.", 5),
                        st(4, "Cook until the rice and beans are tender and the colour is even.", 20),
                        st(5, "Boil spaghetti separately and prepare the boiled eggs.", 10),
                        st(6, "Serve with gari, spaghetti, egg and a generous spoon of shito.", 5)));

        s.recipe(v, "Banku & Tilapia",
                "Fermented corn and cassava dough cooked into a smooth banku, served with charcoal-grilled tilapia and fresh pepper sauce.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.DINNER, 3, 710, 2, 25, 40,
                "1-2 times per week",
                "A hearty fermented-dough meal; the grilled fish is lean but portions are generous.",
                "Banku and grilled tilapia is the pride of Ga and Ewe kitchens along Ghana's coast. Evening banku joints with smoking grills are a social institution in Accra, where the fish is always eaten by hand.",
                3, 4.8, 115, ApprovalStatus.APPROVED,
                List.of(ing("Fermented corn dough", "500", "g"), ing("Cassava dough", "250", "g"),
                        ing("Whole tilapia fish", "2", "pcs"), ing("Onions", "2", "pcs"),
                        ing("Fresh tomatoes", "3", "pcs"), ing("Scotch bonnet pepper", "3", "pcs"),
                        ing("Ginger", "1", "thumb"), ing("Vegetable oil", "2", "tbsp")),
                List.of(st(1, "Mix corn and cassava dough with water into a smooth slurry.", 5),
                        st(2, "Cook on medium heat, stirring firmly until it thickens into a stretchy ball.", 20),
                        st(3, "Score the tilapia and rub with blended ginger, onion and spices.", 10),
                        st(4, "Grill the fish over charcoal or under a broiler, turning once.", 20),
                        st(5, "Grind tomatoes, onions and pepper into a chunky fresh pepper sauce.", 8),
                        st(6, "Shape the banku, plate with the fish and pepper, and serve hot.", 5)));

        s.recipe(v, "Fufu & Light Soup",
                "Pounded cassava and plantain fufu served in an aromatic, spicy tomato light soup with tender goat meat.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.DINNER, 4, 650, 3, 30, 60,
                "1-2 times per week",
                "A comforting starchy staple; the broth is light but fufu is calorie-dense.",
                "Fufu is eaten across Ghana, traditionally pounded with a wooden mortar and pestle in a two-person rhythm. Sunday fufu with light soup remains a cherished family ritual in Ashanti homes.",
                4, 4.6, 87, ApprovalStatus.APPROVED,
                List.of(ing("Cassava", "1", "kg"), ing("Unripe plantain", "3", "pcs"),
                        ing("Goat meat", "600", "g"), ing("Fresh tomatoes", "4", "pcs"),
                        ing("Onions", "2", "pcs"), ing("Scotch bonnet pepper", "2", "pcs"),
                        ing("Ginger and garlic", "2", "tbsp"), ing("Garden eggs", "3", "pcs")),
                List.of(st(1, "Season the goat meat and steam with onion, ginger and garlic.", 15),
                        st(2, "Add water, tomatoes, garden eggs and pepper; boil until soft.", 15),
                        st(3, "Blend the softened vegetables and return to the pot to simmer.", 20),
                        st(4, "Boil cassava and plantain until tender.", 20),
                        st(5, "Pound or process the cassava and plantain into a smooth, elastic fufu.", 15),
                        st(6, "Serve the fufu in a bowl of hot light soup with the meat.", 5)));

        s.recipe(v, "Kelewele",
                "Spicy fried plantain cubes marinated in ginger, cayenne and aromatic spices - Ghana's favourite night-market snack.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.SNACK, 5, 380, 4, 15, 15,
                "1-2 times per week",
                "Fried and naturally sweet; a delicious treat best enjoyed in moderation.",
                "Kelewele is sold from lantern-lit stands after dark in Accra, its spicy aroma drawing queues. Vendors pass secret spice blends from mother to daughter for generations.",
                5, 4.7, 76, ApprovalStatus.APPROVED,
                List.of(ing("Ripe plantain", "4", "pcs"), ing("Fresh ginger", "2", "thumbs"),
                        ing("Cayenne pepper", "1", "tsp"), ing("Anise seed", "1/2", "tsp"),
                        ing("Cloves", "4", "pcs"), ing("Onions", "1", "pc"),
                        ing("Salt", "1", "tsp"), ing("Vegetable oil", "500", "ml")),
                List.of(st(1, "Peel the plantain and cut into bite-sized cubes.", 5),
                        st(2, "Blend ginger, onion, cayenne, anise, cloves and salt with a splash of water.", 5),
                        st(3, "Toss the plantain in the spice marinade and rest for 10 minutes.", 10),
                        st(4, "Heat oil until hot and fry the cubes in batches until deep golden.", 12),
                        st(5, "Drain on paper and serve hot with roasted groundnuts.", 3)));

        s.recipe(v, "Red Red",
                "Black-eyed beans stewed in palm oil with tomatoes and spices, served with sweet fried plantain.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.LUNCH, 6, 560, 4, 15, 45,
                "2-3 times per week",
                "Bean-based and fibre-rich, though palm oil makes it energy-dense.",
                "Red red gets its playful name from the double red of palm oil stew and fried ripe plantain. It is Ghana's great meat-free comfort food, loved from chop bars to family tables.",
                6, 4.5, 69, ApprovalStatus.APPROVED,
                List.of(ing("Black-eyed beans", "2", "cups"), ing("Palm oil", "100", "ml"),
                        ing("Ripe plantain", "3", "pcs"), ing("Fresh tomatoes", "4", "pcs"),
                        ing("Onions", "2", "pcs"), ing("Scotch bonnet pepper", "1", "pc"),
                        ing("Dried shrimp powder", "1", "tbsp"), ing("Salt", "1", "tsp")),
                List.of(st(1, "Boil the beans until soft, then drain.", 35),
                        st(2, "Heat palm oil and fry onions until fragrant.", 5),
                        st(3, "Add grated tomatoes, pepper and shrimp powder; cook down into a stew.", 12),
                        st(4, "Fold in the beans and simmer so the flavours marry.", 10),
                        st(5, "Fry the ripe plantain slices until caramelised.", 8),
                        st(6, "Serve the bean stew with plantain and a sprinkle of gari.", 3)));

        s.recipe(v, "Kenkey & Pepper Sauce",
                "Fermented corn dough dumplings steamed in husks, eaten with ground fresh pepper, onions and fried fish.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.LUNCH, 7, 600, 2, 20, 90,
                "1-2 times per week",
                "Fermented corn is filling and probiotic-friendly; balance with vegetables.",
                "Ga kenkey is wrapped in corn husks and boiled for hours, a technique perfected by the Ga people of Accra. Eating kenkey with your hands, fresh pepper and fried fish is a rite of passage.",
                7, 4.4, 58, ApprovalStatus.APPROVED,
                List.of(ing("Fermented corn dough", "1", "kg"), ing("Corn husks", "10", "pcs"),
                        ing("Fresh tomatoes", "2", "pcs"), ing("Scotch bonnet pepper", "4", "pcs"),
                        ing("Onions", "2", "pcs"), ing("Fried fish", "2", "pcs"),
                        ing("Salt", "1", "tsp")),
                List.of(st(1, "Divide the corn dough in two; cook half into a stiff aflata.", 15),
                        st(2, "Knead the aflata back into the raw dough with salt.", 10),
                        st(3, "Shape into balls and wrap tightly in soaked corn husks.", 15),
                        st(4, "Boil the wrapped kenkey in a covered pot until firm.", 75),
                        st(5, "Grind pepper, onions and tomatoes into a coarse fresh sauce.", 8),
                        st(6, "Serve the kenkey with pepper sauce and fried fish.", 5)));

        s.recipe(v, "Tuo Zaafi",
                "Soft northern Ghanaian corn meal served with silky ayoyo greens soup and tender beef.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.DINNER, 8, 540, 3, 15, 45,
                "2-3 times per week",
                "A light staple with leafy greens; among the more balanced traditional plates.",
                "Tuo zaafi, 'hot stone' in Hausa, is the beloved staple of Tamale and Ghana's north. The slippery ayoyo soup that accompanies it is prized as both food and gentle medicine.",
                8, 4.5, 47, ApprovalStatus.APPROVED,
                List.of(ing("Corn flour", "2", "cups"), ing("Cassava flour", "1/2", "cup"),
                        ing("Ayoyo (jute) leaves", "2", "bunches"), ing("Beef", "500", "g"),
                        ing("Dawadawa (fermented locust bean)", "1", "tbsp"), ing("Onions", "1", "pc"),
                        ing("Dried pepper", "1", "tsp"), ing("Potash", "1/4", "tsp")),
                List.of(st(1, "Boil the beef with onion, dawadawa and spices until tender.", 25),
                        st(2, "Cook the ayoyo leaves with a little potash until silky, then whisk.", 10),
                        st(3, "Make a thin corn-flour porridge, then gradually stir in more flour.", 10),
                        st(4, "Beat the thickening dough until smooth, soft and stretchy.", 10),
                        st(5, "Scoop the tuo into bowls with wet calabash halves.", 5),
                        st(6, "Serve with the ayoyo soup and the beef stew.", 5)));

        s.recipe(v, "Groundnut Soup",
                "Creamy peanut soup simmered with chicken, ginger and chilli, classically eaten with rice balls or fufu.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.DINNER, 9, 680, 4, 20, 50,
                "1-2 times per week",
                "Groundnut paste is nutritious but rich; a hearty option for active days.",
                "Nkatenkwan, Ghana's groundnut soup, turns humble peanuts into velvet. In Akan homes a pot of groundnut soup with omo tuo on Sunday afternoon is as close to sacred as lunch gets.",
                1, 4.7, 91, ApprovalStatus.APPROVED,
                List.of(ing("Groundnut paste", "1", "cup"), ing("Chicken", "1", "kg"),
                        ing("Fresh tomatoes", "3", "pcs"), ing("Onions", "2", "pcs"),
                        ing("Ginger", "1", "thumb"), ing("Scotch bonnet pepper", "2", "pcs"),
                        ing("Tomato paste", "1", "tbsp"), ing("Rice (for rice balls)", "2", "cups")),
                List.of(st(1, "Season and steam the chicken with onion and ginger.", 15),
                        st(2, "Whisk groundnut paste with warm water into a smooth cream.", 5),
                        st(3, "Add the groundnut cream, tomatoes and pepper to the chicken.", 5),
                        st(4, "Simmer gently until oil beads on the surface, stirring now and then.", 35),
                        st(5, "Cook rice soft and mould into smooth rice balls.", 15),
                        st(6, "Blend and strain the soup vegetables back in; serve with rice balls.", 8)));

        s.recipe(v, "Chichinga",
                "Ghanaian street kebabs: beef skewers dusted in spicy suya-style groundnut spice and grilled over open flame.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.SNACK, 10, 420, 4, 25, 15,
                "1-2 times per week",
                "Lean grilled protein, but the spice rub is salty; enjoy as an occasional treat.",
                "Chichinga sizzles on roadside grills across Ghana every evening, a cousin of Nigerian suya carried along old Hausa trade routes. The peanut-chilli tankora powder is what makes it unforgettable.",
                2, 4.6, 63, ApprovalStatus.APPROVED,
                List.of(ing("Beef sirloin", "700", "g"), ing("Tankora (groundnut spice) powder", "6", "tbsp"),
                        ing("Ginger powder", "1", "tsp"), ing("Cayenne pepper", "1", "tsp"),
                        ing("Onions", "1", "pc"), ing("Bell peppers", "2", "pcs"),
                        ing("Vegetable oil", "3", "tbsp"), ing("Salt", "1", "tsp")),
                List.of(st(1, "Cut the beef into thin bite-sized pieces.", 10),
                        st(2, "Thread beef, onion and bell pepper onto skewers.", 10),
                        st(3, "Brush with oil and coat generously in tankora spice.", 5),
                        st(4, "Grill over hot coals, turning every few minutes.", 12),
                        st(5, "Dust with more spice and serve with sliced onions.", 3)));

        s.recipe(v, "Gari Foto",
                "Steamed gari tossed in a rich egg, tomato and onion stew - a quick, thrifty Ghanaian classic.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.BREAKFAST, 11, 490, 2, 10, 20,
                "2-3 times per week",
                "Quick carbs with eggs for protein; add vegetables to round it out.",
                "Gari foto is the resourceful cook's triumph, turning toasted cassava grains into a satisfying meal in minutes. It fed students and travellers long before instant food was invented.",
                3, 4.3, 41, ApprovalStatus.APPROVED,
                List.of(ing("Gari", "2", "cups"), ing("Eggs", "4", "pcs"),
                        ing("Fresh tomatoes", "4", "pcs"), ing("Onions", "2", "pcs"),
                        ing("Scotch bonnet pepper", "1", "pc"), ing("Tomato paste", "2", "tbsp"),
                        ing("Vegetable oil", "80", "ml"), ing("Sardines or corned beef", "1", "tin")),
                List.of(st(1, "Sprinkle the gari with water to moisten and fluff it.", 5),
                        st(2, "Fry onions, tomato paste and chopped tomatoes into a stew.", 10),
                        st(3, "Add pepper and sardines and cook through.", 5),
                        st(4, "Crack in the eggs and scramble into the stew.", 4),
                        st(5, "Fold in the moistened gari until evenly coated and hot.", 4),
                        st(6, "Serve warm with avocado or cucumber slices.", 2)));

        s.recipe(v, "Jollof Spaghetti",
                "Spaghetti simmered straight in a smoky jollof-style tomato pepper sauce until every strand is coated.",
                RecipeCategory.LOCAL, "Ghanaian", "GH", MealType.LUNCH, 12, 610, 3, 15, 30,
                "2-3 times per week",
                "A fun pasta twist on jollof; refined carbs, so alternate with whole grains.",
                "When jollof met spaghetti in West African kitchens, a weeknight favourite was born. It carries all the party flavour of jollof with the speed of pasta - a diaspora comfort dish.",
                4, 4.4, 52, ApprovalStatus.APPROVED,
                List.of(ing("Spaghetti", "400", "g"), ing("Fresh tomatoes", "4", "pcs"),
                        ing("Tomato paste", "2", "tbsp"), ing("Onions", "2", "pcs"),
                        ing("Scotch bonnet pepper", "1", "pc"), ing("Chicken stock", "500", "ml"),
                        ing("Vegetable oil", "80", "ml"), ing("Curry powder", "1", "tsp"),
                        ing("Thyme", "1", "tsp")),
                List.of(st(1, "Blend tomatoes, onion and pepper into a smooth base.", 8),
                        st(2, "Fry tomato paste in oil, then add the blend, curry and thyme.", 10),
                        st(3, "Simmer the sauce until it deepens in colour.", 10),
                        st(4, "Add stock, then the broken spaghetti, and cover.", 3),
                        st(5, "Cook on low, tossing until the pasta absorbs the sauce.", 12),
                        st(6, "Serve hot with grilled chicken or fried egg.", 2)));
    }
}
