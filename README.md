# CampusCompass

Minimal Express API scaffold (plain JavaScript, CommonJS). Structure is split so routes, controllers, services, and validators stay easy to explain and extend.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The server listens on `PORT` from `.env` (default `3000`).

## Layout

- **`src/config`** — Environment and shared config.
- **`src/routes`** — Express routers; mount feature routes here.
- **`src/controllers`** — HTTP layer: parse request, call services, send response.
- **`src/services`** — Business logic and data access (to be added).
- **`src/validators`** — Request validation helpers (to be added).
- **`src/middleware`** — Cross-cutting concerns (centralized errors, 404).
- **`sql`** — SQL scripts and migrations (to be added).

No API routes are defined yet beyond wiring: unmatched paths return `404` JSON; uncaught errors return `500` JSON.

## Scripts

| Script   | Purpose                    |
|----------|----------------------------|
| `npm start` | Run the server          |
| `npm run dev` | Run with file watch |
