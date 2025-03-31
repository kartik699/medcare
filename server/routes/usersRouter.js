const express = require("express");
const passport_local = require("../config/passport-local-strategy.js");
const passport_google = require("../config/passport-google-oauth.js");
const bcrypt = require("bcrypt");
const usersController = require("../controllers/usersController");

const db = require("../config/db.js");

const router = express.Router();

router.get("/", usersController.getUsers);

router.get("/me", usersController.getCurrentUser);

router.post("/register", usersController.registerUser);

router.post("/login", usersController.loginUser);

router.post("/logout", usersController.logoutUser);

// Route to initiate Google OAuth flow
router.get(
    "/google",
    passport_google.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// Google OAuth callback route
router.get(
    "/google/callback",
    passport_google.authenticate("google", {
        failureRedirect: "http://localhost:3000/login",
    }),
    usersController.googleCallback
);

module.exports = router;
