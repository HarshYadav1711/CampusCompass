/** Great-circle distance (km); degrees in, kilometers out. See https://en.wikipedia.org/wiki/Haversine_formula */

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

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
