/**
 * Single place for JSON response shape: every route and middleware uses this.
 * Success: { success, data }. Failure: { success, error: { message, details? } }.
 */

function success(res, statusCode, data) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

/**
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {Record<string, string[]>} [fieldErrors] — omitted when not validation-related
 */
function fail(res, statusCode, message, fieldErrors) {
  const payload = {
    success: false,
    error: {
      message,
    },
  };
  if (
    fieldErrors !== undefined &&
    fieldErrors !== null &&
    Object.keys(fieldErrors).length > 0
  ) {
    payload.error.details = fieldErrors;
  }
  return res.status(statusCode).json(payload);
}

module.exports = {
  success,
  fail,
};
