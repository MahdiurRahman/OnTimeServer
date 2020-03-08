const favorites = require("express").Router();
const read_favorites = require("./favorites_routes/read_favorites")
const create_favorite = require("./favorites_routes/create_favorite")
const edit_favorite = require("./favorites_routes/edit_favorite")
const delete_favorite = require("./favorites_routes/delete_favorite")

favorites.use("/", read_favorites)
favorites.use("/create", create_favorite)
favorites.use("/edit", edit_favorite)
favorites.use("/delete", delete_favorite)

module.exports = favorites