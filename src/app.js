const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { registerBrowserHints } = require("./routes/browserHints");
const notFound = require("./middleware/notFound");
const errorHandler = require("./middleware/errorHandler");

function createApp() {
  const app = express();
  app.disable("x-powered-by");
  app.use(cors());
  app.use(express.json({ limit: "64kb" }));
  registerBrowserHints(app);
  app.use(routes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };
