// Downloads REAL food/people photos (Unsplash CDN, LoremFlickr keyword fallback)
// over the existing mock image filenames. Emits docs/IMAGES.md manifest.
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

// Curated Unsplash photo ids — dishes, African food, drinks, people, chefs, markets.
const FOOD = [
  '1604329760661-e71dc83f8f26', // jollof-style rice
  '1547592180-85f173990554',    // soup pot
  '1567620905732-2d1ec7ab7445', // pancakes
  '1568901346375-23c9450c58cd', // burger
  '1565299624946-b28f40a0ae38', // pizza
  '1555939594-58d7cb561ad1',    // grilled skewers (suya-like)
  '1504674900247-0877df9cc836', // plated meal
  '1546069901-ba9599a7e63c',    // bowl
  '1512621776951-a57141f2eefd', // veggie salad
  '1540189549336-e6e99c3679fe', // salad bowl
  '1574484284002-952d92456975', // curry/stew
  '1585032226651-759b368d7246', // noodles
  '1603133872878-684f208fb84b', // rice bowl
  '1414235077428-338989a2e8c0', // fine dining plate
  '1504754524776-8f4f37790ca0', // breakfast
  '1467003909585-2f8a72700288', // salmon plate
  '1482049016688-2d3e1b311543', // egg toast
  '1455619452474-d2be8b1e70cd', // plated asian
  '1476224203421-9ac39bcb3327', // bowl top-down
  '1529042410759-befb1204b468', // chocolate dessert
  '1490474418585-ba9bad8fd0ea', // fruit bowl
  '1551218808-94e220e084d2',    // gourmet plate
  '1559847844-5315695dadae',    // grilled dish
  '1563379926898-05f4575a45d8', // pasta
  '1544025162-d76694265947',    // ribs/grill
  '1518492104633-130d0cc84637', // smoothie drink
  '1544145945-f90425340c7e',    // juice drink
  '1571091718767-18b5b1457add', // burger fries
];
const PEOPLE = [
  '1494790108377-be9c29b29330', '1507003211169-0a1dd7228f2d', '1500648767791-00dcc994a43e',
  '1534528741775-53994a69daeb', '1506794778202-cad84cf45f1d', '1517841905240-472988babdf9',
  '1539571696357-5a69c17a67c6', '1544005313-94ddf0286df2',
];
const COOKING = [ // chefs / cooking scenes (onboarding, vendors)
  '1556910103-1c02745aae4d', '1466637574441-749b8f19452f', '1528712306091-ed0763094c98',
  '1577219491135-ce391730fb2c', '1581299894007-aaa50297cf16', '1600565193348-f74bd3c7ccdf',
];
const MARKET = [ // markets / spices / banners
  '1488459716781-31db52582fe9', '1542838132-92c53300491e', '1550989460-0adf9ea622e2',
  '1506806732259-39c2d0268443',
];

const FLICKR = { // keyword fallback per slot kind
  recipe: 'african,food,dish', listing: 'food,meal', vendor: 'chef,cooking',
  story: 'african,cuisine', banner: 'food,market', avatar: 'portrait,face',
  onboarding: 'chef,kitchen', empty: 'food,table',
};

const jobs = [];
const add = (name, kind, pool, idx, w, h) =>
  jobs.push({ name, kind, url: U(pool[idx % pool.length], w, h), w, h });
for (let i = 1; i <= 40; i++) add(`recipe-${i}.png`, 'recipe', FOOD, i - 1, 640, 480);
for (let i = 1; i <= 20; i++) add(`listing-${i}.png`, 'listing', FOOD, i + 13, 640, 480);
for (let i = 1; i <= 8; i++) add(`vendor-${i}.png`, 'vendor', COOKING, i - 1, 512, 512);
for (let i = 1; i <= 8; i++) add(`story-${i}.png`, 'story', FOOD, i + 5, 640, 800);
for (let i = 1; i <= 4; i++) add(`banner-${i}.png`, 'banner', MARKET, i - 1, 1024, 480);
for (let i = 1; i <= 8; i++) add(`avatar-${i}.png`, 'avatar', PEOPLE, i - 1, 256, 256);
for (let i = 1; i <= 3; i++) add(`onboarding-${i}.png`, 'onboarding', COOKING, i - 1, 720, 1080);
for (let i = 1; i <= 3; i++) add(`empty-${i}.png`, 'empty', FOOD, i + 17, 512, 512);
// logo.png stays the generated brand mark (it's a logo, not a photo)

function fetchTo(url, dest) {
  try {
    execFileSync('curl', ['-L', '--fail', '--silent', '--max-time', '40', '-o', dest, url]);
    return statSync(dest).size > 8000;
  } catch { return false; }
}

const manifest = [];
let ok = 0, fb = 0, fail = 0;
for (const j of jobs) {
  const dest = join(outDir, j.name);
  let used = j.url;
  if (!fetchTo(j.url, dest)) {
    used = `https://loremflickr.com/${j.w}/${j.h}/${FLICKR[j.kind]}?lock=${manifest.length + 7}`;
    if (fetchTo(used, dest)) fb++; else { fail++; used = '(kept generated placeholder)'; }
  } else ok++;
  manifest.push(`| ${j.name} | ${used} |`);
  process.stdout.write('.');
}
console.log(`\nunsplash:${ok} fallback:${fb} failed:${fail}`);

for (const n of ['onboarding-1.png', 'onboarding-2.png', 'onboarding-3.png', 'empty-1.png', 'empty-2.png', 'empty-3.png']) {
  if (existsSync(join(outDir, n))) copyFileSync(join(outDir, n), join(mobileDir, n));
}

writeFileSync(join(root, 'docs', 'IMAGES.md'),
`# Image manifest (real photos)

Backend serves these at \`/images/<file>\`. Source URLs below are stable CDN links — the mobile DEMO MODE should use these HTTPS URLs directly so real photos show with no backend running.

| file | source URL |
|---|---|
${manifest.join('\n')}
`);
console.log('Wrote docs/IMAGES.md');
