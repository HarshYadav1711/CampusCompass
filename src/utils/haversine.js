/**
 * Haversine formula: great-circle distance between two points on a sphere.
 * Input angles are degrees (WGS84-style latitude/longitude). Result is kilometers.
 *
 * @see https://en.wikipedia.org/wiki/Haversine_formula
 */

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * @param {number} userLatitude - observer latitude in degrees
 * @param {number} userLongitude - observer longitude in degrees
 * @param {number} schoolLatitude - school latitude in degrees
 * @param {number} schoolLongitude - school longitude in degrees
 * @returns {number} distance in kilometers
 */
function haversineDistanceKm(
  userLatitude,
  userLongitude,
  schoolLatitude,
  schoolLongitude
) {
  const deltaLatitudeRad = toRadians(schoolLatitude - userLatitude);
  const deltaLongitudeRad = toRadians(schoolLongitude - userLongitude);
  const userLatRad = toRadians(userLatitude);
  const schoolLatRad = toRadians(schoolLatitude);

  const haversineA =
    Math.sin(deltaLatitudeRad / 2) ** 2 +
    Math.cos(userLatRad) *
      Math.cos(schoolLatRad) *
      Math.sin(deltaLongitudeRad / 2) ** 2;

  const centralAngle = 2 * Math.atan2(Math.sqrt(haversineA), Math.sqrt(1 - haversineA));

  return EARTH_RADIUS_KM * centralAngle;
}

module.exports = {
  haversineDistanceKm,
};
