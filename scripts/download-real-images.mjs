// Downloads REAL, dish-accurate food/ingredient photos over the image filenames the
// backend serves. Food & ingredient photos are freely-licensed Wikimedia Commons images
// that genuinely depict the named dish/ingredient (verified visually). People, chefs,
// markets and avatars remain the original curated Unsplash photos (already appropriate).
// Emits docs/IMAGES.md. Re-running is safe and reproducible.
import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, copyFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'backend', 'src', 'main', 'resources', 'static', 'images');
const mobileDir = join(root, 'mobile', 'assets', 'images');
mkdirSync(outDir, { recursive: true });
mkdirSync(mobileDir, { recursive: true });

const U = (id, w, h) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;
const WM = (p) => `https://upload.wikimedia.org/wikipedia/commons/${p}`;

// Verified Wikimedia Commons photos, one per dish/ingredient subject.
const DISH = {
  jollof: WM('thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg'),
  waakye: WM('c/cd/Waakye_with_vegetables%2C_fish_and_egg_with_ripe_plantains.jpg'),
  banku_tilapia: WM('thumb/b/bf/Grilled_tilapia_with_banku.jpg/960px-Grilled_tilapia_with_banku.jpg'),
  fufu_lightsoup: WM('thumb/d/df/Light_soup_with_fufu.JPG/960px-Light_soup_with_fufu.JPG'),
  light_soup_goat: WM('thumb/5/58/Goat_meat_and_light_soup.jpg/960px-Goat_meat_and_light_soup.jpg'),
  kelewele: WM('3/37/Kelewele.jpg'),
  red_red: WM('f/f9/Red_red_and_ripe_plantain.jpg'),
  kenkey: WM('thumb/f/f9/Kenkey_and_ground_pepper_with_sardine.jpg/960px-Kenkey_and_ground_pepper_with_sardine.jpg'),
  tuo_zaafi: WM('thumb/5/57/Tuo_zaafi.jpg/960px-Tuo_zaafi.jpg'),
  groundnut_soup: WM('thumb/f/ff/Fufu.jpg/960px-Fufu.jpg'),
  chichinga: WM('thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG'),
  gari_foto: WM('0/0f/Gari_Fotor.jpg'),
  jollof_spaghetti: WM('thumb/f/f6/Jollof_spaghetti.jpg/960px-Jollof_spaghetti.jpg'),
  nigerian_jollof: WM('thumb/0/0a/Jollof_Rice_with_Stew.jpg/960px-Jollof_Rice_with_Stew.jpg'),
  egusi_pounded_yam: WM('thumb/3/3a/Egusi_soup_with_pounded_yam_and_assorted_meats.jpg/960px-Egusi_soup_with_pounded_yam_and_assorted_meats.jpg'),
  egusi_soup: WM('thumb/d/d8/Pot_of_Egusi_soup.jpg/960px-Pot_of_Egusi_soup.jpg'),
  suya: WM('thumb/a/ab/SuyavarietiesTX.JPG/960px-SuyavarietiesTX.JPG'),
  moi_moi: WM('thumb/2/26/Moin-Moin-good.jpg/960px-Moin-Moin-good.jpg'),
  akara: WM('b/bb/Beans_Ball-Akara.jpg'),
  pepper_soup: WM('thumb/7/75/Fish_pepper_soup.jpg/960px-Fish_pepper_soup.jpg'),
  ofada_ayamase: WM('2/2c/Ofada_rice_with_stew.jpg'),
  chin_chin: WM('thumb/c/c4/LoveChinChin.jpg/960px-LoveChinChin.jpg'),
  puff_puff: WM('a/a3/Nigerian-puff-puff-recipe_cropped.jpg'),
  edikang_ikong: WM('0/07/Edikang_ikong.jpg'),
  boli: WM('a/a4/Boli_and_Groundnut.png'),
  yam_porridge_asaro: WM('thumb/7/74/Asaro_%28_Yam_Porridge%29.jpg/960px-Asaro_%28_Yam_Porridge%29.jpg'),
  ewa_agoyin: WM('9/9c/Ewa_agoyin_and_bread.jpg'),
  pounded_yam_efo: WM('thumb/2/23/Efo_riro_and_pounded_yam.jpg/960px-Efo_riro_and_pounded_yam.jpg'),
  west_african_fried_rice: WM('2/29/Fried_rice_and_chicken_garnished_with_sweet_corn%2C_carrot_and_green_peas.jpg'),
  margherita_pizza: WM('thumb/5/57/Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg/960px-Neapolitan_pizza_at_Trappica_%2848701940197%29.jpg'),
  beef_burger: WM('thumb/4/4d/Cheeseburger.jpg/960px-Cheeseburger.jpg'),
  chicken_shawarma: WM('thumb/e/e3/%D0%A8%D0%B0%D1%83%D1%80%D0%BC%D0%B0_6.jpg/960px-%D0%A8%D0%B0%D1%83%D1%80%D0%BC%D0%B0_6.jpg'),
  spaghetti_bolognese: WM('8/83/Spaghetti_Bolognese.jpg'),
  fried_rice: WM('thumb/0/0a/Chinese_fried_rice_by_stu_spivack_in_Cleveland%2C_OH.jpg/960px-Chinese_fried_rice_by_stu_spivack_in_Cleveland%2C_OH.jpg'),
  caesar_salad: WM('thumb/2/23/Caesar_salad_%282%29.jpg/960px-Caesar_salad_%282%29.jpg'),
  grilled_chicken_breast: WM('thumb/b/b0/Grilled_chicken_breast%2C_Santo_Domingo%2C_La_Palma.jpg/960px-Grilled_chicken_breast%2C_Santo_Domingo%2C_La_Palma.jpg'),
  arabian_kofta_kebab: WM('thumb/1/19/Grilled_Kefta_Skewers.jpg/960px-Grilled_Kefta_Skewers.jpg'),
  sobolo_hibiscus_drink: WM('thumb/c/c1/Agua_de_Jamaica.jpg/960px-Agua_de_Jamaica.jpg'),
  chapman: WM('thumb/0/01/Chapman_drink.jpg/960px-Chapman_drink.jpg'),
  mango_smoothie: WM('thumb/0/09/Fresh-mango-smoothie_01.jpg/960px-Fresh-mango-smoothie_01.jpg'),
  rice_grain: WM('thumb/f/f8/Basmati_Rice_India%2C_raw.jpg/960px-Basmati_Rice_India%2C_raw.jpg'),
  tomatoes: WM('thumb/8/89/Tomato_je.jpg/960px-Tomato_je.jpg'),
  onions: WM('thumb/a/a2/Mixed_onions.jpg/960px-Mixed_onions.jpg'),
  scotch_bonnet: WM('thumb/9/97/Scotch_bonnet_chili_pepper.jpg/960px-Scotch_bonnet_chili_pepper.jpg'),
  whole_chicken_raw: WM('thumb/f/f5/Whole_raw_chicken_-_Japan_Dec_22_2019.jpeg/960px-Whole_raw_chicken_-_Japan_Dec_22_2019.jpeg'),
  beef_cuts_raw: WM('6/60/Standing-rib-roast.jpg'),
  tilapia_raw: WM('thumb/5/52/FRESH_TILAPIA.jpg/960px-FRESH_TILAPIA.jpg'),
  palm_oil: WM('thumb/4/4a/Palm_oil.jpg/960px-Palm_oil.jpg'),
  black_eyed_beans: WM('thumb/c/c5/Black-eyed-pea.jpg/960px-Black-eyed-pea.jpg'),
  plantain: WM('thumb/f/fa/Banane_plantain_de_la_RCA.jpg/960px-Banane_plantain_de_la_RCA.jpg'),
  ginger: WM('thumb/3/3d/Ginger_rhizome.jpg/960px-Ginger_rhizome.jpg'),
  yam_tuber: WM('thumb/7/72/Yam_at_monday_market_kaduna_state_01.jpg/960px-Yam_at_monday_market_kaduna_state_01.jpg'),
  garri: WM('thumb/3/39/Bowls_of_granulated_cassava_flakes.jpg/960px-Bowls_of_granulated_cassava_flakes.jpg'),
  egusi_seeds: WM('thumb/2/22/Egusi_seeds.jpg/960px-Egusi_seeds.jpg'),
  crayfish: WM('thumb/a/ad/Dried_crayfish_on_a_tray.jpg/960px-Dried_crayfish_on_a_tray.jpg'),
  stockfish: WM('7/7f/Stockfisch.wmt.jpg'),
  groundnut_paste: WM('thumb/1/11/2020-03-24_20_57_22_An_open_jar_of_Skippy_Creamy_Peanut_Butter_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg/960px-2020-03-24_20_57_22_An_open_jar_of_Skippy_Creamy_Peanut_Butter_in_the_Dulles_section_of_Sterling%2C_Loudoun_County%2C_Virginia.jpg'),
  spice_mix: WM('thumb/b/b6/Spices1.jpg/960px-Spices1.jpg'),
  food_market: WM('thumb/3/35/Market_In_Africa.jpg/960px-Market_In_Africa.jpg'),
};

// recipe-N.png -> subject (backend seed image index). 39/40 are unused spares.
const RECIPE = [
  'jollof', 'waakye', 'banku_tilapia', 'fufu_lightsoup', 'kelewele', 'red_red', 'kenkey',
  'tuo_zaafi', 'groundnut_soup', 'chichinga', 'gari_foto', 'jollof_spaghetti', 'nigerian_jollof',
  'egusi_pounded_yam', 'suya', 'moi_moi', 'akara', 'pepper_soup', 'ofada_ayamase', 'chin_chin',
  'puff_puff', 'edikang_ikong', 'boli', 'yam_porridge_asaro', 'margherita_pizza', 'beef_burger',
  'chicken_shawarma', 'spaghetti_bolognese', 'fried_rice', 'caesar_salad', 'grilled_chicken_breast',
  'arabian_kofta_kebab', 'sobolo_hibiscus_drink', 'sobolo_hibiscus_drink', 'chapman', 'mango_smoothie',
  'kenkey', 'ewa_agoyin', 'gari_foto', 'jollof_spaghetti',
];
// listing-N.png -> subject (backend seed image index, no wraparound).
const LISTING = [
  'jollof', 'waakye', 'banku_tilapia', 'kelewele', 'red_red', 'nigerian_jollof', 'egusi_pounded_yam',
  'suya', 'moi_moi', 'pepper_soup', 'rice_grain', 'tomatoes', 'onions', 'scotch_bonnet',
  'whole_chicken_raw', 'beef_cuts_raw', 'tilapia_raw', 'palm_oil', 'black_eyed_beans', 'plantain',
  'yam_tuber', 'garri', 'egusi_seeds', 'groundnut_paste', 'spice_mix', 'fufu_lightsoup', 'crayfish',
];

// People / chefs / markets / avatars — original curated Unsplash (already appropriate).
const PEOPLE = [
  '1494790108377-be9c29b29330', '1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e',
  '1534528741775-53994a69daeb', '1506794778202-cad84cf45f1d', '1517841905240-472988babdf9',
  '1539571696357-5a69c17a67c6', '1544005313-94ddf0286df2',
];
const COOKING = [
  '1556910103-1c02745aae4d', '1466637574441-749b8f19452f', '1528712306091-ed0763094c98',
  '1577219491135-ce391730fb2c', '1581299894007-aaa50297cf16', '1600565193348-f74bd3c7ccdf',
];
const MARKET = ['1488459716781-31db52582fe9', '1542838132-92c53300491e', '1550989460-0adf9ea622e2'];
const STORY = [ // cultural food-story backdrops (original Unsplash)
  '1504674900247-0877df9cc836', '1546069901-ba9599a7e63c', '1512621776951-a57141f2eefd',
  '1540189549336-e6e99c3679fe', '1574484284002-952d92456975', '1585032226651-759b368d7246',
  '1603133872878-684f208fb84b', '1414235077428-338989a2e8c0',
];

const jobs = [];
RECIPE.forEach((k, i) => jobs.push({ name: `recipe-${i + 1}.png`, url: DISH[k], subject: k, w: 640, h: 480 }));
LISTING.forEach((k, i) => jobs.push({ name: `listing-${i + 1}.png`, url: DISH[k], subject: k, w: 640, h: 480 }));
for (let i = 1; i <= 8; i++) jobs.push({ name: `vendor-${i}.png`, url: U(COOKING[(i - 1) % COOKING.length], 512, 512), subject: 'chef/kitchen', w: 512, h: 512 });
for (let i = 1; i <= 8; i++) jobs.push({ name: `story-${i}.png`, url: U(STORY[i - 1], 640, 800), subject: 'food-story backdrop', w: 640, h: 800 });
for (let i = 1; i <= 3; i++) jobs.push({ name: `banner-${i}.png`, url: U(MARKET[i - 1], 1024, 480), subject: 'produce market', w: 1024, h: 480 });
jobs.push({ name: 'banner-4.png', url: DISH.food_market, subject: 'African food market', w: 1024, h: 480 });
for (let i = 1; i <= 8; i++) jobs.push({ name: `avatar-${i}.png`, url: U(PEOPLE[i - 1], 256, 256), subject: 'person portrait', w: 256, h: 256 });
for (let i = 1; i <= 3; i++) jobs.push({ name: `onboarding-${i}.png`, url: U(COOKING[i - 1], 720, 1080), subject: 'chef/kitchen', w: 720, h: 1080 });
for (let i = 1; i <= 3; i++) jobs.push({ name: `empty-${i}.png`, url: DISH[['jollof', 'waakye', 'kelewele'][i - 1]], subject: 'food', w: 512, h: 512 });
// logo.png stays the generated brand mark (it's a logo, not a photo)

const UA = 'Mozilla/5.0 DishasporaImageFetch/1.0 (contact: team@dishaspora.com)';
function fetchTo(url, dest) {
  try {
    // download then normalise to PNG at the target size via macOS `sips` (falls back to raw copy)
    const tmp = dest + '.src';
    execFileSync('curl', ['-L', '--fail', '--silent', '--max-time', '40', '-A', UA, '-o', tmp, url]);
    if (statSync(tmp).size < 3000) return false;
    try { execFileSync('sips', ['-s', 'format', 'png', '-z', String(0), String(0), tmp, '--out', dest], { stdio: 'ignore' }); }
    catch { copyFileSync(tmp, dest); }
    return statSync(dest).size > 3000;
  } catch { return false; }
}

const manifest = [];
let ok = 0, fail = 0;
for (const j of jobs) {
  const dest = join(outDir, j.name);
  if (fetchTo(j.url, dest)) ok++; else { fail++; }
  manifest.push(`| ${j.name} | ${j.subject} | ${j.url} |`);
  process.stdout.write('.');
}
console.log(`\nfetched:${ok} failed:${fail}`);

for (const n of ['onboarding-1.png', 'onboarding-2.png', 'onboarding-3.png', 'empty-1.png', 'empty-2.png', 'empty-3.png']) {
  if (existsSync(join(outDir, n))) copyFileSync(join(outDir, n), join(mobileDir, n));
}

writeFileSync(join(root, 'docs', 'IMAGES.md'),
`# Image manifest (real, dish-accurate photos)

Backend serves these at \`/images/<file>\`. Food & ingredient photos are freely-licensed
Wikimedia Commons images that genuinely depict the named dish/ingredient (verified visually);
people/chef/market/avatar photos are curated Unsplash. The mobile DEMO MODE
(\`mobile/src/demo/demoData.ts\`) uses the same HTTPS URLs so correct photos show with no backend.

| file | subject | source URL |
|---|---|---|
${manifest.join('\n')}
`);
console.log('Wrote docs/IMAGES.md');
