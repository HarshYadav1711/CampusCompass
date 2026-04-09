/**
 * Validates payload for adding a school (POST body).
 * @param {unknown} body
 * @returns {{ ok: true, value: { name: string, address: string, latitude: number, longitude: number } } | { ok: false, fieldErrors: Record<string, string[]> }}
 */
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

function parseLatitude(value) {
  if (value === undefined || value === null) {
    return { ok: false, message: "latitude is required" };
  }
  if (typeof value === "string" && value.trim() === "") {
    return { ok: false, message: "latitude is required" };
  }
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    return { ok: false, message: "latitude must be a valid number" };
  }
  if (n < -90 || n > 90) {
    return {
      ok: false,
      message: "latitude must be between -90 and 90 inclusive",
    };
  }
  return { ok: true, value: n };
}

function parseLongitude(value) {
  if (value === undefined || value === null) {
    return { ok: false, message: "longitude is required" };
  }
  if (typeof value === "string" && value.trim() === "") {
    return { ok: false, message: "longitude is required" };
  }
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) {
    return { ok: false, message: "longitude must be a valid number" };
  }
  if (n < -180 || n > 180) {
    return {
      ok: false,
      message: "longitude must be between -180 and 180 inclusive",
    };
  }
  return { ok: true, value: n };
}

module.exports = {
  validateAddSchool,
};
