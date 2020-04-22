const { query } = require("../../database/connection");
const delete_favorite = require("express").Router();

delete_favorite.delete("/", async (req, res) => {
    console.log("api/favorites/delete")
    const body = req.body

    let delete_request
    try {
        delete_request = await query(`DELETE FROM favorites WHERE id=${body.favoriteId}`)
    } catch (error) {
        res.send(error)
    }

    res.send({
        ...body,
        delete_request
    }).status(200)
})

module.exports = delete_favorite