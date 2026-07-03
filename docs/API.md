# Dishaspora REST API Contract (v1)

Base URL: `http://<host>:8080/api`
Auth: `Authorization: Bearer <jwt>` on all endpoints except auth, and public GETs (recipes, stories, vendors, listings, plans).
All responses JSON. Errors: `{ "status": <http>, "message": "...", "timestamp": "..." }`.
Static images served at `http://<host>:8080/images/<file>.png`. Uploaded media at `/uploads/<file>`.
Countries: `GH` | `NG`. Currencies: GH→GHS, NG→NGN. All money values are integers in the minor unit (pesewas/kobo) named `amountMinor`, plus `currency`.

## Roles
`USER`, `VENDOR`, `ADMIN`. A VENDOR is also a normal user. Vendor accounts have `vendorStatus`: `PENDING | APPROVED | REJECTED`.

## DTO shapes (canonical)

```jsonc
User {
  "id": 1, "name": "Ama Mensah", "email": "ama@x.com", "role": "USER",
  "country": "GH", "avatarUrl": "/images/avatar-1.png",
  "premium": false, "premiumUntil": null,
  "vendorId": null            // set if this user owns a vendor profile
}

Vendor {
  "id": 1, "name": "Auntie Ama's Kitchen", "bio": "...", "country": "GH",
  "logoUrl": "/images/vendor-1.png", "coverUrl": "/images/banner-1.png",
  "type": "FOOD" | "INGREDIENT" | "BOTH",
  "status": "PENDING|APPROVED|REJECTED", "rejectionFeedback": null,
  "rating": 4.4, "reviewCount": 455, "specialty": "Ghanaian classics",
  "location": "Osu, Accra", "phone": "+233..."
}

Ingredient { "name": "Tomatoes", "quantity": "4", "unit": "pcs" }

RecipeStep { "stepNumber": 1, "instruction": "...", "durationMinutes": 5, "imageUrl": "/images/recipe-3.png" }

Recipe {
  "id": 1, "title": "Jollof Rice", "description": "...",
  "category": "LOCAL" | "CONTINENTAL" | "FOREIGN" | "DRINK",
  "cuisine": "Ghanaian", "countryOfOrigin": "GH",  // ISO or free country name for foreign
  "mealType": "BREAKFAST|LUNCH|DINNER|SNACK|DRINK",
  "imageUrl": "/images/recipe-1.png",
  "calories": 620, "servings": 4, "prepMinutes": 20, "cookMinutes": 45,
  "mealFrequency": "2-3 times per week", "mealFrequencyReason": "Balanced but rice-heavy...",
  "ingredients": [Ingredient], "steps": [RecipeStep],
  "story": "Cultural narrative text...",                 // Food Story
  "storyImageUrl": "/images/story-1.png",
  "videoUrl": null | "/uploads/x.mp4",                   // premium-gated: null for non-premium callers
  "audioUrl": null | "/uploads/x.mp3",                   // premium-gated
  "hasVideo": true, "hasAudio": true,                    // always visible flags
  "vendorId": 1, "vendorName": "Auntie Ama's Kitchen",
  "status": "PENDING|APPROVED|REJECTED",
  "rating": 4.5, "reviewCount": 89, "savedByMe": false, "cookedByMe": false
}

Listing {
  "id": 1, "type": "FOOD" | "INGREDIENT",
  "title": "Jollof Rice with Grilled Chicken", "description": "...",
  "imageUrl": "/images/listing-1.png",
  "amountMinor": 4500, "currency": "GHS",
  "compareAtMinor": 6000 | null,          // strikethrough price
  "country": "GH", "available": true, "stockQty": 25,
  "quantity": "1", "unit": "pack",        // for ingredients e.g. "500", "g"
  "prepMinutes": 31 | null,               // food listings
  "vendorId": 1, "vendorName": "...", "vendorLogoUrl": "...",
  "status": "PENDING|APPROVED|REJECTED", "linkedRecipeId": 1 | null
}

Review { "id":1, "rating":5, "comment":"...", "userName":"Ama", "userAvatarUrl":"...", "createdAt":"..." }

Order {
  "id": 1, "reference": "DSP-...", "status": "PENDING_PAYMENT|PAID|PREPARING|READY|COMPLETED|CANCELLED",
  "items": [{ "listingId":1, "title":"...", "imageUrl":"...", "qty":2, "amountMinor":4500 }],
  "subtotalMinor": 9000, "feeMinor": 700, "deliveryMinor": 300, "totalMinor": 10000,
  "currency": "GHS", "vendorId":1, "vendorName":"...", "createdAt":"..."
}

PaystackInit { "authorizationUrl": "https://checkout.paystack.com/...", "reference": "...", "publicKey": "pk_test_...", "amountMinor": 10000, "currency": "GHS" }

Plan { "code": "PREMIUM_MONTHLY", "name": "Premium Monthly", "amountMinorGHS": 3000, "amountMinorNGN": 150000, "interval": "monthly", "features": ["..."] }

PassportStamp { "country": "GH", "countryName": "Ghana", "cuisine": "Ghanaian", "flagEmoji": "🇬🇭", "recipesCooked": 3, "totalRecipes": 12, "stamped": true, "firstCookedAt": "..." }

Story { "id":1, "recipeId":1, "title":"The story of Jollof", "body":"...", "imageUrl":"/images/story-1.png", "cuisine":"Ghanaian", "countryName":"Ghana", "vendorName":"..." }

ChatThread { "id":1, "vendorId":1, "vendorName":"...", "vendorLogoUrl":"...", "lastMessage":"...", "lastAt":"...", "unread":2 }
ChatMessage { "id":1, "threadId":1, "senderId":1, "senderName":"...", "mine":true, "body":"...", "createdAt":"..." }

Flag { "id":1, "type":"DUPLICATE_RECIPE|COUNTRY_MISMATCH|CATEGORY_SUSPECT|INAPPROPRIATE|REPEATED_SUBMISSION", "targetType":"RECIPE|LISTING|VENDOR", "targetId":1, "targetTitle":"...", "detail":"...", "resolved":false, "createdAt":"..." }
```

## Endpoints

### Auth (`/auth`)
- `POST /auth/register` `{name,email,password,country}` → `{token, user}` (409 if email taken)
- `POST /auth/login` `{email,password}` → `{token, user}`
- `GET /users/me` → User
- `PUT /users/me` `{name?, avatarUrl?, country?}` → User

### Recipes (`/recipes`) — GETs public
- `GET /recipes?q=&category=&cuisine=&mealType=&maxCalories=&maxMinutes=&country=&page=0&size=20` → `{content:[Recipe], totalElements, totalPages}` (only APPROVED; `maxMinutes` = prep+cook)
- `GET /recipes/trending` → `[Recipe]` (top-rated, max 10)
- `GET /recipes/{id}` → Recipe (video/audio URLs nulled unless caller premium)
- `POST /recipes` (VENDOR) full Recipe payload minus id/status → Recipe (status PENDING, runs auto-flag checks)
- `PUT /recipes/{id}` (owner VENDOR) → Recipe (resets to PENDING)
- `POST /recipes/{id}/save` / `DELETE /recipes/{id}/save`; `GET /users/me/saved` → `[Recipe]`
- `POST /recipes/{id}/cooked` → `{stamp: PassportStamp, newStamp: true|false}` (marks cooked, awards passport progress)
- `GET /recipes/{id}/reviews` → `[Review]`; `POST /recipes/{id}/reviews` `{rating,comment}` → Review
- `GET /passport` (auth) → `{stamps:[PassportStamp], countriesStamped: 2, totalCooked: 7}`
- `GET /stories?country=&page=` → `{content:[Story],...}`
- `GET /recipes/{id}/basket` (auth) → One-Click Ingredient Basket:
  `{ "vendor": Vendor|null, "items": [{ "ingredient": Ingredient, "listing": Listing, "qty": 1 }], "totalMinor": 12000, "currency":"GHS", "unmatched": [Ingredient] }`
  Server picks the APPROVED ingredient vendor in the user's country matching the most ingredients (name contains, case-insensitive).

### Marketplace
- `GET /vendors?country=&type=` → `[Vendor]` (APPROVED only)
- `GET /vendors/{id}` → Vendor; `GET /vendors/{id}/listings` → `[Listing]`; `GET /vendors/{id}/reviews` → `[Review]`; `POST /vendors/{id}/reviews` `{rating,comment}`
- `POST /vendors/apply` (auth) `{name,bio,type,specialty,location,phone,logoUrl?,coverUrl?}` → Vendor (PENDING; user's role becomes VENDOR on approval)
- `GET /vendors/me` (VENDOR) → own Vendor incl. status
- `GET /listings?type=&q=&country=&page=&size=` → paged (APPROVED + vendor APPROVED; server forces country = caller's country when authed, else param)
- `POST /listings` (approved VENDOR) → Listing (PENDING, auto-flag checks)
- `PUT /listings/{id}`, `DELETE /listings/{id}` (owner)

### Orders (`/orders`)
- `POST /orders` `{items:[{listingId, qty}]}` → `{order: Order, payment: PaystackInit}`
  - 400 if items span multiple vendors (one order per vendor) or listing.country ≠ user.country.
  - fee = 7% subtotal (platform commission), delivery = flat 300 minor units.
- `POST /orders/{id}/verify` `{reference}` → Order (backend calls Paystack verify; if `paystack.secret-key` unset, auto-approves for local dev)
- `GET /orders` → `[Order]` (mine); `GET /orders/{id}` → Order
- `GET /vendor/orders` (VENDOR) → `[Order]`; `PUT /vendor/orders/{id}/status` `{status}` → Order

### Subscription (`/subscription`)
- `GET /subscription/plans` → `[Plan]`
- `POST /subscription/subscribe` `{planCode}` → PaystackInit
- `POST /subscription/verify` `{reference}` → User (premium=true, premiumUntil set)
- `GET /subscription/me` → `{premium, premiumUntil, planCode}`

### AI Assistant (premium; 402 PAYMENT_REQUIRED if not premium)
- `POST /assistant/chat` `{message, history:[{role:"user"|"assistant", content:"..."}]}` → `{reply: "...", recipes: [Recipe]}` — Claude API grounded ONLY in the platform recipe DB (server injects a compact recipe catalog into the system prompt). If `anthropic.api-key` unset → rule-based fallback (keyword/ingredient/calorie parsing) so the demo always works.
- `GET /search/smart?q=` (free for all) → `{filters: {q,category,maxCalories,maxMinutes,cuisine}, recipes: [Recipe]}` — natural-language → filters (rule-based parse; Claude-enhanced when key present).

### Chat (premium user ↔ vendor; vendors always allowed)
- `GET /chat/threads` → `[ChatThread]`
- `POST /chat/threads` `{vendorId}` → ChatThread (idempotent)
- `GET /chat/threads/{id}/messages?after=<messageId>` → `[ChatMessage]` (poll every 3s)
- `POST /chat/threads/{id}/messages` `{body}` → ChatMessage

### Media
- `POST /media` (auth, multipart `file`) → `{url: "/uploads/<uuid>.<ext>"}` (max 50MB; mp4/mp3/jpg/png)

### Admin (`/admin`, ADMIN only)
- `GET /admin/queue/vendors` → `[Vendor]` (PENDING); `POST /admin/vendors/{id}/approve`; `POST /admin/vendors/{id}/reject` `{feedback}`
- `GET /admin/queue/recipes` → `[Recipe]`; approve/reject same pattern with `{feedback}`
- `GET /admin/queue/listings` → `[Listing]`; approve/reject same pattern
- `GET /admin/flags?resolved=false` → `[Flag]`; `POST /admin/flags/{id}/resolve`
- `GET /admin/analytics` → `{users, vendors, recipes, listings, orders, revenueMinorByCurrency:{GHS:..,NGN:..}, premiumUsers, byCountry:{GH:{users,orders},NG:{...}}, recentOrders:[Order], ordersPerDay:[{date,count}]}`
- `GET /admin/users?q=` → `[User]`; `POST /admin/users/{id}/ban` / `unban`

## Auto-flagging (on recipe/listing create)
- DUPLICATE_RECIPE: same normalized title already exists (any vendor).
- COUNTRY_MISMATCH: listing.country ≠ vendor.country.
- CATEGORY_SUSPECT: category DRINK but title contains soup/rice/stew etc. (small keyword heuristic), and vice versa.
- REPEATED_SUBMISSION: same vendor submitted ≥3 items in 10 minutes.
- INAPPROPRIATE: title/description contains a word from a small banned list.
Flags do NOT block publication workflow — they appear in the admin flags queue attached to the pending item.

## Seed accounts (DataSeeder, runs when DB empty)
- admin@dishaspora.com / Admin123! (ADMIN)
- ama@demo.com / Demo123! (USER, GH, premium)  |  chinedu@demo.com / Demo123! (USER, NG, not premium)
- vendor.gh@demo.com / Demo123! (VENDOR approved, GH, type BOTH)  |  vendor.ng@demo.com / Demo123! (VENDOR approved, NG, BOTH)
- one PENDING vendor + 2 PENDING recipes + 2 PENDING listings + a few flags, so admin queues are non-empty
- ≥36 APPROVED recipes (Ghana ~12, Nigeria ~12, continental/foreign ~8, drinks ~4) with full ingredients, steps, calories, mealFrequency, story; images `/images/recipe-1.png`..`recipe-40.png`, stories `story-1..8`, vendors `vendor-1..8`, listings `listing-1..20`, banners `banner-1..4`, avatars `avatar-1..8`
- ≥24 APPROVED listings (food + ingredient, split GH/NG); ingredient listings must cover common seed-recipe ingredients (rice, tomatoes, onions, pepper, chicken, beef, fish, palm oil, beans, plantain, yam, garri, egusi, spices) so One-Click Basket matches well
- reviews on recipes and vendors; a few orders, one chat thread with messages
```
