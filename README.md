# CampusCompass

CampusCompass is a Node.js REST API backed by MySQL. It exposes two endpoints: create a school with coordinates, and list all schools sorted by distance from a chosen point using the Haversine formula. Validation is strict, SQL uses parameterized queries, and responses follow a single JSON shape.

| Resource | Link |
| --- | --- |
| **Live API** | Local default: [`http://localhost:3000`](http://localhost:3000) — replace with your deployed base URL when you host it. |
| **GitHub** | [`https://github.com/YOUR_USERNAME/CampusCompass`](https://github.com/YOUR_USERNAME/CampusCompass) — update to your repository. |
| **Postman** | Import [`postman/CampusCompass.postman_collection.json`](postman/CampusCompass.postman_collection.json) (File → Import in Postman). |

## Reviewer Quick Start

1. **Clone and install** — `npm install` in the project root.
2. **Configure the database** — Copy `.env.example` to `.env`, set `DB_*` values, create a MySQL database, and apply [`sql/schema.sql`](sql/schema.sql) ([Database setup](#database-setup)).
3. **Run the server** — `npm start`, then open [`http://localhost:3000/`](http://localhost:3000/) for a short JSON summary of routes.
4. **Exercise the API** — Import the Postman collection above; call `POST /addSchool` and `GET /listSchools?latitude=…&longitude=…`. On Windows PowerShell, use the **Invoke-RestMethod** example in [Run locally](#run-locally) or run `.\scripts\sample-add-school.ps1`.
5. **Run tests** — `npm test` (core checks run without MySQL; full integration tests need MySQL up and the schema applied).

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
├── scripts/
│   ├── apply-schema.ps1    # Windows: create DB + apply schema (mysql.exe path)
│   └── sample-add-school.ps1  # Windows: POST sample JSON via Invoke-RestMethod
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

**Windows: `mysql` is not recognized**

That only means the **`mysql` command is not on your PATH** — MySQL may still be installed. This repo includes a helper script that calls `mysql.exe` by full path:

```powershell
cd path\to\CampusCompass
powershell -ExecutionPolicy Bypass -File scripts\apply-schema.ps1
```

Enter your MySQL `root` password when prompted (XAMPP often uses a blank password: press Enter).

---

PowerShell cannot find the MySQL **client** if the server tools are not installed or not on your `PATH`. You can also:

1. **Use the full path** (adjust version folder if yours differs):

   ```powershell
   & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "CREATE DATABASE IF NOT EXISTS campuscompass;"
   Get-Content sql/schema.sql | & "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p campuscompass
   ```

   (Bash-style `< sql/schema.sql` is unreliable in PowerShell; piping with `Get-Content` works. Or use `cmd /c "mysql ... < sql/schema.sql"` from the project folder.)

   If `Program Files (x86)` or a different version is installed, browse to `...\MySQL\...\bin\mysql.exe` in Explorer and use that path.

2. **Add MySQL `bin` to PATH** (Settings → Environment Variables → Path → add `...\MySQL Server 8.0\bin`), then open a **new** terminal and run the same `mysql` commands as in steps 1–2 above.

3. **No CLI:** Open **MySQL Workbench** (or another GUI), connect to your server, run `CREATE DATABASE IF NOT EXISTS campuscompass;`, select that schema, then open `sql/schema.sql` and execute its contents.

Table columns: `id` (auto-increment), `name`, `address`, `latitude` (FLOAT), `longitude` (FLOAT).

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

### Windows PowerShell: calling `POST /addSchool`

PowerShell does **not** parse `curl.exe -d "{\"name\":...}"` like bash. Quotes and spaces in the JSON often break the command (`Could not resolve host`, `URL rejected`, etc.).

Use **`Invoke-RestMethod`** and put the JSON in **single quotes** (no backslash escaping):

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/addSchool `
  -ContentType "application/json" `
  -Body '{"name":"Test High","address":"1 Main St","latitude":40.7,"longitude":-74.0}'
```

Or run the helper script (from the project folder):

```powershell
.\scripts\sample-add-school.ps1
```

If the response is **`500` / `Internal server error`**, the request reached the server but the database step failed. Confirm MySQL is running, `.env` matches your server, and `sql/schema.sql` was applied—then check the **terminal where `npm start` is running** for the underlying error.

## API

Base URL: `http://localhost:PORT` (default port `3000`).

All JSON responses use `{ "success": true, "data": ... }` or `{ "success": false, "error": { "message", "details"? } }` unless noted.

### `POST /addSchool`

Creates one school.

**Note:** Opening `/addSchool` in a browser sends **GET**, which cannot send a JSON body. The API expects **POST**. If you hit **GET /addSchool** (e.g. by typing the URL), the server returns **200** with a short JSON hint explaining how to call **POST** (Postman/curl). Use **POST** for real inserts.

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

**Note:** The path is **`/listSchools`** (plural). If you open **`/listSchool`** by mistake, the server responds with **308** redirect to **`/listSchools`**, keeping the same query string when present.

Typing only **`http://localhost:3000/listSchools`** (no `?latitude=...&longitude=...`) returns **400** because both parameters are required. Use a full URL such as **`http://localhost:3000/listSchools?latitude=40.7128&longitude=-74.006`**.

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
