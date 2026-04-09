/**
 * API tests (node:test + supertest).
 * Validation cases run without MySQL. Integration cases need a running DB and sql/schema.sql applied.
 */

const { before, test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { createApp } = require("../src/app");
const { pool } = require("../src/db/pool");

const app = createApp();

let dbAvailable = false;

before(async () => {
  try {
    await pool.query("SELECT 1");
    dbAvailable = true;
  } catch {
    dbAvailable = false;
  }
});

test("GET / returns 200 with service summary", async () => {
  const res = await request(app).get("/");
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.service, "CampusCompass");
  assert.ok(res.body.data.endpoints.addSchool);
  assert.ok(res.body.data.endpoints.listSchools);
});

test("GET /addSchool returns 200 with POST instructions (browser GET)", async () => {
  const res = await request(app).get("/addSchool");
  assert.equal(res.status, 200);
  assert.equal(res.body.success, true);
  assert.ok(res.body.data.hint);
  assert.equal(res.body.data.method, "POST");
});

test("POST /addSchool returns 400 when payload is invalid", async () => {
  const res = await request(app).post("/addSchool").send({
    name: "",
    address: "123 St",
    latitude: 91,
    longitude: 0,
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.equal(res.body.error.message, "Validation failed");
  assert.ok(res.body.error.details);
});

test("GET /listSchools returns 400 when coordinates are invalid", async () => {
  const res = await request(app)
    .get("/listSchools")
    .query({ latitude: "100", longitude: "0" });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
  assert.ok(res.body.error.details.latitude);
});

test("GET /listSchools returns 400 when latitude is missing", async () => {
  const res = await request(app).get("/listSchools").query({ longitude: "0" });
  assert.equal(res.status, 400);
  assert.equal(res.body.success, false);
});

test("POST /addSchool returns 201 and created school when payload is valid", async (t) => {
  if (!dbAvailable) {
    t.skip("MySQL not reachable — set DB_* in .env and apply sql/schema.sql");
    return;
  }
  const tag = `test-${Date.now()}`;
  const payload = {
    name: `Valid School ${tag}`,
    address: "1 Test Rd",
    latitude: 40.7,
    longitude: -74.0,
  };
  const res = await request(app).post("/addSchool").send(payload);
  assert.equal(res.status, 201);
  assert.equal(res.body.success, true);
  assert.equal(res.body.data.school.name, payload.name);
  assert.equal(res.body.data.school.address, payload.address);
  assert.equal(res.body.data.school.latitude, payload.latitude);
  assert.equal(res.body.data.school.longitude, payload.longitude);
  assert.ok(Number.isFinite(res.body.data.school.id));
});

test("GET /listSchools returns schools sorted by proximity (nearest first)", async (t) => {
  if (!dbAvailable) {
    t.skip("MySQL not reachable — set DB_* in .env and apply sql/schema.sql");
    return;
  }
  const tag = Date.now();
  const near = {
    name: `Near ${tag}`,
    address: "Near Ln",
    latitude: 40.0,
    longitude: -74.0,
  };
  const far = {
    name: `Far ${tag}`,
    address: "Far Rd",
    latitude: 42.0,
    longitude: -74.0,
  };
  const r1 = await request(app).post("/addSchool").send(near);
  assert.equal(r1.status, 201, r1.text);
  const r2 = await request(app).post("/addSchool").send(far);
  assert.equal(r2.status, 201, r2.text);

  const list = await request(app)
    .get("/listSchools")
    .query({ latitude: "40.0", longitude: "-74.0" });
  assert.equal(list.status, 200);
  const schools = list.body.data.schools;
  const names = schools.map((s) => s.name);
  const iNear = names.indexOf(near.name);
  const iFar = names.indexOf(far.name);
  assert.ok(iNear !== -1 && iFar !== -1, "inserted schools appear in list");
  assert.ok(
    iNear < iFar,
    "school closer to the query point should appear first"
  );
  assert.ok(
    schools.every(
      (s) =>
        typeof s.distanceKm === "number" &&
        Object.prototype.hasOwnProperty.call(s, "distanceKm")
    )
  );
});
