const apiResponse = require("../utils/apiResponse");

module.exports = function notFound(req, res) {
  apiResponse.fail(res, 404, "Resource not found");
};
