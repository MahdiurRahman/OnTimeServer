const { query } = require("../../database/connection")
const leave_public = require("express").Router()

leave_public.delete("/", async (req, res) => {
    console.log("/api/events/public/join")

    const body = req.body
    // Leave event in DB
    const leave_event_query = `DELETE FROM users_to_public WHERE userId=${body.userId} AND eventId=${body.eventId}`
    let leave_event_response
    try {
        leave_event_response = await query(leave_event_query)
    } catch (error) {
        res.send({
            error,
            message: "Leave event in DB",
            query: leave_event_query
        }).status(400)
    }
    res.send({
        ...body,
        leave_event_response
    }).status(200)
})

module.exports = leave_public