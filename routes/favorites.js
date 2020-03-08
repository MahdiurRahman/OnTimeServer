const favorites = require("express").Router();
const create_favorite = require("./favorites_routes/create_favorite")


favorites.use("/create", create_favorite)

module.exports = favorites