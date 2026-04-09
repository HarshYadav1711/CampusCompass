/**
 * Runs after all routes; returns a consistent 404 JSON body.
 */
module.exports = function notFound(req, res) {
  res.status(404).json({
    success: false,
    error: {
      message: "Not found",
    },
  });
};
