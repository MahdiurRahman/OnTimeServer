const { query } = require("../../database/connection")
const leave_public = require("express").Router()

leave_public.delete("/", async (req, res) => {
    console.log("/api/events/public/join")

    const body = req.body
    // 1. check if is owner; if yes, then can't leave, must delete
    const find_event_query = `SELECT * FROM events_public WHERE id=${body.eventId}`
    let event
    try {
        event = await query(find_event_query)
    } catch (error) {
        res.send({
            error,
            message: "check if is owner; if yes, then can't leave, must delete",
            query: find_event_query
        }).status(400)
    }
    if (event.ownerId === body.userId) {
        res.send({
            message: "Error: owner attempting to leave own event. Should delete instead."
        }).status(404)
        return
    }
    event = event[0]	

    // 2. Delete entry in table 'users_to_public' to leave event
    const leave_event_query = `DELETE FROM users_to_public WHERE userId=${body.userId} AND eventId=${body.eventId}`
    let leave_event_response
    try {
        leave_event_response = await query(leave_event_query)
    } catch (error) {
        res.send({
            error,
            message: "Delete entry in table 'users_to_public' to leave event",
            query: leave_event_query
        }).status(400)
    }
    res.send({
        ...body,
        leave_event_response
    }).status(200)
})

module.exports = leave_public