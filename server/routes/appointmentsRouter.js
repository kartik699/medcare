const express = require("express");
const passport = require("passport");
const appointmentsController = require("../controllers/appointmentsController");

const router = express.Router();

// Get available slots for a doctor on a specific date
router.get(
    "/available-slots/:doctorId/:date",
    passport.checkAuthentication,
    appointmentsController.getAvailableSlots
);

// Book an appointment
router.post(
    "/book",
    passport.checkAuthentication,
    appointmentsController.bookAppointment
);

// Get user's appointments
router.get(
    "/my-appointments",
    passport.checkAuthentication,
    appointmentsController.getUserAppointments
);

module.exports = router;
