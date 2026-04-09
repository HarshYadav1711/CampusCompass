const { pool } = require("../db/pool");
const { haversineDistanceKm } = require("../utils/haversine");

/**
 * Inserts a school row. Controllers should call this instead of touching SQL directly.
 * @param {{ name: string, address: string, latitude: number, longitude: number }} input
 * @returns {Promise<{ id: number, name: string, address: string, latitude: number, longitude: number }>}
 */
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

/**
 * Loads all schools, attaches Haversine distance from the user point, sorts nearest first.
 * @param {number} userLatitude
 * @param {number} userLongitude
 * @returns {Promise<Array<{ id: number, name: string, address: string, latitude: number, longitude: number, distanceKm: number }>>}
 */
async function listSchoolsByDistance(userLatitude, userLongitude) {
  const sql = `
    SELECT id, name, address, latitude, longitude
    FROM schools
  `;
  const [rows] = await pool.execute(sql);

  const withDistance = rows.map((row) => {
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

  withDistance.sort((a, b) => a.distanceKm - b.distanceKm);
  return withDistance;
}

module.exports = {
  insertSchool,
  listSchoolsByDistance,
};
