# Dishaspora Design System

Recreate the reference screenshots to the core, with the Dishaspora palette on a WHITE background.
Reference screenshots (Read these before building any screen):
- `C:\Users\comp\OneDrive\Pictures\Screenshots\Screenshot 2026-07-03 192508.png` — home feed cards, settings, favorites, empty states, floating nav
- `C:\Users\comp\OneDrive\Pictures\Screenshots\Screenshot 2026-07-03 192548.png` — vendor storefront, cart + order summary, calendar page
- `C:\Users\comp\OneDrive\Pictures\Screenshots\Screenshot 2026-07-03 193241.png` — onboarding hero, dish detail (two-tone title, meta row, size chips, contact row, black Order pill)

## Palette (exported as `colors` in mobile `src/theme.ts` and admin `src/theme.css`)
```
background      #FFFFFF   (app background — WHITE, per user requirement)
surface         #F6F8F9   (cards/inputs — soft neutral like the refs)
surfaceAlt      #EFF3F5
brand           #27EBF5   (Dishaspora cyan — logo badge, brand chips, highlights, active nav dot)
brandDark       #0FB8C4   (text-on-light cyan, pressed states)
brandLight      #D9FCFE   (tints, chip backgrounds)
blue            #33CFFF   (links, secondary buttons, info accents)
blueDark        #0E9FD8
blueLight       #E3F7FF
accent          #FF9F43   (PRIMARY CTA color — plays the role orange plays in the refs: big pill buttons, prices, active segmented tab, badges)
accentDark      #F27F0C
accentLight     #FFF1E0
ink             #17252A   (headings)
inkSoft         #5C6B73   (secondary text — the gray in two-tone titles)
inkFaint        #9AA7AE
danger          #E5484D
success         #2FBF71
star            #FFC120
```

## Signature patterns (from the refs — implement these exactly)
1. **Floating pill bottom nav**: white pill bar, rounded-full, subtle shadow, floating ~12px above bottom, 5 slots. Center slot = circular **cyan (#27EBF5) logo badge** with white "D" monogram, slightly raised, with a small orange notification dot. Inactive icons inkFaint; active icon accent orange with a small dot.
2. **Recipe/product cards (2-col grid)**: image with 20px radius, bottom-left overlay chip = small rounded brand badge (vendor logo circle + white vendor name on dark translucent pill) + circular orange arrow button bottom-right of the chip row. Under image (product variant): title (ink, semibold), subtitle (inkFaint, 12), price row `GH₵ 45.00` in accent + strikethrough compareAt in inkFaint, full-width small orange "Buy now" pill.
3. **Segmented pill tabs**: light gray (#F6F8F9) rounded-full track; active segment = orange pill with white text; inactive = inkSoft text. (e.g. "All Items | Popular | Exclusive offers", "My recipes | My profile", "List | Calendar").
4. **Search bar row**: rounded-full surface input with search icon + placeholder "Search Dishaspora", trailing circular orange cart button (badge count).
5. **Section headers**: "Recipes & Packages"-style: title (ink, 17 semibold) left, "see all" (inkFaint 13) right.
6. **Two-tone titles** (detail pages): first word bold ink, remaining words inkSoft light — e.g. **Grilled** chicken breast.
7. **Floating circular buttons** on heroes: white circles w/ shadow, back arrow top-left, heart top-right.
8. **Meta row** on detail: three items separated: 🚚 Free Delivery · ⏱ 20–25 min · 🔥 620 Kcal (icon + small ink text).
9. **Choice chips**: rounded-full outline chips; selected = solid ink (black) chip with white text (like Small/Medium/Large in ref 3).
10. **Contact row**: avatar + name + role, trailing circular chat + call buttons (surface circles).
11. **Primary CTA pill**: full-width rounded-full orange (#FF9F43) button, white 16 semibold text ("Create a shopping list" style). Big "Order" button variant: solid ink/black pill (ref 3) — use black for Order/Checkout on detail pages, orange elsewhere.
12. **Empty states**: centered illustration image, gray one-liner, then orange CTA pill (ref: "You haven't created a shopping list yet").
13. **Cart rows**: white card, left rounded image, title + ⭐rating + ⏱time, circular − / count / + stepper (plus button orange-outline), small orange "Buy now"/price at right.
14. **Order Summary block**: label/value rows (Sub Total, Taxes & Fee, Delivery Fee) inkSoft/ink, divider, bold Total row, then Checkout pill.
15. **Onboarding**: full-bleed food hero image, bottom overlay: big two-line headline (34 bold ink on white panel), sub-paragraph inkSoft, row = small round icon chip + big dark circular Start button with chevrons.
16. **Vendor storefront**: full-width cover image w/ rounded bottom, overlapping 64px rounded-square logo, name + `4.4/5 ⭐ (455+)` + "See reviews" chip, segmented tabs, 2-col product grid.
17. **Calendar page pattern** (ref 2 right): List|Calendar segmented toggle, month header with ‹ › (orange circle for next), Mon–Sun row on surface pill, dates row with orange circle on selected date. Use this pattern for the vendor Orders screen (orders by day) and user order history.

## Reference 4 — COLOR REFERENCE ONLY (superseded for layout, 2026-07-03)
USER CORRECTION: Reference 4 is NOT a layout template. Screen structure, navigation, and patterns come from refs 1–3 ONLY (floating pill bottom nav with center cyan D badge per pattern #1, tabs = Home · Search · center D (Ask Dishaspora) · Market · Profile; original screen list stands; NO Challenges / Cook Together features). From Reference 4 take ONLY the color treatment: orange lowercase "dishaspora" wordmark in the home header, cyan-gradient hero/feature cards with the dish photo bleeding off the edge, alternating cyan/orange tinted icon tiles, blue "View all"/link text, orange star ratings, cyan active states. The "Production polish" section below still applies IN FULL. Original transcription kept below purely as a color/mood reference:
1. Header: hamburger icon left; center wordmark "dishaspora" in lowercase rounded bold ORANGE (#FF9F43) with a tiny orange chef-hat doodle over the "spo"; right: bell icon with orange badge "3" + 40px round avatar.
2. Search bar: rounded-full white/surface input, left search icon, placeholder "Search recipes, ingredients, cuisines...", right = small BLUE (#33CFFF) sliders/filter icon.
3. Cuisine chip row (horizontal scroll): pill chips w/ leading icon — active chip "All" = accentLight bg + 🍜 icon + orange text; others white with soft border: "🇬🇭 Ghanaian", "🇳🇬 Nigerian", "⏱ Quick Meals"; trailing "More" grid-icon mini-button.
4. DISH OF THE DAY hero card: large rounded-28 card, CYAN gradient bg (#33CFFF→#27EBF5), left column: small white translucent pill "✨ DISH OF THE DAY", big white title "Waakye 🇬🇭", white subtext "A true taste of Ghana. Rich • Flavorful • Loved by generations.", white pill button "View Recipe ›" (blue text); right: big appetizing dish photo bleeding off the card edge (plate at an angle = 3D feel); pagination dots bottom (carousel of daily dishes).
5. Quick-action tile row: white rounded-20 card containing 5 equal tiles, each = 48px rounded-16 icon tile + 2-line label below (ink 12): "Recipe Passport" (cyan-light tile, blue passport icon), "Ingredient Basket" (orange-light tile, orange basket), "Cook Together" (cyan-light, people icon), "Challenges" (orange-light, trophy), "Saved Recipes" (cyan-light, bookmark). Alternate cyan/orange tints.
6. "Popular Recipes" section header + "View all ›" in BLUE; horizontal scroll of recipe cards: image top (rounded-20) with white heart circle top-right, below: title (ink semibold), cuisine label in BLUE 12 ("Ghanaian"/"Nigerian"), meta row: ⏱ 45 min · 📶 Easy, then ⭐ 4.8 (2.3k) with orange star.
7. "Ongoing Challenges" section header + View all; horizontal cards: rounded-24 tinted cards (one accentLight/orange theme, one blueLight/cyan theme) with small round icon badge (orange coin / cyan trophy), bold title ("₵20 Meal Challenge", "Jollof War 🔥"), 2-line sub, "👥 1.2k joined", circular chevron button, and a round dish photo bleeding off the right edge.
8. Bottom nav bar: white, 5 items with labels: Home (active, CYAN icon+label), Explore (compass), CENTER = raised cyan (#27EBF5→#33CFFF gradient) circular FAB with white "+" (use it as Create/Ask hub), Community (chat bubble), Profile (person). Active = cyan; inactive = ink gray.
Background of the mock is warm cream — we keep the app background WHITE per requirement and use accentLight/brandLight tints on cards to achieve the same warmth.

TAB STRUCTURE (FINAL, per user correction): Home · Search · center cyan D logo badge (opens Ask Dishaspora) · Market · Profile — the floating pill nav from refs 1–2 exactly (pattern #1). No Challenges/Cook Together.

## Production polish (REQUIRED — user wants to inspect a flawless UI)
- react-native-reanimated v3 + react-native-gesture-handler everywhere: spring press-scale (0.96) on all cards/buttons, staggered FadeInDown entrances on lists, layout animations, animated segmented-pill slide, tab-switch transitions.
- "3D everything": subtle depth — perspective tilt on the Dish-of-the-Day hero (slow rotateY/rotateX float loop + parallax of the dish photo), pressable cards tilt toward touch point (rotateX/rotateY interpolation, max ~6°), hero dish photos rendered oversized + rotated (-8°) bleeding off card edges with drop shadow, layered soft shadows (elevation 2–12 scale), scroll-driven parallax on detail hero, header blur/collapse on scroll (expo-blur).
- expo-haptics on primary actions (tab press light, order success notification, stamp earned success).
- Skeleton shimmer loaders (reanimated) for every list/detail while fetching; optimistic hearts/saves; expo-linear-gradient for hero/gradient surfaces; animated Passport stamp reveal (scale+rotate spring + confetti dots) when a stamp is earned; animated count-up on stats.
- DEMO MODE: src/demo/demoData.ts containing rich local data (recipes incl. jollof/waakye/light soup/banku, vendors, listings, stories, challenges, orders, user) mirroring API.md types; api layer auto-falls back to demo data when API_URL is unreachable (and a DEMO_MODE=true override in src/config.ts) so the ENTIRE app is inspectable in Expo Go with zero backend. Every screen must look full, never empty, in demo mode. (Expo default / Inter on web), headings semibold/bold, generous whitespace, radius scale 12/16/20/28, soft shadows (`shadowOpacity 0.06, radius 12`).
Currency display: `GH₵ 45.00` / `₦ 1,500` from amountMinor/100.

## Screens not in the refs (design in the same language)
Auth (login/register): white bg, small cyan logo badge top, big two-tone headline ("Welcome back"), surface rounded-full inputs with icons, orange CTA pill, blue text links, country picker as two flag chips (🇬🇭 Ghana / 🇳🇬 Nigeria) styled like choice chips.
Profile/Settings: exactly like ref 1 settings block — segmented "My recipes | My profile", "My favorites" card with 2×2 image grid, list rows in white cards, chevrons; premium banner card in brandLight with cyan badge.
Passport: grid of country stamp cards — stamped = brandLight card with flag + cyan check seal + progress "3/12 dishes"; unstamped = dashed-border gray card (like the "+ New notebook" dashed card in ref 1).
Snap & Cook mode: full-screen step card — step image top, "Step 2 of 7" chip (cyan), big instruction text, orange timer pill with countdown, big prev/next circular buttons, progress bar in accent.
Stories feed: horizontal story circles (cyan ring) atop home + full-screen story reader (image top, title, body, "View recipe" orange pill).
Assistant ("Ask Dishaspora", premium): chat bubbles — user = orange tint (accentLight, right), assistant = surface (left) with small cyan D avatar; recipe result cards inline (pattern #2); suggestion chips row.
Marketplace tabs: "Meals | Ingredients" segmented control, search row (#4), grid (#2).
One-Click Basket sheet: bottom sheet listing matched ingredients w/ vendor header, unmatched grayed with "not available" note, total row, orange "Add all to cart".
Subscription: plan cards — Premium card = ink (dark) card with cyan + orange feature icons, price big, orange "Subscribe" pill; free plan = surface card.
Admin web: light theme, white bg, sidebar with cyan logo badge, orange active nav pill, stat tiles (surface cards, big ink number, small colored delta), tables in white cards with pill status badges (PENDING=accentLight/accentDark, APPROVED=greenish, REJECTED=danger tint), approve=orange pill / reject=outline danger.

## Mock images
`/images/recipe-1..40.png`, `listing-1..20.png`, `vendor-1..8.png`, `story-1..8.png`, `banner-1..4.png`, `avatar-1..8.png`, `onboarding-1..3.png`, `empty-1..3.png`, `logo.png` — generated gradients/shapes in the palette. Backend serves them; mobile also has local copies of `logo.png`, `onboarding-*.png`, `empty-*.png` in `mobile/assets/`.

## ICONS — GLOBAL RULE (user mandate, 2026-07-03)
NO EMOJIS anywhere in any UI, and no emoji-style colored glyphs. Real vector icons only:
- Mobile: @expo/vector-icons Ionicons, single-color, tinted via the palette.
- Admin web: lucide-react stroke icons, single-color, tinted via CSS variables.
- Country flags: small inline SVG flags (Ghana: red/gold/green horizontal bands + black star; Nigeria: green/white/green vertical bands) as rounded 16-20px badges — or a plain "GH"/"NG" text pill where a flag feels heavy.
- Stars: icon-set star tinted #FFC120. Timers/calories/delivery: icon glyphs tinted inkSoft/accent.
Anywhere this document shows an emoji, read it as "the equivalent vector icon".

## Admin sign-in page (rebuilt spec — modern & professional)
Full-viewport split layout, NOT a small centered card:
- Left 55%: full-bleed food photography (use /images/banner-1.png or onboarding-1.png from the API host, with a local fallback gradient if the API is down), dark ink gradient overlay bottom-left containing: white "dishaspora" wordmark (lowercase, bold, orange dot or cyan accent), tagline "Admin Console — approvals, moderation & analytics", and 3 small stat-ish trust chips (cyan/orange tinted, lucide icons). Subtle slow Ken Burns zoom on the image.
- Right 45%: white panel, generous padding, left-aligned: small cyan D logo badge, "Welcome back" two-tone heading (bold ink + inkSoft), "Sign in to the Dishaspora admin console" subtext, labeled inputs (Email, Password) — 52px, rounded-14, surface bg, lucide mail/lock leading icons, password eye toggle, focus ring in cyan; inline error banner (danger tint) on bad credentials; full-width orange CTA "Sign in" with press/hover elevation + loading spinner state; small footer "Restricted access · Dishaspora © 2026".
- Responsive: under 900px the image side collapses to a top banner.
