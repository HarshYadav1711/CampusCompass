const { parseLatitude, parseLongitude } = require("./coordinates");

function validateListSchoolsQuery(query) {
  const fieldErrors = {};

  if (query === null || query === undefined || typeof query !== "object") {
    return {
      ok: false,
      fieldErrors: { query: ["Invalid query parameters"] },
    };
  }

  const { latitude, longitude } = query;

  const latResult = parseLatitude(latitude);
  if (!latResult.ok) {
    fieldErrors.latitude = [latResult.message];
  }

  const lonResult = parseLongitude(longitude);
  if (!lonResult.ok) {
    fieldErrors.longitude = [lonResult.message];
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, fieldErrors };
  }

  return {
    ok: true,
    value: {
      latitude: latResult.value,
      longitude: lonResult.value,
    },
  };
}

module.exports = {
  validateListSchoolsQuery,
};
