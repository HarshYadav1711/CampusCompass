const express = require("express");
const schoolController = require("../controllers/schoolController");

const router = express.Router();

router.post("/addSchool", schoolController.addSchool);

module.exports = router;
