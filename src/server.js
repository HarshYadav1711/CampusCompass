const { createApp } = require("./app");
const config = require("./config");

const app = createApp();

app.listen(config.port, () => {
  console.log(`CampusCompass → http://localhost:${config.port} (see README for API usage)`);
});
