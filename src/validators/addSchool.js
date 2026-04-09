const { parseLatitude, parseLongitude } = require("./coordinates");

function validateAddSchool(body) {
  const fieldErrors = {};

  if (body === null || body === undefined || typeof body !== "object") {
    return {
      ok: false,
      fieldErrors: { body: ["Request body must be a JSON object"] },
    };
  }

  const { name, address, latitude, longitude } = body;

  if (!isNonEmptyTrimmedString(name)) {
    fieldErrors.name = ["name must be a non-empty string"];
  } else if (name.trim().length > 255) {
    fieldErrors.name = ["name must be at most 255 characters"];
  }

  if (!isNonEmptyTrimmedString(address)) {
    fieldErrors.address = ["address must be a non-empty string"];
  } else if (address.trim().length > 512) {
    fieldErrors.address = ["address must be at most 512 characters"];
  }

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
      name: name.trim(),
      address: address.trim(),
      latitude: latResult.value,
      longitude: lonResult.value,
    },
  };
}

function isNonEmptyTrimmedString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

module.exports = {
  validateAddSchool,
};
