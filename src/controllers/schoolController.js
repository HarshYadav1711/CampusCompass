const apiResponse = require("../utils/apiResponse");
const { validateAddSchool } = require("../validators/addSchool");
const { validateListSchoolsQuery } = require("../validators/listSchoolsQuery");
const schoolService = require("../services/schoolService");

/** POST /addSchool */
async function addSchool(req, res, next) {
  const result = validateAddSchool(req.body);
  if (!result.ok) {
    return apiResponse.fail(res, 400, "Validation failed", result.fieldErrors);
  }

  try {
    const school = await schoolService.insertSchool(result.value);
    return apiResponse.success(res, 201, { school });
  } catch (err) {
    next(err);
  }
}

/** GET /listSchools */
async function listSchools(req, res, next) {
  const result = validateListSchoolsQuery(req.query);
  if (!result.ok) {
    return apiResponse.fail(res, 400, "Validation failed", result.fieldErrors);
  }

  try {
    const schools = await schoolService.listSchoolsByDistance(
      result.value.latitude,
      result.value.longitude
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
