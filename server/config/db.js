const pgp = require("pg-promise")();
const db = pgp("postgres://postgres:Kartik7294@localhost:5432/medcare_db");

module.exports = db;
