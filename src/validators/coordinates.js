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
  parseLatitude,
  parseLongitude,
};
