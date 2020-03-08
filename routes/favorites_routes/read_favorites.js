const { query } = require("../../database/connection");
const read_favorites = require("express").Router();

read_favorites.get("/", async (req, res) => {
    const body = req.body

    let favorites
    try {
        favorites = await query(`SELECT * FROM favorites WHERE userId=${body.id}`)
    } catch (error) {
        res.send(error)
    }

    res.send({
        ...body,
        favorites
    })
})

module.exports = read_favorites