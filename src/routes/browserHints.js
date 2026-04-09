/**
 * GET handlers for browsers (address bar sends GET only).
 * Registered on the main app before other routers so they always match.
 */
const apiResponse = require("../utils/apiResponse");

function registerBrowserHints(app) {
  app.get("/", (req, res) => {
    return apiResponse.success(res, 200, {
      service: "CampusCompass",
      endpoints: {
        addSchool:
          "POST /addSchool — body: name, address, latitude, longitude (JSON). GET /addSchool only shows help.",
        listSchools: "GET /listSchools — query: latitude, longitude",
      },
    });
  });

  app.get("/addSchool", (req, res) => {
    const host = req.get("host") || "localhost:3000";
    return apiResponse.success(res, 200, {
      hint: `Use POST with a JSON body (not a browser GET). Try Postman, or curl -X POST -H \"Content-Type: application/json\" -d \"{...}\" http://${host}/addSchool`,
      method: "POST",
      contentType: "application/json",
      body: {
        name: "string (required)",
        address: "string (required)",
        latitude: "number, -90 to 90",
        longitude: "number, -180 to 180",
      },
    });
  });
}

module.exports = { registerBrowserHints };
