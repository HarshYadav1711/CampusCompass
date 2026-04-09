const apiResponse = require("../utils/apiResponse");
const { validateAddSchool } = require("../validators/addSchool");
const { validateListSchoolsQuery } = require("../validators/listSchoolsQuery");
const schoolService = require("../services/schoolService");

/**
 * POST /addSchool — create a school row after strict validation.
 */
async function addSchool(req, res, next) {
  const parsed = validateAddSchool(req.body);
  if (!parsed.ok) {
    return apiResponse.fail(res, 400, "Validation failed", parsed.fieldErrors);
  }

  try {
    const school = await schoolService.insertSchool(parsed.value);
    return apiResponse.success(res, 201, { school });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /listSchools — all schools sorted by Haversine distance from ?latitude=&longitude=
 */
async function listSchools(req, res, next) {
  const parsed = validateListSchoolsQuery(req.query);
  if (!parsed.ok) {
    return apiResponse.fail(res, 400, "Validation failed", parsed.fieldErrors);
  }

  try {
    const schools = await schoolService.listSchoolsByDistance(
      parsed.value.latitude,
      parsed.value.longitude
    );
    return apiResponse.success(res, 200, { schools });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addSchool,
  listSchools,
};
