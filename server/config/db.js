const pgp = require("pg-promise")();

const config = {
    host: "localhost",
    port: 5432,
    database: "medcare_db",
    user: "postgres",
    password: "Kartik7294",
};

const db = pgp(config);

module.exports = db;
