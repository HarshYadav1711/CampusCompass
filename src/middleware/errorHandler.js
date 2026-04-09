/**
 * Express error-handling middleware (four arguments).
 * Keeps API errors in a single, predictable JSON shape.
 */
module.exports = function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }
  console.error(err);
  res.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
    },
  });
};
