const { pool } = require("../db/pool");
const { haversineDistanceKm } = require("../utils/haversine");

/** Parameterized INSERT into `schools`. */
async function insertSchool(input) {
  const { name, address, latitude, longitude } = input;
  const sql = `
    INSERT INTO schools (name, address, latitude, longitude)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.execute(sql, [
    name,
    address,
    latitude,
    longitude,
  ]);
  return {
    id: result.insertId,
    name,
    address,
    latitude,
    longitude,
  };
}

/** SELECT all rows, compute distance (km), sort nearest first. */
async function listSchoolsByDistance(userLatitude, userLongitude) {
  const sql = `
    SELECT id, name, address, latitude, longitude
    FROM schools
  `;
  const [rows] = await pool.execute(sql);

  const schoolsWithDistance = rows.map((row) => {
    const schoolLatitude = Number(row.latitude);
    const schoolLongitude = Number(row.longitude);
    const distanceKmRaw = haversineDistanceKm(
      userLatitude,
      userLongitude,
      schoolLatitude,
      schoolLongitude
    );
    return {
      id: row.id,
      name: row.name,
      address: row.address,
      latitude: schoolLatitude,
      longitude: schoolLongitude,
      distanceKm: Math.round(distanceKmRaw * 1000) / 1000,
    };
  });

  schoolsWithDistance.sort((a, b) => a.distanceKm - b.distanceKm);
  return schoolsWithDistance;
}

module.exports = {
  insertSchool,
  listSchoolsByDistance,
};
