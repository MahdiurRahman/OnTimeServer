const users = require("express").Router();
const read_user = require("./user_routes/read_user")
const edit_user = require("./user_routes/edit_user")

users.use("/read", read_user)
users.use("/edit", edit_user)

module.exports = users