const { query } = require("../../database/connection");
const create_favorite = require("express").Router();

create_favorite.post("/", async (req, res) => {
    const body = req.body
    
    let favorite
    try {
        favorite = await query(`INSERT INTO favorites (
            userId,
            name,
            lat,
            lng)
        VALUES (
            ${body.id},
            '${body.name}',
            ${body.lat},
            ${body.lng}
        )`)
    } catch (error) {
        res.send(error)
    }

    res.send({
        ...body,
        favorite
    })
})

module.exports = create_favorite