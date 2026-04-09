const apiResponse = require("../utils/apiResponse");

/**
 * Express error middleware (four arguments). Never leaks stack traces to clients.
 */
module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }
  if (process.env.NODE_ENV !== "test") {
    console.error(err);
  }
  apiResponse.fail(res, 500, "Internal server error");
};
