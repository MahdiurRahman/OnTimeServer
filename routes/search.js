const search = require("express").Router()
const event_name_search = require("./search_routes/event_name_search")

search.use("/name", event_name_search)

module.exports = search