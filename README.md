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
- **`src/services`** — Business logic and data access (e.g. `insertSchool`).
- **`src/validators`** — Request validation (e.g. add-school).
- **`src/middleware`** — Cross-cutting concerns (centralized errors, 404).
- **`sql`** — SQL schema (`schema.sql`).

Unmatched paths return `404` JSON; uncaught errors return `500` JSON.

### POST `/addSchool` — examples (Postman: JSON body, `Content-Type: application/json`)

**Request**

```http
POST /addSchool HTTP/1.1
Content-Type: application/json

{
  "name": "Riverside Academy",
  "address": "100 Campus Way, Springfield",
  "latitude": 40.7128,
  "longitude": -74.006
}
```

**201 — success**

```json
{
  "success": true,
  "data": {
    "school": {
      "id": 1,
      "name": "Riverside Academy",
      "address": "100 Campus Way, Springfield",
      "latitude": 40.7128,
      "longitude": -74.006
    }
  }
}
```

**400 — validation error**

```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "details": {
      "latitude": ["latitude must be between -90 and 90 inclusive"]
    }
  }
}
```

## Scripts

| Script   | Purpose                    |
|----------|----------------------------|
| `npm start` | Run the server          |
| `npm run dev` | Run with file watch |
