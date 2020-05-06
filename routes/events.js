const { query } = require("../database/connection")
const events = require("express").Router()
const create_private = require("./events_routes/create_private")
const search_private = require("./events_routes/search_private")
const edit_private = require("./events_routes/edit_private")
const delete_private = require("./events_routes/delete_private")
const create_public = require("./events_routes/create_public")
const read_public = require("./events_routes/read_public")
const search_public = require("./events_routes/search_public")
const edit_public = require("./events_routes/edit_public")
const edit_users_to_public = require("./events_routes/edit_users_to_public")
const delete_public = require("./events_routes/delete_public")
const join_public = require("./events_routes/join_public")

// PRIVATE:

  events.use("/private/create", create_private)

  events.use("/private/search", search_private)

  events.use("/private/edit", edit_private)

  events.use("/private/delete", delete_private)

// PUBLIC:

  events.use("/public/create", create_public)

  events.use("/public/read", read_public)

  events.use("/public/search", search_public)

  events.use("/public/edit", edit_public)

  events.use("/public/edit/start", edit_users_to_public)

  events.use("/public/delete", delete_public)

  events.use("/public/join", join_public)

module.exports = events