# Image manifest (real, dish-accurate photos)

Backend serves these at `/images/<file>`. All food/ingredient photos are freely-licensed
Wikimedia Commons images that genuinely depict the named dish or ingredient. The mobile
DEMO MODE (`mobile/src/demo/demoData.ts`) uses these same HTTPS URLs directly so real,
correct photos show with no backend running.

Recipe images (`/images/recipe-N.png`) — N maps to the seeded recipe by image index:

| file | dish | source URL |
|---|---|---|
| recipe-1.png | jollof | https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg |
| recipe-2.png | waakye | https://upload.wikimedia.org/wikipedia/commons/c/cd/Waakye_with_vegetables%2C_fish_and_egg_with_ripe_plantains.jpg |
| recipe-3.png | banku tilapia | https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Grilled_tilapia_with_banku.jpg/960px-Grilled_tilapia_with_banku.jpg |
| recipe-4.png | fufu lightsoup | https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Light_soup_with_fufu.JPG/960px-Light_soup_with_fufu.JPG |
| recipe-5.png | kelewele | https://upload.wikimedia.org/wikipedia/commons/3/37/Kelewele.jpg |
| recipe-6.png | red red | https://upload.wikimedia.org/wikipedia/commons/f/f9/Red_red_and_ripe_plantain.jpg |
| recipe-7.png | kenkey | https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Kenkey_and_ground_pepper_with_sardine.jpg/960px-Kenkey_and_ground_pepper_with_sardine.jpg |
| recipe-8.png | tuo zaafi | https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Tuo_zaafi.jpg/960px-Tuo_zaafi.jpg |
| recipe-9.png | groundnut soup | https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Fufu.jpg/960px-Fufu.jpg |
| recipe-10.png | chichinga | https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG |
| recipe-11.png | gari foto | https://upload.wikimedia.org/wikipedia/commons/0/0f/Gari_Fotor.jpg |
| recipe-12.png | jollof spaghetti | https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Jollof_spaghetti.jpg/960px-Jollof_spaghetti.jpg |
| recipe-13.png | nigerian jollof | https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg |
| recipe-14.png | egusi pounded yam | https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Egusi_soup_with_pounded_yam_and_assorted_meats.jpg/960px-Egusi_soup_with_pounded_yam_and_assorted_meats.jpg |
| recipe-15.png | suya | https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG |
| recipe-16.png | moi moi | https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Moin-Moin-good.jpg/960px-Moin-Moin-good.jpg |
| recipe-17.png | akara | https://upload.wikimedia.org/wikipedia/commons/b/bb/Beans_Ball-Akara.jpg |
| recipe-18.png | pepper soup | https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Fish_pepper_soup.jpg/960px-Fish_pepper_soup.jpg |
| recipe-19.png | ofada ayamase | https://upload.wikimedia.org/wikipedia/commons/2/2c/Ofada_rice_with_stew.jpg |
| recipe-20.png | chin chin | https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/LoveChinChin.jpg/960px-LoveChinChin.jpg |
| recipe-21.png | puff puff | https://upload.wikimedia.org/wikipedia/commons/a/a3/Nigerian-puff-puff-recipe_cropped.jpg |
| recipe-22.png | edikang ikong | https://upload.wikimedia.org/wikipedia/commons/0/07/Edikang_ikong.jpg |
| recipe-23.png | boli | https://upload.wikimedia.org/wikipedia/commons/a/a4/Boli_and_Groundnut.png |
| recipe-24.png | yam porridge asaro | https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Asaro_%28_Yam_Porridge%29.jpg/960px-Asaro_%28_Yam_Porridge%29.jpg |
| recipe-25.png | margherita pizza | https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg/960px-Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg |
| recipe-26.png | beef burger | https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cheeseburger.jpg/960px-Cheeseburger.jpg |
| recipe-27.png | chicken shawarma | https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/%D0%A8%D0%B0%D1%83%D1%80%D0%BC%D0%B0_6.jpg/960px-%D0%A8%D0%B0%D1%83%D1%80%D0%BC%D0%B0_6.jpg |
| recipe-28.png | spaghetti bolognese | https://upload.wikimedia.org/wikipedia/commons/8/83/Spaghetti_Bolognese.jpg |
| recipe-29.png | fried rice | https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Chinese_fried_rice_by_stu_spivack_in_Cleveland%2C_OH.jpg/960px-Chinese_fried_rice_by_stu_spivack_in_Cleveland%2C_OH.jpg |
| recipe-30.png | caesar salad | https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Caesar_salad_%282%29.jpg/960px-Caesar_salad_%282%29.jpg |
| recipe-31.png | grilled chicken breast | https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Grilled_chicken_breast%2C_Santo_Domingo%2C_La_Palma.jpg/960px-Grilled_chicken_breast%2C_Santo_Domingo%2C_La_Palma.jpg |
| recipe-32.png | arabian kofta kebab | https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Grilled_Kefta_Skewers.jpg/960px-Grilled_Kefta_Skewers.jpg |
| recipe-33.png | sobolo hibiscus drink | https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Agua_de_Jamaica.jpg/960px-Agua_de_Jamaica.jpg |
| recipe-34.png | sobolo hibiscus drink | https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Agua_de_Jamaica.jpg/960px-Agua_de_Jamaica.jpg |
| recipe-35.png | chapman | https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Chapman_drink.jpg/960px-Chapman_drink.jpg |
| recipe-36.png | mango smoothie | https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Fresh-mango-smoothie_01.jpg/960px-Fresh-mango-smoothie_01.jpg |
| recipe-37.png | kenkey | https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Kenkey_and_ground_pepper_with_sardine.jpg/960px-Kenkey_and_ground_pepper_with_sardine.jpg |
| recipe-38.png | ewa agoyin | https://upload.wikimedia.org/wikipedia/commons/9/9c/Ewa_agoyin_and_bread.jpg |

Marketplace listing images (`/images/listing-N.png`):

| file | subject | source URL |
|---|---|---|
| listing-1.png | jollof | https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg |
| listing-2.png | waakye | https://upload.wikimedia.org/wikipedia/commons/c/cd/Waakye_with_vegetables%2C_fish_and_egg_with_ripe_plantains.jpg |
| listing-3.png | banku tilapia | https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Grilled_tilapia_with_banku.jpg/960px-Grilled_tilapia_with_banku.jpg |
| listing-4.png | kelewele | https://upload.wikimedia.org/wikipedia/commons/3/37/Kelewele.jpg |
| listing-5.png | red red | https://upload.wikimedia.org/wikipedia/commons/f/f9/Red_red_and_ripe_plantain.jpg |
| listing-6.png | nigerian jollof | https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg |
| listing-7.png | egusi pounded yam | https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Egusi_soup_with_pounded_yam_and_assorted_meats.jpg/960px-Egusi_soup_with_pounded_yam_and_assorted_meats.jpg |
| listing-8.png | suya | https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG |
| listing-9.png | moi moi | https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Moin-Moin-good.jpg/960px-Moin-Moin-good.jpg |
| listing-10.png | pepper soup | https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Fish_pepper_soup.jpg/960px-Fish_pepper_soup.jpg |
| listing-11.png | rice grain | https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Basmati_Rice_India%2C_raw.jpg/960px-Basmati_Rice_India%2C_raw.jpg |
| listing-12.png | tomatoes | https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Tomato_je.jpg/960px-Tomato_je.jpg |
| listing-13.png | onions | https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mixed_onions.jpg/960px-Mixed_onions.jpg |
| listing-14.png | scotch bonnet | https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Scotch_bonnet_chili_pepper.jpg/960px-Scotch_bonnet_chili_pepper.jpg |
| listing-15.png | whole chicken raw | https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Whole_raw_chicken_-_Japan_Dec_22_2019.jpeg/960px-Whole_raw_chicken_-_Japan_Dec_22_2019.jpeg |
| listing-16.png | beef cuts raw | https://upload.wikimedia.org/wikipedia/commons/6/60/Standing-rib-roast.jpg |
| listing-17.png | tilapia raw | https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/FRESH_TILAPIA.jpg/960px-FRESH_TILAPIA.jpg |
| listing-18.png | palm oil | https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Palm_oil.jpg/960px-Palm_oil.jpg |
| listing-19.png | black eyed beans | https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Black-eyed-pea.jpg/960px-Black-eyed-pea.jpg |
| listing-20.png | plantain | https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Banane_plantain_de_la_RCA.jpg/960px-Banane_plantain_de_la_RCA.jpg |
| listing-21.png | yam tuber | https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/Yam_at_monday_market_kaduna_state_01.jpg/960px-Yam_at_monday_market_kaduna_state_01.jpg |
| listing-22.png | garri | https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Bowls_of_granulated_cassava_flakes.jpg/960px-Bowls_of_granulated_cassava_flakes.jpg |
| listing-23.png | egusi seeds | https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Egusi_seeds.jpg/960px-Egusi_seeds.jpg |
| listing-24.png | groundnut paste | https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/2020-03-24_20_57_22_An_open_jar_of_Skippy_Creamy_Peanut_Butter_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg/960px-2020-03-24_20_57_22_An_open_jar_of_Skippy_Creamy_Peanut_Butter_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg |
| listing-25.png | spice mix | https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Spices1.jpg/960px-Spices1.jpg |
| listing-26.png | fufu lightsoup | https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Light_soup_with_fufu.JPG/960px-Light_soup_with_fufu.JPG |
| listing-27.png | crayfish | https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Dried_crayfish_on_a_tray.jpg/960px-Dried_crayfish_on_a_tray.jpg |

Other images:

| file | subject | source URL |
|---|---|---|
| banner-4.png | African food market | https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Market_In_Africa.jpg/960px-Market_In_Africa.jpg |

Unchanged from the original set: vendor-1..8 (chef/kitchen portraits), story-1..8
(cultural food-story backdrops), banner-1..3 (produce-market scenes), avatar-1..8,
onboarding-1..3, empty-1..3 — these were already appropriate. recipe-39/40 are unused spares.
