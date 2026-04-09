const { createApp } = require("./app");
const config = require("./config");

const app = createApp();

app.listen(config.port, () => {
  const port = config.port;
  console.log(`CampusCompass listening on http://localhost:${port}`);
  console.log(`Open GET / and GET /addSchool in a browser; use POST /addSchool from Postman or curl.`);
});
