# Dishaspora Backend

Modular monolith Spring Boot 3.3 (Java 17) backend implementing the full contract in `../docs/API.md`.

Modules (packages under `com.dishaspora`): `common`, `config`, `auth`, `recipe`, `marketplace`, `order`, `subscription`, `admin`, `ai`, `chat`, `media`.

## Run

### Zero-setup (H2 file database, no PostgreSQL needed)

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=h2
# or
mvn package -DskipTests && java -jar target/dishaspora-backend-1.0.0.jar --spring.profiles.active=h2
```

Data is stored in `./data/dishaspora.mv.db`.

### PostgreSQL (default profile)

Create a database `dishaspora` on `localhost:5432` (user/password `postgres`/`postgres`), then:

```bash
mvn spring-boot:run
```

The server listens on **http://localhost:8080** (API base `http://localhost:8080/api`).
Static seed images: `http://localhost:8080/images/<file>.png`. Uploads served from `/uploads/**` (stored in `./uploads`).

On first start (empty user table) the `DataSeeder` populates: 36 approved + 2 pending recipes, 7 vendors (1 pending), 40 approved + 2 pending listings, reviews, flags, orders, a chat thread and the accounts below.

## Seed accounts

| Email | Password | Role | Country | Notes |
|---|---|---|---|---|
| admin@dishaspora.com | Admin123! | ADMIN | GH | Full admin console access |
| ama@demo.com | Demo123! | USER | GH | **Premium** (AI assistant + chat enabled) |
| chinedu@demo.com | Demo123! | USER | NG | Free tier |
| vendor.gh@demo.com | Demo123! | VENDOR | GH | Approved, type BOTH ("Auntie Ama's Kitchen") |
| vendor.ng@demo.com | Demo123! | VENDOR | NG | Approved, type BOTH ("Mama Nkechi's Pot") |
| kitchen.gh@demo.com | Demo123! | VENDOR | GH | Approved, FOOD (continental) |
| kitchen.ng@demo.com | Demo123! | VENDOR | NG | Approved, FOOD (continental) |
| grocer.gh@demo.com | Demo123! | VENDOR | GH | Approved, INGREDIENT (basket matching) |
| grocer.ng@demo.com | Demo123! | VENDOR | NG | Approved, INGREDIENT (basket matching) |
| pending.vendor@demo.com | Demo123! | USER | GH | Owns the PENDING vendor application |

## Environment variables

| Variable | Property | Default | Effect |
|---|---|---|---|
| `PAYSTACK_SECRET_KEY` | `paystack.secret-key` | *(blank)* | Blank = **mock mode**: initialize returns `https://checkout.paystack.com/mock/<reference>` and verify auto-succeeds (orders and subscriptions demo without keys) |
| `PAYSTACK_PUBLIC_KEY` | `paystack.public-key` | *(blank)* | Returned in `PaystackInit.publicKey` |
| `ANTHROPIC_API_KEY` | `anthropic.api-key` | *(blank)* | Blank = rule-based assistant fallback; set to use Claude (`claude-sonnet-5`) grounded in the recipe catalog |
| `JWT_SECRET` | `jwt.secret` | long dev default | HMAC signing key for JWTs |

CORS is wide open (all origins/methods) for development. Max upload size 50MB (`mp4`, `mp3`, `jpg`, `jpeg`, `png`).

## Notes

- All money values are integers in minor units (`amountMinor`) with `currency` GHS/NGN.
- Public GETs: recipes, stories, vendors, listings, subscription plans. Everything else needs `Authorization: Bearer <jwt>`. `/api/admin/**` requires ADMIN. Banned users receive 403 at the JWT filter.
- Premium gating: recipe `videoUrl`/`audioUrl` are nulled for non-premium callers; `/api/assistant/chat` returns 402 for non-premium; plain users need premium to POST chat threads/messages (403 otherwise).
