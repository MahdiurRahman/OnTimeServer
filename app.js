const express = require("express");
const db = require("./database/connection");

// MANUAL ENTRY COMMANDS (comment out)
// require("./database/manual_entry");

const app = express();

app.listen(3000, () => {
    console.log("Server started");
});
