const express = require("express");
const mysql = require("mysql");
require("dotenv").config();

let app = express();

let config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST
};

const db = mysql.createConnection(config);
db.connect(function(err) {
    if (err) {
        console.error("FAILURE: Error connecting to db: " + err.stack);
        return;
    }
    console.log("SUCCESS: Connected to db as thread id: " + db.threadId);
/*      const result = db.query("DESC test", (er, res, fields) => {
        console.log(res);
    });  */
});
module.exports = db;

app.listen(3000, () => {
    console.log("Server started");
});
