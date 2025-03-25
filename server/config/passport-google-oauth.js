const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const bcrypt = require("bcrypt");
const db = require("./db.js");
require("dotenv").config();

let opts = {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
};

passport.use(
    new googleStrategy(
        opts,
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                const existingUser = await db.oneOrNone(
                    "SELECT * FROM users WHERE user_emailid = $1",
                    [profile.emails[0].value]
                );

                if (existingUser) {
                    return done(null, existingUser);
                }

                // Create new user if doesn't exist
                const query = `
                INSERT INTO users(user_name, user_emailid, password)
                VALUES($1, $2, $3)
                RETURNING user_name, user_emailid, user_id;
            `;

                // Generate a random password since Google OAuth users won't need it
                const randomPassword = await bcrypt.hash(
                    Math.random().toString(36),
                    10
                );
                const result = await db.query(query, [
                    profile.displayName,
                    profile.emails[0].value,
                    randomPassword,
                ]);

                const newUser = result[0];
                return done(null, newUser);
            } catch (err) {
                console.error("Google OAuth Error:", err);
                return done(err);
            }
        }
    )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await db.oneOrNone(
            "SELECT * FROM users WHERE user_id = $1",
            [id]
        );
        done(null, user);
    } catch (err) {
        done(err);
    }
});

module.exports = passport;
