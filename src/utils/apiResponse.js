/**
 * Consistent JSON bodies for API responses (matches notFound / errorHandler shape).
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
 * @param {Record<string, string[]>} [fieldErrors] — optional per-field messages
 */
function fail(res, statusCode, message, fieldErrors) {
  const body = {
    success: false,
    error: {
      message,
    },
  };
  if (fieldErrors !== undefined && fieldErrors !== null) {
    body.error.details = fieldErrors;
  }
  return res.status(statusCode).json(body);
}

module.exports = {
  success,
  fail,
};
