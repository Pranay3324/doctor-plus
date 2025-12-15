const express = require("express");
const router = express.Router();
const { getHospitals } = require("../controllers/locationController");

router.post("/hospitals", getHospitals);

module.exports = router;
