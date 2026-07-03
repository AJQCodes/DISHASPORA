// Rich local demo data mirroring docs/API.md DTOs, with real photo URLs from
// docs/IMAGES.md so DEMO MODE shows real photography with zero backend.
import type {
  ChatMessage,
  ChatThread,
  Ingredient,
  Listing,
  Order,
  PassportStamp,
  Plan,
  Recipe,
  RecipeStep,
  Review,
  Story,
  User,
  Vendor,
} from '../types';

const U = (id: string, w = 640, h = 480) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&q=80&auto=format`;

export const PHOTOS = {
  recipe: [
    U('photo-1604329760661-e71dc83f8f26'), // 1 jollof
    U('photo-1547592180-85f173990554'), // 2 stew/soup
    U('photo-1567620905732-2d1ec7ab7445'), // 3 pancake/waakye-ish
    U('photo-1568901346375-23c9450c58cd'), // 4 burger
    U('photo-1565299624946-b28f40a0ae38'), // 5
    U('photo-1555939594-58d7cb561ad1'), // 6 grilled
    U('photo-1504674900247-0877df9cc836'), // 7 plated
    U('photo-1546069901-ba9599a7e63c'), // 8 bowl
    U('photo-1512621776951-a57141f2eefd'), // 9 salad
    U('photo-1540189549336-e6e99c3679fe'), // 10
    U('photo-1574484284002-952d92456975'), // 11 spices
    U('photo-1585032226651-759b368d7246'), // 12 noodles
    U('photo-1603133872878-684f208fb84b'), // 13 rice dish
    U('photo-1414235077428-338989a2e8c0'), // 14 fine dining
    U('photo-1504754524776-8f4f37790ca0'), // 15
    U('photo-1467003909585-2f8a72700288'), // 16 salmon
  ],
  listing: [
    U('photo-1504754524776-8f4f37790ca0'),
    U('photo-1467003909585-2f8a72700288'),
    U('photo-1482049016688-2d3e1b311543'),
    U('photo-1455619452474-d2be8b1e70cd'),
    U('photo-1476224203421-9ac39bcb3327'),
    U('photo-1529042410759-befb1204b468'),
    U('photo-1490474418585-ba9bad8fd0ea'),
    U('photo-1551218808-94e220e084d2'),
    U('photo-1559847844-5315695dadae'),
    U('photo-1563379926898-05f4575a45d8'),
    U('photo-1544025162-d76694265947'),
    U('photo-1518492104633-130d0cc84637'),
    U('photo-1544145945-f90425340c7e'),
    U('photo-1571091718767-18b5b1457add'),
    U('photo-1604329760661-e71dc83f8f26'),
    U('photo-1547592180-85f173990554'),
    U('photo-1567620905732-2d1ec7ab7445'),
    U('photo-1568901346375-23c9450c58cd'),
    U('photo-1565299624946-b28f40a0ae38'),
    U('photo-1555939594-58d7cb561ad1'),
  ],
  vendor: [
    U('photo-1556910103-1c02745aae4d', 512, 512),
    U('photo-1466637574441-749b8f19452f', 512, 512),
    U('photo-1528712306091-ed0763094c98', 512, 512),
    U('photo-1577219491135-ce391730fb2c', 512, 512),
    U('photo-1581299894007-aaa50297cf16', 512, 512),
    U('photo-1600565193348-f74bd3c7ccdf', 512, 512),
  ],
  story: [
    U('photo-1504674900247-0877df9cc836', 640, 800),
    U('photo-1546069901-ba9599a7e63c', 640, 800),
    U('photo-1512621776951-a57141f2eefd', 640, 800),
    U('photo-1540189549336-e6e99c3679fe', 640, 800),
    U('photo-1574484284002-952d92456975', 640, 800),
    U('photo-1585032226651-759b368d7246', 640, 800),
    U('photo-1603133872878-684f208fb84b', 640, 800),
    U('photo-1414235077428-338989a2e8c0', 640, 800),
  ],
  banner: [
    U('photo-1488459716781-31db52582fe9', 1024, 480),
    U('photo-1542838132-92c53300491e', 1024, 480),
    U('photo-1550989460-0adf9ea622e2', 1024, 480),
    U('photo-1506806732259-39c2d0268443', 1024, 480),
  ],
  avatar: [
    U('photo-1494790108377-be9c29b29330', 256, 256),
    U('photo-1507003211169-0a1dd7228f2d', 256, 256),
    U('photo-1500648767791-00dcc994a43e', 256, 256),
    U('photo-1534528741775-53994a69daeb', 256, 256),
    U('photo-1506794778202-cad84cf45f1d', 256, 256),
    U('photo-1517841905240-472988babdf9', 256, 256),
    U('photo-1539571696357-5a69c17a67c6', 256, 256),
    U('photo-1544005313-94ddf0286df2', 256, 256),
  ],
};

export const demoUser: User = {
  id: 1,
  name: 'Ama Mensah',
  email: 'ama@demo.com',
  role: 'USER',
  country: 'GH',
  avatarUrl: PHOTOS.avatar[0],
  premium: true,
  premiumUntil: '2026-12-31T00:00:00Z',
  vendorId: null,
};

export const demoVendors: Vendor[] = [
  {
    id: 1,
    name: "Auntie Ama's Kitchen",
    bio: 'Home-style Ghanaian cooking, from our clay pots to your table. Every dish carries a story from Osu.',
    country: 'GH',
    logoUrl: PHOTOS.vendor[0],
    coverUrl: PHOTOS.banner[0],
    type: 'BOTH',
    status: 'APPROVED',
    rejectionFeedback: null,
    rating: 4.4,
    reviewCount: 455,
    specialty: 'Ghanaian classics',
    location: 'Osu, Accra',
    phone: '+233 24 000 1111',
  },
  {
    id: 2,
    name: 'Mama Ngozi Foods',
    bio: 'Authentic Naija flavours — egusi, suya spice, and the softest pounded yam in Lagos.',
    country: 'NG',
    logoUrl: PHOTOS.vendor[1],
    coverUrl: PHOTOS.banner[1],
    type: 'BOTH',
    status: 'APPROVED',
    rejectionFeedback: null,
    rating: 4.7,
    reviewCount: 812,
    specialty: 'Nigerian home cooking',
    location: 'Surulere, Lagos',
    phone: '+234 80 222 3333',
  },
  {
    id: 3,
    name: 'Makola Fresh Market',
    bio: 'Fresh produce and pantry staples straight from Makola Market, delivered same day.',
    country: 'GH',
    logoUrl: PHOTOS.vendor[2],
    coverUrl: PHOTOS.banner[2],
    type: 'INGREDIENT',
    status: 'APPROVED',
    rejectionFeedback: null,
    rating: 4.2,
    reviewCount: 233,
    specialty: 'Market-fresh ingredients',
    location: 'Makola, Accra',
    phone: '+233 20 444 5555',
  },
  {
    id: 4,
    name: 'Lagos Spice Hub',
    bio: 'Every spice a Nigerian kitchen needs — ground fresh weekly.',
    country: 'NG',
    logoUrl: PHOTOS.vendor[3],
    coverUrl: PHOTOS.banner[3],
    type: 'INGREDIENT',
    status: 'APPROVED',
    rejectionFeedback: null,
    rating: 4.5,
    reviewCount: 167,
    specialty: 'Spices & dry goods',
    location: 'Yaba, Lagos',
    phone: '+234 81 666 7777',
  },
  {
    id: 5,
    name: 'Chale Chop Bar',
    bio: 'Street-food energy, restaurant quality. Waakye every morning until it sells out.',
    country: 'GH',
    logoUrl: PHOTOS.vendor[4],
    coverUrl: PHOTOS.banner[0],
    type: 'FOOD',
    status: 'APPROVED',
    rejectionFeedback: null,
    rating: 4.8,
    reviewCount: 1024,
    specialty: 'Waakye & street food',
    location: 'Labadi, Accra',
    phone: '+233 26 888 9999',
  },
  {
    id: 6,
    name: 'Naija Bites',
    bio: 'Small chops, big joy. Party trays and single meals across Lagos mainland.',
    country: 'NG',
    logoUrl: PHOTOS.vendor[5],
    coverUrl: PHOTOS.banner[1],
    type: 'FOOD',
    status: 'APPROVED',
    rejectionFeedback: null,
    rating: 4.3,
    reviewCount: 389,
    specialty: 'Small chops & grills',
    location: 'Ikeja, Lagos',
    phone: '+234 90 123 4567',
  },
];

const ing = (name: string, quantity: string, unit: string): Ingredient => ({ name, quantity, unit });

const steps = (
  list: [string, number | null][],
  imageUrl: string | null = null
): RecipeStep[] =>
  list.map(([instruction, durationMinutes], i) => ({
    stepNumber: i + 1,
    instruction,
    durationMinutes,
    imageUrl: i === 0 ? imageUrl : null,
  }));

type RecipeSeed = Omit<
  Recipe,
  'videoUrl' | 'audioUrl' | 'hasVideo' | 'hasAudio' | 'status' | 'savedByMe' | 'cookedByMe'
> &
  Partial<Pick<Recipe, 'hasVideo' | 'hasAudio' | 'savedByMe' | 'cookedByMe'>>;

const DEMO_VIDEO =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
const DEMO_AUDIO =
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

const r = (seed: RecipeSeed): Recipe => ({
  videoUrl: DEMO_VIDEO,
  audioUrl: DEMO_AUDIO,
  hasVideo: true,
  hasAudio: true,
  status: 'APPROVED',
  savedByMe: false,
  cookedByMe: false,
  ...seed,
});

export const demoRecipes: Recipe[] = [
  r({
    id: 1,
    title: 'Jollof Rice',
    description:
      'The one-pot legend of West Africa — long-grain rice simmered in a smoky, peppery tomato base until every grain glows red-orange.',
    category: 'LOCAL',
    cuisine: 'Ghanaian',
    countryOfOrigin: 'GH',
    mealType: 'LUNCH',
    imageUrl: PHOTOS.recipe[0],
    calories: 620,
    servings: 4,
    prepMinutes: 20,
    cookMinutes: 45,
    mealFrequency: '2-3 times per week',
    mealFrequencyReason:
      'Balanced but rice-heavy; pair with grilled protein and a side of vegetables to round it out.',
    ingredients: [
      ing('Long-grain rice', '3', 'cups'),
      ing('Tomatoes', '6', 'pcs'),
      ing('Onions', '2', 'pcs'),
      ing('Tomato paste', '3', 'tbsp'),
      ing('Scotch bonnet pepper', '2', 'pcs'),
      ing('Chicken stock', '2', 'cups'),
      ing('Vegetable oil', '4', 'tbsp'),
      ing('Curry powder & thyme', '1', 'tbsp'),
    ],
    steps: steps(
      [
        ['Blend tomatoes, one onion and the scotch bonnet into a smooth mix.', 5],
        ['Fry sliced onion in hot oil until golden, then add tomato paste and fry 3 minutes.', 5],
        ['Pour in the blended mix and cook down until it darkens and the oil rises.', 15],
        ['Season with curry, thyme, and stock. Stir in washed rice and coat well.', 5],
        ['Cover with foil and a tight lid; steam on low heat without peeking.', 25],
        ['Fluff gently, let the bottom crisp slightly for that party-jollof smokiness.', 5],
      ],
      PHOTOS.recipe[0]
    ),
    story:
      'No dish sparks more joyful arguments across West Africa than jollof. In Ghana, jollof means basmati aroma at weddings, smoky "party jollof" scooped from giant dadesen pots, and the eternal, loving rivalry with Nigeria over whose pot reigns. Its roots trace to the Wolof people of the Senegambia, whose thieboudienne travelled the coast with traders and evolved in every kitchen it touched.',
    storyImageUrl: PHOTOS.story[0],
    vendorId: 1,
    vendorName: "Auntie Ama's Kitchen",
    rating: 4.8,
    reviewCount: 231,
    savedByMe: true,
  }),
  r({
    id: 2,
    title: 'Waakye',
    description:
      'Ghana’s beloved rice-and-beans breakfast, stained deep burgundy by dried millet leaves and served with shito, gari and spaghetti.',
    category: 'LOCAL',
    cuisine: 'Ghanaian',
    countryOfOrigin: 'GH',
    mealType: 'BREAKFAST',
    imageUrl: PHOTOS.recipe[12],
    calories: 540,
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 60,
    mealFrequency: '2-3 times per week',
    mealFrequencyReason:
      'A hearty combination of complex carbs and legumes — great fuel, best balanced with lighter dinners.',
    ingredients: [
      ing('Rice', '2', 'cups'),
      ing('Black-eyed beans', '1', 'cup'),
      ing('Dried millet leaves (waakye leaves)', '6', 'pcs'),
      ing('Baking soda', '1/4', 'tsp'),
      ing('Salt', '1', 'tsp'),
      ing('Gari & shito to serve', '1', 'cup'),
    ],
    steps: steps(
      [
        ['Soak beans for 30 minutes, then boil with baking soda until almost tender.', 30],
        ['Add washed millet leaves and simmer until the water turns deep red.', 10],
        ['Add rice and salt; top up water just above the mix.', 3],
        ['Cook covered on low until rice is tender and evenly stained.', 20],
        ['Remove leaves, fluff, and serve with shito, gari, boiled egg and spaghetti.', 5],
      ],
      PHOTOS.recipe[12]
    ),
    story:
      'Waakye began as a northern Ghanaian farmer’s meal — rice and beans stretched with what the land gave — and rode south with traders to become Accra’s definitive breakfast. The queue at a good waakye joint at 7am is a civic institution: office workers, schoolkids and taxi drivers all waiting on the same steaming basin wrapped in leaves.',
    storyImageUrl: PHOTOS.story[1],
    vendorId: 5,
    vendorName: 'Chale Chop Bar',
    rating: 4.9,
    reviewCount: 402,
    savedByMe: true,
    cookedByMe: true,
  }),
  r({
    id: 3,
    title: 'Light Soup with Goat',
    description:
      'A clear, fiery Ghanaian tomato broth with tender goat meat — the soup for rainy days and recovery days alike.',
    category: 'LOCAL',
    cuisine: 'Ghanaian',
    countryOfOrigin: 'GH',
    mealType: 'DINNER',
    imageUrl: PHOTOS.recipe[1],
    calories: 380,
    servings: 4,
    prepMinutes: 20,
    cookMinutes: 70,
    mealFrequency: 'Up to 4 times per week',
    mealFrequencyReason: 'Light, protein-rich and low in oil — one of the leaner soups in the canon.',
    ingredients: [
      ing('Goat meat', '800', 'g'),
      ing('Tomatoes', '5', 'pcs'),
      ing('Garden eggs', '3', 'pcs'),
      ing('Onions', '2', 'pcs'),
      ing('Ginger & garlic paste', '2', 'tbsp'),
      ing('Scotch bonnet pepper', '2', 'pcs'),
    ],
    steps: steps(
      [
        ['Season goat with salt, onion, ginger and garlic; steam in its own juices.', 15],
        ['Boil tomatoes, garden eggs and pepper until soft, then blend smooth.', 10],
        ['Pour the blend over the meat, add water and simmer.', 35],
        ['Adjust seasoning; simmer until the broth is light and clear with oil beads.', 10],
        ['Serve steaming hot with fufu or rice balls.', 2],
      ],
      PHOTOS.recipe[1]
    ),
    story:
      'Nkrakra — light soup — is Ghana’s chicken-soup-for-the-soul. It is what your grandmother makes when you are unwell, what welcomes a new mother home, and what anchors the Sunday fufu table. Its clarity is the point: no thickeners, just tomatoes, pepper and patience.',
    storyImageUrl: PHOTOS.story[2],
    vendorId: 1,
    vendorName: "Auntie Ama's Kitchen",
    rating: 4.6,
    reviewCount: 148,
  }),
  r({
    id: 4,
    title: 'Banku & Grilled Tilapia',
    description:
      'Fermented corn-and-cassava dough cooked to a smooth swallow, served with charred whole tilapia and fresh pepper sauce.',
    category: 'LOCAL',
    cuisine: 'Ghanaian',
    countryOfOrigin: 'GH',
    mealType: 'DINNER',
    imageUrl: PHOTOS.recipe[15],
    calories: 710,
    servings: 2,
    prepMinutes: 25,
    cookMinutes: 40,
    mealFrequency: '1-2 times per week',
    mealFrequencyReason: 'Rich and filling; the fermented dough is heavy — enjoy as a weekly treat.',
    ingredients: [
      ing('Corn dough', '500', 'g'),
      ing('Cassava dough', '250', 'g'),
      ing('Whole tilapia', '2', 'pcs'),
      ing('Ginger, garlic & chilli rub', '3', 'tbsp'),
      ing('Tomatoes & onion for pepper sauce', '4', 'pcs'),
    ],
    steps: steps(
      [
        ['Mix corn and cassava dough with water into a smooth slurry.', 5],
        ['Cook on medium heat, stirring hard with a banku ta until thick and stretchy.', 20],
        ['Score tilapia, rub with spice paste, and rest.', 10],
        ['Grill fish over charcoal until the skin blisters.', 15],
        ['Grind fresh pepper sauce and serve everything together.', 5],
      ],
      PHOTOS.recipe[15]
    ),
    story:
      'Along the Ga coast, banku and tilapia is Friday night itself. The smell of charcoal-grilled fish drifting over Labadi beach bars, fingers working hot banku, the sting of kpakpo shito — it is Accra distilled onto one plate.',
    storyImageUrl: PHOTOS.story[3],
    vendorId: 5,
    vendorName: 'Chale Chop Bar',
    rating: 4.7,
    reviewCount: 265,
  }),
  r({
    id: 5,
    title: 'Kelewele',
    description:
      'Ripe plantain cubes tossed in ginger, cayenne and cloves, deep-fried until caramel-crisp — Accra’s favourite night snack.',
    category: 'LOCAL',
    cuisine: 'Ghanaian',
    countryOfOrigin: 'GH',
    mealType: 'SNACK',
    imageUrl: PHOTOS.recipe[6],
    calories: 320,
    servings: 3,
    prepMinutes: 15,
    cookMinutes: 15,
    mealFrequency: '2-3 times per week',
    mealFrequencyReason: 'A fried snack — moderate portions keep it a joy rather than a habit.',
    ingredients: [
      ing('Ripe plantains', '4', 'pcs'),
      ing('Fresh ginger', '3', 'tbsp'),
      ing('Cayenne pepper', '1', 'tsp'),
      ing('Ground cloves & nutmeg', '1/2', 'tsp'),
      ing('Vegetable oil for frying', '2', 'cups'),
    ],
    steps: steps(
      [
        ['Cube plantains; blend ginger, pepper and spices with a splash of water.', 8],
        ['Toss plantain in the spice paste and rest 10 minutes.', 10],
        ['Deep-fry in batches until deep golden with dark caramel edges.', 10],
        ['Drain and serve hot with roasted peanuts.', 2],
      ],
      PHOTOS.recipe[6]
    ),
    story:
      'Kelewele belongs to the night. As dusk falls in Accra, kelewele sellers light their lamps and the ginger-clove perfume pulls in everyone walking home. Recipes are guarded fiercely — every seller’s spice blend is her signature.',
    storyImageUrl: PHOTOS.story[4],
    vendorId: 1,
    vendorName: "Auntie Ama's Kitchen",
    rating: 4.5,
    reviewCount: 178,
  }),
  r({
    id: 6,
    title: 'Red Red',
    description:
      'Black-eyed bean stew simmered in red palm oil with gari and fried plantain — hearty, smoky, and entirely plant-based.',
    category: 'LOCAL',
    cuisine: 'Ghanaian',
    countryOfOrigin: 'GH',
    mealType: 'LUNCH',
    imageUrl: PHOTOS.recipe[7],
    calories: 480,
    servings: 4,
    prepMinutes: 10,
    cookMinutes: 50,
    mealFrequency: 'Up to 4 times per week',
    mealFrequencyReason: 'Legume-forward and fibre-rich; watch the palm oil quantity for a lighter pot.',
    ingredients: [
      ing('Black-eyed beans', '2', 'cups'),
      ing('Red palm oil', '4', 'tbsp'),
      ing('Tomatoes', '4', 'pcs'),
      ing('Onions', '2', 'pcs'),
      ing('Ripe plantains', '3', 'pcs'),
      ing('Gari', '1/2', 'cup'),
    ],
    steps: steps(
      [
        ['Boil beans until tender.', 30],
        ['Bleach palm oil lightly, fry onions, then grated tomatoes.', 10],
        ['Fold in the beans and simmer to marry the flavours.', 10],
        ['Fry plantain until golden.', 8],
        ['Serve beans topped with gari and plantain on the side.', 2],
      ],
      PHOTOS.recipe[7]
    ),
    story:
      'Named twice-red for its palm oil and fried plantain, red red is Ghana’s great equalizer — a chop-bar lunch loved by students and ministers alike, and one of West Africa’s oldest vegan dishes long before the word existed.',
    storyImageUrl: PHOTOS.story[5],
    vendorId: 1,
    vendorName: "Auntie Ama's Kitchen",
    rating: 4.4,
    reviewCount: 96,
  }),
  r({
    id: 7,
    title: 'Groundnut Soup',
    description:
      'Silky peanut soup with chicken and aromatic spices, made for rice balls and slow Sundays.',
    category: 'LOCAL',
    cuisine: 'Ghanaian',
    countryOfOrigin: 'GH',
    mealType: 'DINNER',
    imageUrl: PHOTOS.recipe[9],
    calories: 560,
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 55,
    mealFrequency: '1-2 times per week',
    mealFrequencyReason: 'Peanuts are calorie-dense; a weekly bowl is a rich and satisfying rhythm.',
    ingredients: [
      ing('Chicken', '1', 'kg'),
      ing('Natural peanut butter', '1', 'cup'),
      ing('Tomatoes', '4', 'pcs'),
      ing('Onions', '1', 'pcs'),
      ing('Ginger', '2', 'tbsp'),
      ing('Scotch bonnet pepper', '1', 'pcs'),
    ],
    steps: steps(
      [
        ['Season and steam chicken with onion and ginger.', 15],
        ['Whisk peanut butter with warm water until smooth; add to the pot.', 5],
        ['Add blended tomatoes and pepper; simmer until oil beads on the surface.', 30],
        ['Skim, season, and simmer to your preferred thickness.', 10],
        ['Serve with rice balls or omo tuo.', 2],
      ],
      PHOTOS.recipe[9]
    ),
    story:
      'Nkatenkwan is patience in a pot. Across Ghana it crowns the Sunday table with omo tuo, and in the north it connects to a whole savannah tradition of groundnut cookery that stretches to Senegal’s mafé.',
    storyImageUrl: PHOTOS.story[6],
    vendorId: 1,
    vendorName: "Auntie Ama's Kitchen",
    rating: 4.6,
    reviewCount: 134,
  }),
  r({
    id: 8,
    title: 'Egusi Soup',
    description:
      'Nigeria’s crown jewel — ground melon seeds cooked into a rich, golden soup with spinach and assorted meats.',
    category: 'LOCAL',
    cuisine: 'Nigerian',
    countryOfOrigin: 'NG',
    mealType: 'DINNER',
    imageUrl: PHOTOS.recipe[13],
    calories: 650,
    servings: 6,
    prepMinutes: 25,
    cookMinutes: 60,
    mealFrequency: '1-2 times per week',
    mealFrequencyReason: 'Melon seeds and palm oil make this indulgent — magnificent, but rich.',
    ingredients: [
      ing('Egusi (melon seeds)', '2', 'cups'),
      ing('Assorted meat & tripe', '1', 'kg'),
      ing('Stockfish', '200', 'g'),
      ing('Palm oil', '1/2', 'cup'),
      ing('Spinach or bitterleaf', '4', 'cups'),
      ing('Crayfish', '3', 'tbsp'),
      ing('Scotch bonnet pepper', '2', 'pcs'),
    ],
    steps: steps(
      [
        ['Boil assorted meats and stockfish with seasoning until tender.', 30],
        ['Blend egusi with a little water into a thick paste.', 5],
        ['Fry the paste in palm oil until it curdles into golden lumps.', 10],
        ['Add stock, meats and crayfish; simmer.', 15],
        ['Fold in greens, cook 5 more minutes, and serve with pounded yam.', 5],
      ],
      PHOTOS.recipe[13]
    ),
    story:
      'Every Nigerian family swears by its own egusi doctrine — lumps or smooth, bitterleaf or spinach, fried or boiled. What never changes is its place of honour: no wedding, burial or homecoming is complete without a vat of egusi holding court.',
    storyImageUrl: PHOTOS.story[7],
    vendorId: 2,
    vendorName: 'Mama Ngozi Foods',
    rating: 4.8,
    reviewCount: 356,
    savedByMe: true,
  }),
  r({
    id: 9,
    title: 'Suya',
    description:
      'Thin-sliced beef skewers crusted in yaji — the smoky, nutty pepper spice of northern Nigeria — grilled over open flame.',
    category: 'LOCAL',
    cuisine: 'Nigerian',
    countryOfOrigin: 'NG',
    mealType: 'SNACK',
    imageUrl: PHOTOS.recipe[5],
    calories: 410,
    servings: 4,
    prepMinutes: 30,
    cookMinutes: 15,
    mealFrequency: '2-3 times per week',
    mealFrequencyReason: 'Lean grilled protein — the peanut spice adds richness, so balance with vegetables.',
    ingredients: [
      ing('Beef sirloin', '700', 'g'),
      ing('Yaji suya spice', '5', 'tbsp'),
      ing('Groundnut oil', '3', 'tbsp'),
      ing('Onions', '1', 'pcs'),
      ing('Tomatoes & cucumber to serve', '2', 'pcs'),
    ],
    steps: steps(
      [
        ['Slice beef paper-thin and thread onto soaked skewers.', 15],
        ['Oil lightly and press yaji spice into every surface; rest 15 minutes.', 15],
        ['Grill hot and fast, turning until edges char.', 10],
        ['Dust with more yaji; serve with raw onion rings and tomato.', 3],
      ],
      PHOTOS.recipe[5]
    ),
    story:
      'Suya is Nigeria’s nightfall ritual, born with Hausa cattle herders whose yaji spice — groundnut, ginger, kankan — preserved and perfumed meat on long journeys. Today the mallam’s glowing grill is the after-dark heartbeat of every Nigerian city.',
    storyImageUrl: PHOTOS.story[0],
    vendorId: 6,
    vendorName: 'Naija Bites',
    rating: 4.9,
    reviewCount: 512,
  }),
  r({
    id: 10,
    title: 'Moi Moi',
    description:
      'Steamed bean pudding — black-eyed beans blended with peppers and gently steamed into a silky savoury cake.',
    category: 'LOCAL',
    cuisine: 'Nigerian',
    countryOfOrigin: 'NG',
    mealType: 'BREAKFAST',
    imageUrl: PHOTOS.recipe[8],
    calories: 290,
    servings: 6,
    prepMinutes: 40,
    cookMinutes: 45,
    mealFrequency: 'Daily',
    mealFrequencyReason: 'Steamed, high-protein and low-fat — one of the healthiest staples on the platform.',
    ingredients: [
      ing('Black-eyed beans', '2', 'cups'),
      ing('Red bell peppers', '2', 'pcs'),
      ing('Onions', '1', 'pcs'),
      ing('Eggs (optional)', '3', 'pcs'),
      ing('Vegetable oil', '4', 'tbsp'),
      ing('Seasoning cubes', '2', 'pcs'),
    ],
    steps: steps(
      [
        ['Soak and peel the beans (or use peeled bean flour).', 25],
        ['Blend beans with peppers and onion into a smooth batter.', 10],
        ['Whisk in oil and seasoning until airy.', 5],
        ['Pour into ramekins or leaves; steam until set.', 40],
        ['Rest 5 minutes, unmould, and serve with pap or bread.', 5],
      ],
      PHOTOS.recipe[8]
    ),
    story:
      'Moi moi is celebration food dressed as an everyday dish — the careful peeling of beans was once a communal task for aunties trading gossip. Steamed in uma leaves it takes on a faint forest perfume no ramekin can copy.',
    storyImageUrl: PHOTOS.story[1],
    vendorId: 2,
    vendorName: 'Mama Ngozi Foods',
    rating: 4.5,
    reviewCount: 189,
  }),
  r({
    id: 11,
    title: 'Pepper Soup',
    description:
      'A fiercely aromatic Nigerian broth of catfish and calabash nutmeg — medicine, comfort and heat in one bowl.',
    category: 'LOCAL',
    cuisine: 'Nigerian',
    countryOfOrigin: 'NG',
    mealType: 'DINNER',
    imageUrl: PHOTOS.recipe[2],
    calories: 310,
    servings: 4,
    prepMinutes: 15,
    cookMinutes: 35,
    mealFrequency: 'Up to 4 times per week',
    mealFrequencyReason: 'Light broth with lean fish — very lean, just mind the sodium.',
    ingredients: [
      ing('Catfish', '800', 'g'),
      ing('Pepper soup spice (ehuru, uda)', '2', 'tbsp'),
      ing('Scotch bonnet pepper', '2', 'pcs'),
      ing('Onions', '1', 'pcs'),
      ing('Scent leaves', '1', 'cup'),
    ],
    steps: steps(
      [
        ['Clean catfish with hot water and salt to firm the skin.', 8],
        ['Boil onion, spice mix and pepper in water.', 10],
        ['Lower in the fish; do not stir — swirl the pot instead.', 15],
        ['Add scent leaves in the final 2 minutes and serve blazing hot.', 5],
      ],
      PHOTOS.recipe[2]
    ),
    story:
      'Pepper soup is Nigeria’s all-purpose remedy — prescribed for new mothers, cold evenings and long nights out. Each region guards its spice blend, but the calabash nutmeg’s haunting aroma is the thread that ties every pot together.',
    storyImageUrl: PHOTOS.story[2],
    vendorId: 2,
    vendorName: 'Mama Ngozi Foods',
    rating: 4.6,
    reviewCount: 142,
  }),
  r({
    id: 12,
    title: 'Pounded Yam & Efo Riro',
    description:
      'Smooth, stretchy pounded yam paired with a deeply savoury Yoruba spinach stew.',
    category: 'LOCAL',
    cuisine: 'Nigerian',
    countryOfOrigin: 'NG',
    mealType: 'LUNCH',
    imageUrl: PHOTOS.recipe[3],
    calories: 720,
    servings: 4,
    prepMinutes: 20,
    cookMinutes: 50,
    mealFrequency: '1-2 times per week',
    mealFrequencyReason: 'A dense, festive plate; wonderful weekly rather than daily.',
    ingredients: [
      ing('Yam', '1.5', 'kg'),
      ing('Spinach (efo)', '6', 'cups'),
      ing('Palm oil', '1/3', 'cup'),
      ing('Assorted meat', '600', 'g'),
      ing('Locust beans (iru)', '2', 'tbsp'),
      ing('Tatashe peppers', '3', 'pcs'),
    ],
    steps: steps(
      [
        ['Boil yam chunks until fork-tender.', 25],
        ['Pound (or process) with hot water until elastic and smooth.', 10],
        ['Fry blended tatashe and iru in palm oil; add meats and stock.', 15],
        ['Fold in spinach; cook briefly to keep it vivid green.', 5],
        ['Mound the pounded yam and serve the efo riro alongside.', 3],
      ],
      PHOTOS.recipe[3]
    ),
    story:
      'The thud of the pestle is the sound of a Yoruba compound preparing to feast. Pounded yam is reserved for guests of honour, and efo riro — "stirred greens" — proves that even vegetables can taste of celebration.',
    storyImageUrl: PHOTOS.story[3],
    vendorId: 2,
    vendorName: 'Mama Ngozi Foods',
    rating: 4.7,
    reviewCount: 203,
  }),
  r({
    id: 13,
    title: 'West African Fried Rice',
    description:
      'Party fried rice the Lagos-Accra way: curry-scented rice tossed with liver, shrimp and a rainbow of vegetables.',
    category: 'CONTINENTAL',
    cuisine: 'West African',
    countryOfOrigin: 'GH',
    mealType: 'LUNCH',
    imageUrl: PHOTOS.recipe[4],
    calories: 590,
    servings: 5,
    prepMinutes: 20,
    cookMinutes: 30,
    mealFrequency: '2-3 times per week',
    mealFrequencyReason: 'Vegetable-forward when homemade with modest oil.',
    ingredients: [
      ing('Rice', '3', 'cups'),
      ing('Mixed vegetables', '2', 'cups'),
      ing('Shrimp', '300', 'g'),
      ing('Chicken liver', '200', 'g'),
      ing('Curry powder', '2', 'tbsp'),
      ing('Spring onions', '4', 'stalks'),
    ],
    steps: steps(
      [
        ['Parboil rice with curry and stock until just underdone.', 15],
        ['Stir-fry liver and shrimp; set aside.', 8],
        ['Flash-fry vegetables, return rice and proteins, toss on high heat.', 8],
        ['Finish with spring onions and serve with grilled chicken.', 4],
      ],
      PHOTOS.recipe[4]
    ),
    story:
      'No owambe or Ghanaian wedding buffet is complete without a golden mountain of fried rice beside its rival jollof — the diplomatic dish that lets everyone fill their plate with both.',
    storyImageUrl: PHOTOS.story[4],
    vendorId: 6,
    vendorName: 'Naija Bites',
    rating: 4.3,
    reviewCount: 88,
  }),
  r({
    id: 14,
    title: 'Chicken Shawarma',
    description:
      'The Lagos street classic adopted from the Levant — spiced chicken, creamy garlic sauce and crunchy veg in a toasted wrap.',
    category: 'FOREIGN',
    cuisine: 'Middle Eastern',
    countryOfOrigin: 'Lebanon',
    mealType: 'SNACK',
    imageUrl: PHOTOS.recipe[10],
    calories: 520,
    servings: 2,
    prepMinutes: 25,
    cookMinutes: 20,
    mealFrequency: '1-2 times per week',
    mealFrequencyReason: 'Creamy sauces push the calories up — a delicious occasional indulgence.',
    ingredients: [
      ing('Chicken thighs', '500', 'g'),
      ing('Shawarma spice blend', '2', 'tbsp'),
      ing('Flatbreads', '2', 'pcs'),
      ing('Garlic sauce', '4', 'tbsp'),
      ing('Cabbage, cucumber & tomato', '2', 'cups'),
    ],
    steps: steps(
      [
        ['Marinate chicken in yoghurt and shawarma spices.', 20],
        ['Sear until charred and cooked through; slice thin.', 12],
        ['Warm flatbreads, layer sauce, veg and chicken.', 5],
        ['Roll tight, toast seam-down, slice and serve.', 4],
      ],
      PHOTOS.recipe[10]
    ),
    story:
      'Shawarma arrived in Lagos with Lebanese traders a century ago and never left. Today the late-night shawarma stand — foil-wrapped, extra sausage, extra pepper — is as Nigerian as the suya grill beside it.',
    storyImageUrl: PHOTOS.story[5],
    vendorId: 6,
    vendorName: 'Naija Bites',
    rating: 4.2,
    reviewCount: 77,
  }),
  r({
    id: 15,
    title: 'Sobolo (Zobo)',
    description:
      'Hibiscus petals steeped with ginger and pineapple — the ruby-red drink of West African celebrations, served ice cold.',
    category: 'DRINK',
    cuisine: 'Ghanaian',
    countryOfOrigin: 'GH',
    mealType: 'DRINK',
    imageUrl: PHOTOS.recipe[11],
    calories: 120,
    servings: 6,
    prepMinutes: 10,
    cookMinutes: 25,
    mealFrequency: 'Daily',
    mealFrequencyReason: 'Low-calorie and antioxidant-rich when lightly sweetened.',
    ingredients: [
      ing('Dried hibiscus petals', '2', 'cups'),
      ing('Fresh ginger', '4', 'tbsp'),
      ing('Pineapple peels & chunks', '2', 'cups'),
      ing('Cloves', '1', 'tsp'),
      ing('Sugar or honey', '1/2', 'cup'),
    ],
    steps: steps(
      [
        ['Rinse petals; boil with ginger, cloves and pineapple peels.', 20],
        ['Steep off the heat until deep ruby red.', 15],
        ['Strain, sweeten to taste, and add pineapple chunks.', 5],
        ['Chill thoroughly and serve over ice.', 2],
      ],
      PHOTOS.recipe[11]
    ),
    story:
      'Called sobolo in Ghana and zobo in Nigeria, this hibiscus infusion cools weddings, naming ceremonies and roadside coolers alike — one drink, two names, and a friendly argument about whose ginger hits harder.',
    storyImageUrl: PHOTOS.story[6],
    vendorId: 1,
    vendorName: "Auntie Ama's Kitchen",
    rating: 4.4,
    reviewCount: 65,
  }),
  r({
    id: 16,
    title: 'Chapman',
    description:
      'Nigeria’s beloved mocktail — a fizzy blend of citrus soda, grenadine, cucumber and bitters over mountains of ice.',
    category: 'DRINK',
    cuisine: 'Nigerian',
    countryOfOrigin: 'NG',
    mealType: 'DRINK',
    imageUrl: PHOTOS.recipe[14],
    calories: 180,
    servings: 2,
    prepMinutes: 10,
    cookMinutes: 0,
    mealFrequency: '2-3 times per week',
    mealFrequencyReason: 'A sweet treat — the soda sugars add up, so keep it celebratory.',
    ingredients: [
      ing('Fanta or orange soda', '300', 'ml'),
      ing('Sprite', '200', 'ml'),
      ing('Grenadine syrup', '3', 'tbsp'),
      ing('Angostura bitters', '1', 'tsp'),
      ing('Cucumber, lemon & orange slices', '1', 'cup'),
    ],
    steps: steps(
      [
        ['Fill a large mug (traditionally a beer mug) with ice.', 2],
        ['Add grenadine and bitters, then pour in the sodas.', 3],
        ['Stir gently; crowd the glass with cucumber and citrus.', 3],
        ['Serve with a straw and a paper umbrella if you are feeling fancy.', 1],
      ],
      PHOTOS.recipe[14]
    ),
    story:
      'Invented — legend says — at a Lagos club for a guest named Chapman, this ruby cooler became the default "something classy, no alcohol" order across Nigeria, the drink of first dates and Sunday buffets.',
    storyImageUrl: PHOTOS.story[7],
    vendorId: 2,
    vendorName: 'Mama Ngozi Foods',
    rating: 4.3,
    reviewCount: 54,
  }),
];

const li = (
  id: number,
  type: Listing['type'],
  title: string,
  amountMinor: number,
  vendorId: number,
  img: string,
  extra: Partial<Listing> = {}
): Listing => {
  const vendor = demoVendors.find((v) => v.id === vendorId)!;
  return {
    id,
    type,
    title,
    description: extra.description ?? '',
    imageUrl: img,
    amountMinor,
    currency: vendor.country === 'GH' ? 'GHS' : 'NGN',
    compareAtMinor: null,
    country: vendor.country,
    available: true,
    stockQty: 25,
    quantity: '1',
    unit: 'pack',
    prepMinutes: null,
    vendorId,
    vendorName: vendor.name,
    vendorLogoUrl: vendor.logoUrl,
    status: 'APPROVED',
    linkedRecipeId: null,
    ...extra,
  };
};

export const demoListings: Listing[] = [
  // GH food (Auntie Ama's Kitchen #1, Chale Chop Bar #5)
  li(1, 'FOOD', 'Jollof Rice with Grilled Chicken', 4500, 1, PHOTOS.listing[14], {
    description: 'Smoky party jollof, half chicken, shito on the side.',
    compareAtMinor: 6000, prepMinutes: 31, linkedRecipeId: 1,
  }),
  li(2, 'FOOD', 'Waakye Special (Full Works)', 3800, 5, PHOTOS.listing[16], {
    description: 'Waakye, gari, spaghetti, egg, wele and shito.',
    prepMinutes: 20, linkedRecipeId: 2,
  }),
  li(3, 'FOOD', 'Banku & Grilled Tilapia', 6500, 5, PHOTOS.listing[1], {
    description: 'Whole tilapia, two banku, fresh kpakpo shito.',
    compareAtMinor: 7500, prepMinutes: 35, linkedRecipeId: 4,
  }),
  li(4, 'FOOD', 'Kelewele Night Pack', 1800, 1, PHOTOS.listing[19], {
    description: 'Spicy ginger plantain with roasted groundnuts.',
    prepMinutes: 15, linkedRecipeId: 5,
  }),
  li(5, 'FOOD', 'Groundnut Soup + Omo Tuo (2)', 5200, 1, PHOTOS.listing[8], {
    description: 'Silky nkatenkwan with two rice balls.', prepMinutes: 25, linkedRecipeId: 7,
  }),
  // NG food (Mama Ngozi #2, Naija Bites #6)
  li(6, 'FOOD', 'Egusi Soup + Pounded Yam', 350000, 2, PHOTOS.listing[10], {
    description: 'Rich egusi with assorted meat, fresh pounded yam.',
    compareAtMinor: 420000, prepMinutes: 30, linkedRecipeId: 8,
  }),
  li(7, 'FOOD', 'Suya Platter (Beef, 6 sticks)', 250000, 6, PHOTOS.listing[5], {
    description: 'Char-grilled, extra yaji, onions and tomato.',
    prepMinutes: 18, linkedRecipeId: 9,
  }),
  li(8, 'FOOD', 'Moi Moi (4 wraps)', 120000, 2, PHOTOS.listing[9], {
    description: 'Leaf-steamed with egg and titus fish.', prepMinutes: 20, linkedRecipeId: 10,
  }),
  li(9, 'FOOD', 'Catfish Pepper Soup', 280000, 2, PHOTOS.listing[2], {
    description: 'Fresh catfish, scent leaves, proper heat.', prepMinutes: 25, linkedRecipeId: 11,
  }),
  // GH ingredients (Makola Fresh Market #3)
  li(10, 'INGREDIENT', 'Long-grain Rice', 2200, 3, PHOTOS.listing[3], { quantity: '5', unit: 'kg' }),
  li(11, 'INGREDIENT', 'Fresh Tomatoes', 900, 3, PHOTOS.listing[4], { quantity: '1', unit: 'kg', compareAtMinor: 1200 }),
  li(12, 'INGREDIENT', 'Onions', 700, 3, PHOTOS.listing[6], { quantity: '1', unit: 'kg' }),
  li(13, 'INGREDIENT', 'Scotch Bonnet Pepper', 500, 3, PHOTOS.listing[7], { quantity: '250', unit: 'g' }),
  li(14, 'INGREDIENT', 'Whole Chicken', 4800, 3, PHOTOS.listing[11], { quantity: '1.5', unit: 'kg' }),
  li(15, 'INGREDIENT', 'Red Palm Oil', 1600, 3, PHOTOS.listing[12], { quantity: '750', unit: 'ml' }),
  li(16, 'INGREDIENT', 'Black-eyed Beans', 1400, 3, PHOTOS.listing[13], { quantity: '1', unit: 'kg' }),
  li(17, 'INGREDIENT', 'Ripe Plantains', 1000, 3, PHOTOS.listing[0], { quantity: '4', unit: 'pcs' }),
  li(18, 'INGREDIENT', 'Fresh Ginger', 450, 3, PHOTOS.listing[15], { quantity: '250', unit: 'g' }),
  // NG ingredients (Lagos Spice Hub #4)
  li(19, 'INGREDIENT', 'Egusi (Melon Seeds)', 180000, 4, PHOTOS.listing[17], { quantity: '500', unit: 'g' }),
  li(20, 'INGREDIENT', 'Yaji Suya Spice', 95000, 4, PHOTOS.listing[18], { quantity: '200', unit: 'g', compareAtMinor: 120000 }),
  li(21, 'INGREDIENT', 'Yam Tubers', 220000, 4, PHOTOS.listing[3], { quantity: '2', unit: 'tubers' }),
  li(22, 'INGREDIENT', 'Dried Crayfish', 130000, 4, PHOTOS.listing[7], { quantity: '250', unit: 'g' }),
  li(23, 'INGREDIENT', 'Palm Oil', 160000, 4, PHOTOS.listing[12], { quantity: '1', unit: 'L' }),
  li(24, 'INGREDIENT', 'Stockfish', 250000, 4, PHOTOS.listing[11], { quantity: '300', unit: 'g' }),
];

export const demoStories: Story[] = demoRecipes
  .filter((rec) => rec.story)
  .slice(0, 8)
  .map((rec, i) => ({
    id: i + 1,
    recipeId: rec.id,
    title:
      rec.id === 1
        ? 'The story of Jollof'
        : rec.id === 2
          ? 'Waakye at dawn'
          : `The story of ${rec.title}`,
    body: rec.story ?? '',
    imageUrl: rec.storyImageUrl ?? PHOTOS.story[i % PHOTOS.story.length],
    cuisine: rec.cuisine,
    countryName: rec.countryOfOrigin === 'GH' ? 'Ghana' : rec.countryOfOrigin === 'NG' ? 'Nigeria' : rec.countryOfOrigin,
    vendorName: rec.vendorName,
  }));

export const demoReviews: Review[] = [
  { id: 1, rating: 5, comment: 'Tastes exactly like my grandmother’s pot. The step timings are spot on.', userName: 'Kwame A.', userAvatarUrl: PHOTOS.avatar[2], createdAt: '2026-06-28T10:12:00Z' },
  { id: 2, rating: 4, comment: 'Lovely depth of flavour. I added extra ginger and it was perfect.', userName: 'Chiamaka O.', userAvatarUrl: PHOTOS.avatar[3], createdAt: '2026-06-25T18:40:00Z' },
  { id: 3, rating: 5, comment: 'The food story made me call my mum. Beautiful recipe.', userName: 'Yaw B.', userAvatarUrl: PHOTOS.avatar[4], createdAt: '2026-06-20T08:05:00Z' },
  { id: 4, rating: 4, comment: 'Great with the one-click basket — everything arrived fresh.', userName: 'Adaeze N.', userAvatarUrl: PHOTOS.avatar[5], createdAt: '2026-06-15T14:22:00Z' },
];

export const demoPlans: Plan[] = [
  {
    code: 'FREE',
    name: 'Free',
    amountMinorGHS: 0,
    amountMinorNGN: 0,
    interval: 'forever',
    features: ['Browse all recipes', 'Order meals & ingredients', 'Food passport stamps'],
  },
  {
    code: 'PREMIUM_MONTHLY',
    name: 'Premium Monthly',
    amountMinorGHS: 3000,
    amountMinorNGN: 150000,
    interval: 'monthly',
    features: [
      'Ask Dishaspora AI assistant',
      'Video & audio cook-along guides',
      'Chat directly with vendors',
      'Early access to new recipes',
    ],
  },
];

export const demoPassport: { stamps: PassportStamp[]; countriesStamped: number; totalCooked: number } = {
  countriesStamped: 2,
  totalCooked: 8,
  stamps: [
    { country: 'GH', countryName: 'Ghana', cuisine: 'Ghanaian', flagEmoji: 'GH', recipesCooked: 5, totalRecipes: 12, stamped: true, firstCookedAt: '2026-05-02T09:00:00Z' },
    { country: 'NG', countryName: 'Nigeria', cuisine: 'Nigerian', flagEmoji: 'NG', recipesCooked: 3, totalRecipes: 12, stamped: true, firstCookedAt: '2026-05-20T19:30:00Z' },
    { country: 'SN', countryName: 'Senegal', cuisine: 'Senegalese', flagEmoji: 'SN', recipesCooked: 0, totalRecipes: 6, stamped: false, firstCookedAt: null },
    { country: 'ET', countryName: 'Ethiopia', cuisine: 'Ethiopian', flagEmoji: 'ET', recipesCooked: 0, totalRecipes: 5, stamped: false, firstCookedAt: null },
    { country: 'MA', countryName: 'Morocco', cuisine: 'Moroccan', flagEmoji: 'MA', recipesCooked: 0, totalRecipes: 4, stamped: false, firstCookedAt: null },
    { country: 'KE', countryName: 'Kenya', cuisine: 'Kenyan', flagEmoji: 'KE', recipesCooked: 0, totalRecipes: 4, stamped: false, firstCookedAt: null },
  ],
};

export const demoOrders: Order[] = [
  {
    id: 101,
    reference: 'DSP-8F2K1',
    status: 'PREPARING',
    items: [
      { listingId: 1, title: 'Jollof Rice with Grilled Chicken', imageUrl: PHOTOS.listing[14], qty: 2, amountMinor: 4500 },
      { listingId: 4, title: 'Kelewele Night Pack', imageUrl: PHOTOS.listing[19], qty: 1, amountMinor: 1800 },
    ],
    subtotalMinor: 10800,
    feeMinor: 756,
    deliveryMinor: 300,
    totalMinor: 11856,
    currency: 'GHS',
    vendorId: 1,
    vendorName: "Auntie Ama's Kitchen",
    createdAt: '2026-07-03T09:14:00Z',
  },
  {
    id: 102,
    reference: 'DSP-3B7Q9',
    status: 'COMPLETED',
    items: [
      { listingId: 2, title: 'Waakye Special (Full Works)', imageUrl: PHOTOS.listing[16], qty: 1, amountMinor: 3800 },
    ],
    subtotalMinor: 3800,
    feeMinor: 266,
    deliveryMinor: 300,
    totalMinor: 4366,
    currency: 'GHS',
    vendorId: 5,
    vendorName: 'Chale Chop Bar',
    createdAt: '2026-07-01T07:45:00Z',
  },
  {
    id: 103,
    reference: 'DSP-9D4X2',
    status: 'COMPLETED',
    items: [
      { listingId: 11, title: 'Fresh Tomatoes', imageUrl: PHOTOS.listing[4], qty: 2, amountMinor: 900 },
      { listingId: 12, title: 'Onions', imageUrl: PHOTOS.listing[6], qty: 1, amountMinor: 700 },
      { listingId: 15, title: 'Red Palm Oil', imageUrl: PHOTOS.listing[12], qty: 1, amountMinor: 1600 },
    ],
    subtotalMinor: 4100,
    feeMinor: 287,
    deliveryMinor: 300,
    totalMinor: 4687,
    currency: 'GHS',
    vendorId: 3,
    vendorName: 'Makola Fresh Market',
    createdAt: '2026-06-27T16:20:00Z',
  },
];

export const demoThreads: ChatThread[] = [
  {
    id: 1,
    vendorId: 1,
    vendorName: "Auntie Ama's Kitchen",
    vendorLogoUrl: PHOTOS.vendor[0],
    lastMessage: 'Your jollof order is on the grill now! 20 minutes.',
    lastAt: '2026-07-03T09:40:00Z',
    unread: 1,
  },
  {
    id: 2,
    vendorId: 3,
    vendorName: 'Makola Fresh Market',
    vendorLogoUrl: PHOTOS.vendor[2],
    lastMessage: 'Fresh kontomire came in this morning if you want to add some.',
    lastAt: '2026-07-02T11:05:00Z',
    unread: 0,
  },
];

export const demoMessages: Record<number, ChatMessage[]> = {
  1: [
    { id: 1, threadId: 1, senderId: 1, senderName: 'Ama Mensah', mine: true, body: 'Hi! Is the party jollof available today?', createdAt: '2026-07-03T09:30:00Z' },
    { id: 2, threadId: 1, senderId: 90, senderName: "Auntie Ama's Kitchen", mine: false, body: 'Chale, always! Smoky as ever. How many packs?', createdAt: '2026-07-03T09:32:00Z' },
    { id: 3, threadId: 1, senderId: 1, senderName: 'Ama Mensah', mine: true, body: 'Two packs with extra shito please', createdAt: '2026-07-03T09:35:00Z' },
    { id: 4, threadId: 1, senderId: 90, senderName: "Auntie Ama's Kitchen", mine: false, body: 'Your jollof order is on the grill now! 20 minutes.', createdAt: '2026-07-03T09:40:00Z' },
  ],
  2: [
    { id: 5, threadId: 2, senderId: 1, senderName: 'Ama Mensah', mine: true, body: 'Do you have fresh garden eggs this week?', createdAt: '2026-07-02T10:58:00Z' },
    { id: 6, threadId: 2, senderId: 91, senderName: 'Makola Fresh Market', mine: false, body: 'Fresh kontomire came in this morning if you want to add some.', createdAt: '2026-07-02T11:05:00Z' },
  ],
};
