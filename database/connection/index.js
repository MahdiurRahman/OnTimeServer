const mysql = require("mysql");
const util = require('util');
require("dotenv").config();

let config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST
};

const db = mysql.createConnection(config);
db.connect(function(err) {
    if (err) {
        console.error("FAILURE: Error connecting to db:\n" + err.stack);
        return;
    }
    console.log("SUCCESS: Connected to db as thread id: " + db.threadId);
});

const query = util.promisify(db.query).bind(db);

module.exports = {
    db,
    query
}