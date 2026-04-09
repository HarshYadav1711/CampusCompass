/** Success: `{ success, data }`. Failure: `{ success, error: { message, details? } }`. */

function success(res, statusCode, data) {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

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
