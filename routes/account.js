const account = require("express").Router();
const password = require("./account_routes/password")

account.use("/edit/password", password)

module.exports = account