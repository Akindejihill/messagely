/** Common config for message.ly */

// read .env files and make environmental variables
fs = require('fs');
require("dotenv").config();

let db_password = fs.readFileSync("/var/www/cerebro/CodingBootcamp/Excercises/Node/express-messagely/db_password.txt", "utf8").trim();

// const DB_URI = (process.env.NODE_ENV === "test")
//   ? "postgresql:///messagely_test"
//   : "postgresql:///messagely";

const DB_URI = process.env.NODE_ENV === "test" ? `postgresql://akindeji:${db_password}@localhost:5432/lunchly_test` : `postgresql://akindeji:${db_password}@localhost:5432/lunchly`;

const SECRET_KEY = process.env.SECRET_KEY || "secret";

const BCRYPT_WORK_FACTOR = 12;


module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR,
};