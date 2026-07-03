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

/** Seeds the ~12 approved Nigerian recipes (images recipe-13..24). */
@Component
public class NigeriaRecipeSeeder {

    private final SeedSupport s;

    public NigeriaRecipeSeeder(SeedSupport s) {
        this.s = s;
    }

    public void seed(Vendor v) {
        Recipe naijaJollof = s.recipe(v, "Nigerian Jollof Rice",
                "Party-style Nigerian jollof with a deep smoky base of tomatoes, tatashe peppers and rich stock - firewood flavour included.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.LUNCH, 13, 640, 4, 20, 50,
                "2-3 times per week",
                "Rice-forward and oil-rich; pair with salad or grilled protein on repeat days.",
                "No Nigerian owambe party is complete without smoky party jollof, ideally cooked over firewood in giant pots. Its friendly rivalry with Ghana jollof is one of Africa's most delicious debates.",
                5, 4.9, 158, ApprovalStatus.APPROVED,
                List.of(ing("Long grain rice", "3", "cups"), ing("Fresh tomatoes", "4", "pcs"),
                        ing("Tatashe (red bell) peppers", "3", "pcs"), ing("Tomato paste", "3", "tbsp"),
                        ing("Onions", "2", "pcs"), ing("Scotch bonnet pepper", "2", "pcs"),
                        ing("Chicken stock", "600", "ml"), ing("Vegetable oil", "120", "ml"),
                        ing("Butter", "2", "tbsp"), ing("Thyme and curry", "2", "tsp")),
                List.of(st(1, "Blend tomatoes, tatashe, scotch bonnet and one onion; boil down to reduce.", 15),
                        st(2, "Fry sliced onion and tomato paste in hot oil until brick red.", 8),
                        st(3, "Add the reduced pepper base, thyme, curry and seasoning; fry well.", 12),
                        st(4, "Stir in washed rice and hot stock; cover with foil and lid.", 5),
                        st(5, "Cook on low until tender, letting the bottom catch slightly for smokiness.", 25),
                        st(6, "Finish with butter, fluff and serve with fried plantain.", 5)));
        naijaJollof.setVideoUrl("/uploads/sample-naija-jollof-video.mp4");
        s.recipes.save(naijaJollof);

        s.recipe(v, "Egusi Soup & Pounded Yam",
                "Ground melon seed soup with spinach, assorted meat and stockfish, served with smooth pounded yam.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.DINNER, 14, 780, 4, 30, 60,
                "1-2 times per week",
                "Egusi is protein-rich but calorie-dense with palm oil; a weekend-worthy feast.",
                "Egusi soup is cooked in every corner of Nigeria, each region with its own style. Paired with pounded yam, it is the dish that calls Nigerians home from anywhere in the world.",
                6, 4.8, 143, ApprovalStatus.APPROVED,
                List.of(ing("Egusi (melon seeds), ground", "2", "cups"), ing("Palm oil", "150", "ml"),
                        ing("Assorted beef and shaki", "700", "g"), ing("Stockfish", "1", "pc"),
                        ing("Spinach or ugu leaves", "2", "bunches"), ing("Onions", "1", "pc"),
                        ing("Ground crayfish", "2", "tbsp"), ing("Scotch bonnet pepper", "2", "pcs"),
                        ing("Yam", "1.5", "kg")),
                List.of(st(1, "Boil the assorted meat and stockfish with seasoning until tender.", 30),
                        st(2, "Mix ground egusi with a little water into a thick paste.", 5),
                        st(3, "Fry the paste in palm oil in lumps until it curdles.", 12),
                        st(4, "Add meat stock, crayfish and pepper; simmer.", 15),
                        st(5, "Stir in the greens and the meats; cook briefly.", 8),
                        st(6, "Boil yam and pound until stretchy and smooth; serve together.", 20)));

        s.recipe(v, "Suya",
                "Thin-sliced beef skewers coated in yaji peanut-chilli spice and flame-grilled the northern Nigerian way.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.SNACK, 15, 450, 4, 30, 15,
                "1-2 times per week",
                "Lean grilled beef, though the spice mix carries salt; a great occasional protein hit.",
                "Suya is the king of Nigerian street food, perfected by Hausa mai suya over glowing coals. Wrapped in newspaper with raw onions, it is the taste of Nigerian nights out.",
                7, 4.8, 121, ApprovalStatus.APPROVED,
                List.of(ing("Beef fillet", "700", "g"), ing("Yaji (suya spice)", "8", "tbsp"),
                        ing("Groundnut oil", "4", "tbsp"), ing("Onions", "2", "pcs"),
                        ing("Fresh tomatoes", "2", "pcs"), ing("Cabbage", "1/4", "head"),
                        ing("Cayenne pepper", "1", "tsp")),
                List.of(st(1, "Slice the beef paper-thin against the grain.", 15),
                        st(2, "Thread onto skewers and brush with groundnut oil.", 8),
                        st(3, "Press the yaji spice into both sides and rest.", 10),
                        st(4, "Grill over high heat, basting with oil, until edges char.", 12),
                        st(5, "Serve sliced with raw onions, tomatoes, cabbage and extra yaji.", 5)));

        s.recipe(v, "Moi Moi",
                "Silky steamed bean pudding of peeled beans, peppers and fish, wrapped in leaves or ramekins.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.BREAKFAST, 16, 410, 6, 40, 45,
                "2-3 times per week",
                "Steamed beans deliver plant protein with little added fat; one of the healthier classics.",
                "Moi moi graces Nigerian parties, Sunday lunches and lunchboxes alike. Cooks prize uma leaves for the aroma they lend, and unmoulding a perfect moi moi is quiet kitchen glory.",
                8, 4.6, 88, ApprovalStatus.APPROVED,
                List.of(ing("Black-eyed beans", "3", "cups"), ing("Tatashe (red bell) peppers", "2", "pcs"),
                        ing("Scotch bonnet pepper", "1", "pc"), ing("Onions", "2", "pcs"),
                        ing("Vegetable oil", "100", "ml"), ing("Boiled eggs", "3", "pcs"),
                        ing("Mackerel (cooked)", "1", "pc"), ing("Ground crayfish", "1", "tbsp"),
                        ing("Stock cubes", "2", "pcs")),
                List.of(st(1, "Soak and rub the beans to remove the skins.", 20),
                        st(2, "Blend beans with peppers, onions and a little water until silky.", 10),
                        st(3, "Whisk in oil, crayfish, seasoning and warm water to a pourable batter.", 8),
                        st(4, "Fill leaves or ramekins; add egg and mackerel pieces.", 10),
                        st(5, "Steam in a covered pot on a rack until set.", 40),
                        st(6, "Rest briefly, unmould and serve with pap or jollof.", 5)));

        s.recipe(v, "Akara",
                "Crispy deep-fried bean fritters whipped light with onions and pepper - Nigeria's beloved breakfast.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.BREAKFAST, 17, 350, 4, 30, 15,
                "2-3 times per week",
                "Beans give protein, but they are fried; balance with pap or fruit.",
                "Saturday morning in many Nigerian neighbourhoods smells of akara frying at the junction. The fritters are also woven into tradition, served at ceremonies of remembrance and joy alike.",
                1, 4.5, 74, ApprovalStatus.APPROVED,
                List.of(ing("Black-eyed beans", "2", "cups"), ing("Onions", "1", "pc"),
                        ing("Scotch bonnet pepper", "2", "pcs"), ing("Salt", "1", "tsp"),
                        ing("Vegetable oil", "750", "ml"), ing("Ground crayfish", "1", "tsp")),
                List.of(st(1, "Soak and peel the beans, then blend thick with minimal water.", 20),
                        st(2, "Whisk the paste vigorously to incorporate air.", 8),
                        st(3, "Fold in chopped onions, pepper, crayfish and salt.", 4),
                        st(4, "Scoop spoonfuls into hot oil and fry until golden brown.", 12),
                        st(5, "Drain and serve hot with pap, custard or bread.", 3)));

        s.recipe(v, "Pepper Soup",
                "Fiery, aromatic broth of catfish simmered with calabash nutmeg, uziza and scent leaves.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.DINNER, 18, 320, 4, 15, 35,
                "2-3 times per week",
                "A light, low-calorie broth - one of the leanest dishes on the menu.",
                "Nigerian pepper soup is equal parts food and ceremony, ladled out at naming ceremonies and cold evenings alike. Its secret is the earthy spice trio of ehuru, uda and uziza.",
                2, 4.6, 79, ApprovalStatus.APPROVED,
                List.of(ing("Catfish", "1", "kg"), ing("Pepper soup spice mix", "2", "tbsp"),
                        ing("Calabash nutmeg (ehuru)", "3", "pcs"), ing("Scotch bonnet pepper", "2", "pcs"),
                        ing("Onions", "1", "pc"), ing("Scent leaves", "1", "bunch"),
                        ing("Stock cubes", "2", "pcs"), ing("Ginger", "1", "thumb")),
                List.of(st(1, "Clean the catfish with hot water and cut into steaks.", 10),
                        st(2, "Boil water with onions, ginger, spice mix and ground ehuru.", 10),
                        st(3, "Add the fish and seasoning; do not stir, just shake the pot.", 5),
                        st(4, "Simmer gently until the fish is just cooked.", 15),
                        st(5, "Finish with torn scent leaves and fresh pepper.", 3),
                        st(6, "Serve steaming hot, alone or with white rice or yam.", 2)));

        s.recipe(v, "Ofada Rice & Ayamase",
                "Local unpolished ofada rice with ayamase - the famous designer stew of green peppers, palm oil and assorted meats.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.LUNCH, 19, 720, 4, 25, 60,
                "1-2 times per week",
                "Bold, oil-rich stew over fibre-rich local rice; a hearty occasional plate.",
                "Ofada rice, grown in Ogun State, is served in leaves with the bleached-palm-oil green stew called ayamase. The dish went from roadside buka special to national celebrity.",
                3, 4.7, 96, ApprovalStatus.APPROVED,
                List.of(ing("Ofada (local) rice", "3", "cups"), ing("Green bell peppers", "6", "pcs"),
                        ing("Green scotch bonnet pepper", "4", "pcs"), ing("Palm oil", "200", "ml"),
                        ing("Assorted meat", "800", "g"), ing("Boiled eggs", "4", "pcs"),
                        ing("Onions", "2", "pcs"), ing("Iru (locust beans)", "2", "tbsp"),
                        ing("Ground crayfish", "1", "tbsp")),
                List.of(st(1, "Boil the assorted meat with seasoning until tender.", 30),
                        st(2, "Blend green peppers and onion coarsely and boil off the water.", 15),
                        st(3, "Bleach the palm oil lightly, then fry sliced onions and iru.", 8),
                        st(4, "Fry the pepper mix in the oil until dark green and rich.", 15),
                        st(5, "Add meats, crayfish and boiled eggs; simmer.", 10),
                        st(6, "Wash and cook the ofada rice; serve wrapped in leaves with the stew.", 25)));

        s.recipe(v, "Chin Chin",
                "Crunchy fried dough cubes flavoured with nutmeg - the snack tin that empties itself at every Nigerian gathering.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.SNACK, 20, 480, 8, 30, 20,
                "1-2 times per week",
                "A fried sweet snack; wonderful in small handfuls, dangerous by the bowl.",
                "Chin chin travels in tins to boarding schools, offices and weddings across Nigeria. Every family debates the correct crunch: rock-hard heritage style or soft-bite modern.",
                4, 4.4, 61, ApprovalStatus.APPROVED,
                List.of(ing("Flour", "4", "cups"), ing("Sugar", "3/4", "cup"),
                        ing("Butter", "100", "g"), ing("Eggs", "2", "pcs"),
                        ing("Milk", "120", "ml"), ing("Nutmeg", "1", "tsp"),
                        ing("Baking powder", "1", "tsp"), ing("Vegetable oil", "1", "litre")),
                List.of(st(1, "Rub butter into flour, sugar, nutmeg and baking powder.", 8),
                        st(2, "Add eggs and milk; knead into a firm dough.", 10),
                        st(3, "Roll out and cut into small cubes.", 15),
                        st(4, "Fry in batches in hot oil, stirring, until golden.", 15),
                        st(5, "Cool completely for maximum crunch and store airtight.", 5)));

        s.recipe(v, "Puff Puff",
                "Pillowy deep-fried yeast dough balls, golden outside and fluffy inside, dusted with sugar.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.SNACK, 21, 420, 6, 15, 20,
                "1-2 times per week",
                "Sweet fried dough - pure joy, best kept to weekends and parties.",
                "Puff puff is the opening act of every Nigerian party small chops platter. Dropping the batter by hand into hot oil in perfect rounds is a skill passed down at family fryers.",
                5, 4.6, 83, ApprovalStatus.APPROVED,
                List.of(ing("Flour", "3", "cups"), ing("Sugar", "1/2", "cup"),
                        ing("Instant yeast", "2", "tsp"), ing("Warm water", "500", "ml"),
                        ing("Salt", "1/2", "tsp"), ing("Nutmeg", "1/2", "tsp"),
                        ing("Vegetable oil", "1", "litre")),
                List.of(st(1, "Whisk flour, sugar, yeast, nutmeg and salt together.", 5),
                        st(2, "Add warm water and mix into a thick, smooth batter.", 5),
                        st(3, "Cover and let rise until doubled and bubbly.", 60),
                        st(4, "Scoop rounds by hand into hot oil.", 5),
                        st(5, "Fry until deep golden, turning as they puff.", 12),
                        st(6, "Drain and roll in sugar while warm.", 3)));

        s.recipe(v, "Edikang Ikong",
                "Luxurious Calabar vegetable soup of ugu and waterleaf loaded with assorted meat, periwinkle and crayfish.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.DINNER, 22, 590, 4, 35, 40,
                "2-3 times per week",
                "Packed with leafy greens and protein; rich yet one of the most nutrient-dense soups.",
                "Edikang ikong is the crown jewel of Efik cooking from Calabar, once reserved for royalty and honoured guests. Its generosity with vegetables and seafood made it a symbol of good living.",
                6, 4.7, 71, ApprovalStatus.APPROVED,
                List.of(ing("Ugu (pumpkin) leaves", "3", "bunches"), ing("Waterleaf", "3", "bunches"),
                        ing("Assorted meat", "800", "g"), ing("Dried fish", "2", "pcs"),
                        ing("Periwinkle", "1", "cup"), ing("Palm oil", "150", "ml"),
                        ing("Ground crayfish", "3", "tbsp"), ing("Scotch bonnet pepper", "2", "pcs"),
                        ing("Onions", "1", "pc")),
                List.of(st(1, "Boil the assorted meat and dried fish until tender.", 30),
                        st(2, "Wash and shred the ugu and waterleaf finely.", 15),
                        st(3, "Add palm oil, crayfish and pepper to the meat pot.", 5),
                        st(4, "Stir in waterleaf first and cook down briefly.", 5),
                        st(5, "Add ugu and periwinkle; cook just until vibrant.", 8),
                        st(6, "Adjust seasoning and serve with pounded yam or fufu.", 3)));

        s.recipe(v, "Boli & Groundnut",
                "Charred roasted plantain served street-style with crunchy roasted groundnuts or spicy pepper dip.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.SNACK, 23, 360, 2, 5, 25,
                "2-3 times per week",
                "Roasted, not fried - plantain and nuts make a wholesome street snack.",
                "Boli is Port Harcourt's gift to Nigerian street food, plantain roasted over open coals until blistered. Paired with groundnuts or fiery sauce, it fuels workdays across the south.",
                7, 4.4, 49, ApprovalStatus.APPROVED,
                List.of(ing("Ripe plantain", "4", "pcs"), ing("Roasted groundnuts", "1", "cup"),
                        ing("Palm oil", "3", "tbsp"), ing("Scotch bonnet pepper", "2", "pcs"),
                        ing("Onions", "1", "pc"), ing("Salt", "1/2", "tsp")),
                List.of(st(1, "Peel the plantains and place over medium coals or a grill pan.", 5),
                        st(2, "Roast, turning often, until charred outside and soft inside.", 20),
                        st(3, "Grind pepper, onion and salt into a quick dip with palm oil.", 5),
                        st(4, "Serve the hot boli with groundnuts and the pepper dip.", 3)));

        s.recipe(v, "Yam Porridge",
                "Asaro - yam cubes simmered to creaminess in a palm oil pepper sauce, finished with smoked fish and greens.",
                RecipeCategory.LOCAL, "Nigerian", "NG", MealType.LUNCH, 24, 550, 4, 15, 40,
                "2-3 times per week",
                "Comforting one-pot with tubers and greens; moderate oil keeps it balanced.",
                "Asaro is Yoruba comfort in a pot, the dish grandmothers make when the family gathers. The magic moment is mashing some yam into the sauce so the porridge turns velvety.",
                8, 4.5, 66, ApprovalStatus.APPROVED,
                List.of(ing("Yam", "1", "kg"), ing("Palm oil", "100", "ml"),
                        ing("Fresh tomatoes", "3", "pcs"), ing("Tatashe (red bell) peppers", "2", "pcs"),
                        ing("Scotch bonnet pepper", "1", "pc"), ing("Onions", "1", "pc"),
                        ing("Smoked fish", "2", "pcs"), ing("Spinach", "1", "bunch"),
                        ing("Ground crayfish", "1", "tbsp")),
                List.of(st(1, "Peel and cube the yam; rinse well.", 10),
                        st(2, "Blend tomatoes, peppers and onion coarsely.", 5),
                        st(3, "Combine yam, pepper blend, palm oil and water in a pot.", 5),
                        st(4, "Simmer until the yam is fork-tender.", 25),
                        st(5, "Mash a few cubes to thicken; add fish and crayfish.", 8),
                        st(6, "Fold in spinach, rest 2 minutes and serve.", 4)));
    }
}
