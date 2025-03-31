const express = require("express");
const doctorsController = require("../controllers/doctorsController");

const router = express.Router();

router.post("/", doctorsController.getDoctorsPaginated);

router.post("/filter", doctorsController.filterDoctors);

router.get("/search", doctorsController.searchDoctors);

router.get("/doctor/:id", doctorsController.getDoctorById);

module.exports = router;
