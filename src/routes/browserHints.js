const apiResponse = require("../utils/apiResponse");

function registerBrowserHints(app) {
  app.get("/", (req, res) => {
    return apiResponse.success(res, 200, {
      service: "CampusCompass",
      endpoints: {
        addSchool:
          "POST /addSchool — body: name, address, latitude, longitude (JSON). GET /addSchool only shows help.",
        listSchools:
          "GET /listSchools — query: latitude, longitude (note the s; /listSchool redirects here)",
      },
    });
  });

  app.get("/addSchool", (req, res) => {
    return apiResponse.success(res, 200, {
      hint: `Browsers open URLs with GET only. To create a school, send POST with JSON (Postman, or PowerShell Invoke-RestMethod / scripts/sample-add-school.ps1 — see README).`,
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
