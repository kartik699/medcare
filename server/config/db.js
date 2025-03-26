const pgp = require("pg-promise")();
require("dotenv").config();

const config = {
    host: "localhost",
    port: 5432,
    database: "medcare_db",
    user: "postgres",
    password: process.env.POSTGRESQL_PASSWORD,
};

const db = pgp(config);

module.exports = db;
