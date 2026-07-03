# Dishaspora

> KNUST · Computer Science · CodeQuest 2026 · Group 12

A culturally rich food ecosystem for Ghana and Nigeria: recipe discovery with calorie
and meal-frequency guidance, a same-country food & ingredient marketplace with Paystack
checkout, premium video/audio/chat and a grounded AI recipe assistant — plus an admin
console for approvals, moderation and analytics.

## Monorepo layout

| Folder | What it is | Stack |
|---|---|---|
| `backend/` | REST API, modular monolith (auth, recipe, marketplace, order, subscription, admin, ai, chat, media) | Java 17 · Spring Boot 3.3 · PostgreSQL/H2 · JWT · Paystack · Claude API |
| `mobile/` | The Dishaspora app (iOS/Android) | React Native · Expo · TypeScript · expo-router · Reanimated |
| `admin-web/` | Admin console (approvals, flags, users, analytics) | Vite · React · TypeScript |
| `docs/` | `API.md` (REST contract), `DESIGN.md` (design system), `IMAGES.md` (image manifest) | — |
| `scripts/` | Image generation/download utilities | Node |

## Quick start

**Backend** (zero setup, embedded DB):
```bash
cd backend
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```
or with PostgreSQL (database `dishaspora` on localhost): `mvn spring-boot:run`

**Admin console:**
```bash
cd admin-web && npm install && npm run dev   # http://localhost:5173
```

**Mobile app:**
```bash
cd mobile && npm install && npx expo start
```
Scan the QR with Expo Go. Demo mode is ON by default (`mobile/src/config.ts`) so the
app is fully browsable without the backend; set `DEMO_MODE = false` and point
`API_URL` at your PC's LAN IP to use the live API.

## Seed accounts (created on first backend start)

| Account | Email | Password |
|---|---|---|
| Admin | admin@dishaspora.com | Admin123! |
| User (GH, premium) | ama@demo.com | Demo123! |
| User (NG) | chinedu@demo.com | Demo123! |
| Vendor (GH) | vendor.gh@demo.com | Demo123! |
| Vendor (NG) | vendor.ng@demo.com | Demo123! |

## Environment variables (all optional — mock/fallback modes cover local dev)

| Var | Purpose |
|---|---|
| `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` | Real Paystack test-mode payments (blank = simulated checkout) |
| `ANTHROPIC_API_KEY` | Claude-powered AI assistant (blank = rule-based fallback) |
