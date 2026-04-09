const express = require("express");
const schoolRoutes = require("./schoolRoutes");

const router = express.Router();

router.use(schoolRoutes);

module.exports = router;
