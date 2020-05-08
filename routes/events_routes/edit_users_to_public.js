const { query } = require("../../database/connection")
const edit_users_to_public = require("express").Router()

edit_users_to_public.put("/", async (req, res) => {
    console.log("/api/events/public/edit/start")

    // Generate Query
    const body = req.body
    let users_to_public_query = `UPDATE users_to_public SET `
    if (body.startLat) {
        users_to_public_query += `startLat=${body.startLat}, `
    }
    if (body.startLng) {
        users_to_public_query += `startLng=${body.startLng}, `
    }
    users_to_public_query = users_to_public_query.slice(0, -2)
    users_to_public_query += ` WHERE userId=${body.userId} AND eventId=${body.eventId}`

    // Run query
    let users_to_public
    try {
        users_to_public = await query(users_to_public_query)
    } catch (error) {
        res.send({
            error,
            message: "Failed on Run query",
            query: users_to_public_query
        }).status(400)
    }

    res.send({
        ...body,
        users_to_public
    })
})

module.exports = edit_users_to_public