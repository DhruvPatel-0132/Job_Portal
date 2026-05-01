const express = require("express");
const router = express.Router();
const { getCompanies } = require("../controllers/company.controller");

router.get("/", getCompanies);

module.exports = router;
