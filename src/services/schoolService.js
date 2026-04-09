const { pool } = require("../db/pool");

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

module.exports = {
  insertSchool,
};
