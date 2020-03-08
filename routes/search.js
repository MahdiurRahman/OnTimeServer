const search = require("express").Router()
const basic_search = require("./search_routes/basic_search")

search.use("/", basic_search)

module.exports = search