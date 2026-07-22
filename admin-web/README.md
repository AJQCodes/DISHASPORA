# Dishaspora Admin Web

Admin dashboard for the Dishaspora platform (Vite + React 18 + TypeScript + react-router v6 + TanStack Query v5, plain CSS).

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build (tsc + vite)
npm run preview    # serve the production build
```

The backend must be running (default `http://localhost:8080`).

## Sign in

Default seeded admin account (see `docs/API.md`, seed section):

- Email: `admin@dishaspora.com`
- Password: `Admin123!`

Only accounts with the `ADMIN` role may enter — other roles get an "admins only" message.

## API base URL

Configured in `src/config.ts` (defaults to `http://localhost:8080`). You can override it without editing code via an env variable:

```bash
# .env.local
VITE_API_BASE_URL=http://my-backend:8080
```

Relative image paths returned by the API (`/images/...`, `/uploads/...`) are automatically prefixed with this base URL.

## Pages

- **Dashboard** — analytics stat tiles, revenue per currency (GH₵ / ₦), orders-per-day bar chart, country split, recent orders.
- **Vendor / Recipe / Listing approvals** — pending queues with expandable full-detail review, orange Approve pill, Reject with required feedback; inline warnings when an unresolved flag targets the item.
- **Flags** — unresolved/resolved toggle, color-coded flag types, one-click resolve.
- **Users** — search, role/premium badges, ban/unban with confirmation.
- **Orders** — recent orders from the analytics endpoint.
