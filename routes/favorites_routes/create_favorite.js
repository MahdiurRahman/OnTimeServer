const { query } = require("../../database/connection");
const create_favorite = require("express").Router();

create_favorite.post("/", async (req, res) => {
    console.log("/api/favorites/create")
    const body = req.body
    
    // !NOTE: A good check to add would be to check for duplicate favorites by lat and lng.

    let favorite
    try {
        favorite = await query(`INSERT INTO favorites (
            userId,
            name,
            lat,
            lng)
        VALUES (
            ${body.userId},
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