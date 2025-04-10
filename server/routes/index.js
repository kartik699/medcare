const express = require("express");

const router = express.Router();

const usersRouter = require("./usersRouter");
router.use("/users", usersRouter);

const doctorsRouter = require("./doctorsRouter");
router.use("/doctors", doctorsRouter);

const appointmentsRouter = require("./appointmentsRouter");
router.use("/appointments", appointmentsRouter);

const adminRouter = require("./adminRouter");
router.use("/admin", adminRouter);

module.exports = router;
