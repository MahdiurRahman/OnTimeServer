const express = require("express");
const db = require("./database/connection");

const app = express();

app.listen(3000, () => {
    console.log("Server started");
});
