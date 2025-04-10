const express = require("express");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.get("/", adminController.getAllDoctors);
router.get("/appointments", adminController.getAppointments);
router.post("/appointment/status", adminController.updateAppointmentStatus);
router.post("/doctor", adminController.createDoctor);

module.exports = router;
