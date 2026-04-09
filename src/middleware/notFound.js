const apiResponse = require("../utils/apiResponse");

/** Last route handler: anything not matched above. */
module.exports = function notFound(req, res) {
  apiResponse.fail(res, 404, "Not found");
};
