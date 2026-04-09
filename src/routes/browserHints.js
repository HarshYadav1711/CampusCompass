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
      hint: `Use POST with a JSON body (not a browser GET). Postman works. On Windows PowerShell use Invoke-RestMethod (see README) or scripts/sample-add-school.ps1 — avoid curl -d with JSON in PowerShell.`,
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

  /** Typo helper: assignment route is GET /listSchools (plural). */
  app.get("/listSchool", (req, res) => {
    let search = "";
    try {
      const u = new URL(req.originalUrl, "http://localhost");
      search = u.search;
    } catch {
      search = "";
    }
    res.redirect(308, `/listSchools${search}`);
  });
}

module.exports = { registerBrowserHints };
