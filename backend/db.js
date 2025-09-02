const mysql = require("mysql2/promise");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "anilkattamuri1609",
  database: "votepavan_db"
});

module.exports = db;