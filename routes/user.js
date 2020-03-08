const { query } = require("../database/connection");
const user = require("express").Router();
const read_user = require("./user_routes/read_user")
const edit_user = require("./user_routes/edit_user")

user.use("/", read_user)
user.use("/edit", edit_user)

module.exports = user