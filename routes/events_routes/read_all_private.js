const { query } = require("../../database/connection")
const read_all_private = require("express").Router()

read_all_private.get("/", async (req, res) => {
    console.log("api/events/private/read/all")

    // 1. Retrieve all events based on id
    const body = req.body
    let events_private
    let events_private_query = `SELECT * FROM events_private WHERE ownerId=${body.ownerId}`
    try {
        events_private = await query(events_private_query)
    } catch (error) {
        res.send({
            error,
            message: `Failed on: Retrieve all events`,
            query: events_private_query
        })
    }

    res.send({
        ...body,
        private: events_private
    })
})

module.exports = read_all_private