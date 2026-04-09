# CampusCompass

A small REST API for storing schools in MySQL and listing them by distance from a reference point. It was built as a focused backend exercise: two endpoints, strict validation, parameterized SQL, and Haversine distance calculated in application code.

## Tech stack

| Layer | Choice |
|--------|--------|
| Runtime | Node.js 22+ (LTS line) |
| HTTP | Express |
| Database | MySQL (via `mysql2` connection pool) |
| Config | `dotenv` |
| Validation | Plain JavaScript validators (no ORM) |
| Tests | Node’s built-in test runner + Supertest |

## Project layout

```
CampusCompass/
├── sql/
│   └── schema.sql          # CREATE TABLE schools
├── postman/
│   └── CampusCompass.postman_collection.json
├── src/
│   ├── app.js              # Express app factory
│   ├── server.js           # Entry: listen on PORT
│   ├── config/             # Env-driven settings
│   ├── controllers/        # HTTP: validate → service → response
│   ├── db/                 # MySQL pool (single place for connections)
│   ├── middleware/         # 404 + global error handler
│   ├── routes/             # Route wiring
│   ├── services/           # DB + distance sorting
│   ├── utils/              # Haversine helper, response helpers
│   └── validators/         # Request/query validation
└── tests/
    └── api.test.js         # API tests
```

## Database setup

1. Create a database (any name you prefer; `campuscompass` matches `.env.example`).

   ```bash
   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS campuscompass;"
   ```

2. Apply the schema (creates the `schools` table only):

   ```bash
   mysql -u root -p campuscompass < sql/schema.sql
   ```

Table columns: `id` (auto-increment), `name`, `address`, `latitude`, `longitude`.

## Environment variables

Copy `.env.example` to `.env` and adjust:

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default `3000` if unset) |
| `NODE_ENV` | `development`/`production` (tests set `NODE_ENV=test` via `npm test`) |
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port (default `3306`) |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password (empty string is allowed) |
| `DB_NAME` | Database name containing `schools` |

For local runs, `DB_HOST`, `DB_USER`, and `DB_NAME` are required in `.env` (unless you rely on test defaults only when running `npm test`).

## Run locally

```bash
npm install
cp .env.example .env
# Edit .env with your MySQL credentials and apply sql/schema.sql
npm start
```

Development with watch:

```bash
npm run dev
```

**Tests**

```bash
npm test
```

Tests that require MySQL will **skip** if the database is unreachable; validation tests still run. To run the full suite, start MySQL and ensure `.env` points at a database where `sql/schema.sql` has been applied.

## API

Base URL: `http://localhost:PORT` (default port `3000`).

All JSON responses use `{ "success": true, "data": ... }` or `{ "success": false, "error": { "message", "details"? } }` unless noted.

### `POST /addSchool`

Creates one school.

**Body (JSON)**

| Field | Type | Rules |
|--------|------|--------|
| `name` | string | Non-empty after trim; max 255 characters |
| `address` | string | Non-empty after trim; max 512 characters |
| `latitude` | number | Finite; −90 … 90 |
| `longitude` | number | Finite; −180 … 180 |

**Responses**

- **201** — `{ "success": true, "data": { "school": { "id", "name", "address", "latitude", "longitude" } } }`
- **400** — Validation failed; `error.details` maps field names to message arrays
- **500** — Generic server error (no stack trace in response)

### `GET /listSchools`

Returns all schools with **distance in kilometers** from the given point, **nearest first**. Distance is computed with the Haversine formula in code (not in MySQL).

**Query**

| Parameter | Required | Rules |
|-----------|----------|--------|
| `latitude` | yes | Finite; −90 … 90 |
| `longitude` | yes | Finite; −180 … 180 |

**Responses**

- **200** — `{ "success": true, "data": { "schools": [ { "id", "name", "address", "latitude", "longitude", "distanceKm" }, ... ] } }` (sorted by `distanceKm` ascending; empty table yields `schools: []`)
- **400** — Missing or invalid query parameters
- **500** — Generic server error

## Example requests and responses

### Add school — success

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

### Add school — validation error

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

### List schools — success (illustrative order)

```http
GET /listSchools?latitude=40.7128&longitude=-74.006 HTTP/1.1
```

```json
{
  "success": true,
  "data": {
    "schools": [
      {
        "id": 2,
        "name": "Downtown High",
        "address": "5 Main St",
        "latitude": 40.713,
        "longitude": -74.0062,
        "distanceKm": 0.023
      },
      {
        "id": 1,
        "name": "Riverside Academy",
        "address": "100 Campus Way",
        "latitude": 40.7128,
        "longitude": -74.006,
        "distanceKm": 0.031
      }
    ]
  }
}
```

`distanceKm` is rounded to three decimal places.

## Postman

Import `postman/CampusCompass.postman_collection.json`. Set the collection variable `baseUrl` if your server is not on `http://localhost:3000`. Saved **example responses** (201/400/200) are included on each request for quick comparison.

## Deployment notes

The app is a standard Node HTTP server: any host that runs Node.js and can reach MySQL will work (Render, Railway, Fly.io, a VPS, etc.). Typical steps:

1. Provision MySQL and run `sql/schema.sql` against your database.
2. Set environment variables on the host (`PORT` is often provided by the platform; map it to `PORT` in config if your provider uses a different name).
3. Start with `npm start` (or `node src/server.js`).

Use TLS and a reverse proxy in production; this repo does not configure HTTPS or process managers—that stays with your hosting choice. Do not commit `.env`; keep secrets in the platform’s secret store.
