# Dishaspora

> KNUST · Computer Science · CodeQuest 2026 · Group 12

A culturally rich food ecosystem for Ghana and Nigeria: recipe discovery with calorie
and meal-frequency guidance, a same-country food & ingredient marketplace with Paystack
checkout, premium video/audio/chat and a grounded AI recipe assistant — plus an admin
console for approvals, moderation and analytics.

---

## Monorepo layout

| Folder | What it is | Stack |
|---|---|---|
| `backend/` | REST API, modular monolith (auth, recipe, marketplace, order, subscription, admin, ai, chat, media) | Java 17 · Spring Boot 3.3 · PostgreSQL/H2 · JWT · Paystack · Claude API |
| `mobile/` | The Dishaspora app (iOS/Android) | React Native · Expo SDK 54 · TypeScript · expo-router · Reanimated 4 |
| `admin-web/` | Admin console (approvals, flags, users, analytics) | Vite · React 18 · TypeScript |
| `docs/` | `API.md` (REST contract), `DESIGN.md` (design system), `IMAGES.md` (image manifest) | — |
| `scripts/` | Image generation/download utilities | Node |

---

## 1. Prerequisites

Install these once:

| Tool | Version | Where |
|---|---|---|
| **JDK** | 17 or newer | https://adoptium.net |
| **Maven** | 3.9+ | https://maven.apache.org/download.cgi (or use an IDE with bundled Maven) |
| **Node.js** | 18+ (LTS recommended) | https://nodejs.org |
| **PostgreSQL** | 14+ — *optional*, only for the Postgres profile | https://www.postgresql.org/download |
| **Expo Go** | SDK 54 build | App Store / Play Store on your phone |
| **Git** | any recent | https://git-scm.com |

Clone the repo:

```bash
git clone https://github.com/AJQCodes/DISHASPORA.git
cd DISHASPORA
```

---

## 2. Backend setup (`backend/`)

### Option A — zero-setup (embedded H2 database, recommended for demo)

```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

That's it. The database is a local file (`backend/data/`), created automatically.

### Option B — PostgreSQL

1. Create the database (once):

   ```bash
   psql -U postgres -c "CREATE DATABASE dishaspora;"
   ```

2. If your Postgres credentials differ from `postgres`/`postgres`, edit
   `backend/src/main/resources/application.yml` (`spring.datasource.username/password`).

3. Run:

   ```bash
   cd backend
   mvn spring-boot:run
   ```

### What happens on first start

- Tables are created automatically (`ddl-auto: update`).
- The **seeder runs when the DB is empty**: ~38 recipes (Ghanaian, Nigerian,
  continental, drinks) with full ingredients/steps/calorie data/cultural stories,
  40+ marketplace listings, vendors, demo orders, a chat thread, and pending
  items + flags so the admin queues are populated.
- API is served at **http://localhost:8080/api**, images at `/images/*`,
  uploads at `/uploads/*`.

### Seed accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@dishaspora.com` | `Admin123!` |
| User (Ghana, premium) | `ama@demo.com` | `Demo123!` |
| User (Nigeria) | `chinedu@demo.com` | `Demo123!` |
| Vendor (Ghana, approved) | `vendor.gh@demo.com` | `Demo123!` |
| Vendor (Nigeria, approved) | `vendor.ng@demo.com` | `Demo123!` |

### Environment variables (all optional)

The app runs fully without any of these — payments fall back to a simulated
checkout and the AI assistant falls back to rule-based answers.

| Variable | Purpose |
|---|---|
| `PAYSTACK_SECRET_KEY` | Paystack **test** secret key (`sk_test_...`) — enables real test-mode checkout for orders & subscriptions |
| `PAYSTACK_PUBLIC_KEY` | Paystack test public key (`pk_test_...`) |
| `ANTHROPIC_API_KEY` | Enables the Claude-powered "Ask Dishaspora" assistant (grounded only in platform recipes) |

Set them before starting, e.g. PowerShell:

```powershell
$env:PAYSTACK_SECRET_KEY="sk_test_xxx"
$env:ANTHROPIC_API_KEY="sk-ant-xxx"
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

---

## 3. Admin console setup (`admin-web/`)

```bash
cd admin-web
npm install
npm run dev
```

Open **http://localhost:5173** and sign in with the admin account above.
The backend must be running on port 8080 (or set `VITE_API_BASE_URL` in a
`.env` file to point elsewhere).

Production build: `npm run build` → static files in `admin-web/dist/`.

---

## 4. Mobile app setup (`mobile/`)

```bash
cd mobile
npm install
npx expo start -c
```

Scan the QR code with **Expo Go** (Android) or the Camera app (iOS).

### Demo mode vs live backend

The app ships with **demo mode ON** (`mobile/src/config.ts` → `DEMO_MODE = true`):
every screen works fully offline with rich local data and real photography —
perfect for UI inspection with zero backend.

To use the **live backend**:

1. Find your PC's LAN IP: `ipconfig` → IPv4 Address (e.g. `192.168.1.23`).
   Phone and PC must be on the same Wi-Fi.
2. Edit `mobile/src/config.ts`:

   ```ts
   export const API_URL = 'http://192.168.1.23:8080'; // your PC's LAN IP
   export const DEMO_MODE = false;
   ```

   (Android **emulator** instead of a phone? Use `http://10.0.2.2:8080`.)
3. Reload the app. If the backend becomes unreachable the app auto-falls back
   to demo data, so it never shows a blank screen.

---

## 5. Recommended startup order (full live demo)

1. **Backend** — `cd backend && mvn spring-boot:run -Dspring-boot.run.profiles=h2`
2. **Admin console** — `cd admin-web && npm run dev` → log in as admin
3. **Mobile** — set LAN IP + `DEMO_MODE = false`, `npx expo start -c`, scan QR
4. Log in on the phone as `ama@demo.com` (premium: AI assistant, videos and
   vendor chat all unlocked) or register a fresh account.

---

## 6. Troubleshooting

| Symptom | Fix |
|---|---|
| `Port 8080 was already in use` | Another backend instance is running — stop it (or `taskkill /IM java.exe /F` on Windows) and restart |
| Admin login: `ERR_CONNECTION_REFUSED` | Backend isn't running — start it (section 2) |
| Expo: `Cannot find module 'babel-preset-expo'` or stale bundling errors | Run `npx expo start -c` (clears Metro cache); make sure `npm install` finished |
| Phone can't reach the API | Wrong LAN IP, different Wi-Fi network, or Windows Firewall blocking Java — allow it or temporarily disable the firewall |
| Images don't load in the app (live mode) | `API_URL` must be the LAN IP (not `localhost`) — the phone resolves `localhost` to itself |
| Want a fresh database | Stop the backend and delete `backend/data/` (H2) or drop/recreate the `dishaspora` DB (Postgres) — the seeder repopulates on next start |

---

## 7. Docs

- **`docs/API.md`** — full REST contract (endpoints, DTOs, auth rules, error shape)
- **`docs/DESIGN.md`** — design system: palette, typography, signature UI patterns
- **`docs/IMAGES.md`** — manifest mapping every bundled image to its source URL
