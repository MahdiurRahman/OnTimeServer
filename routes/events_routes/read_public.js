const { query } = require("../../database/connection")
const read_public = require("express").Router()

read_public.get("/", async (req, res) => {
    
})

module.exports = read_public