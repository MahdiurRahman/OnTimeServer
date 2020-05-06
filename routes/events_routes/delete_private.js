const { query } = require("../../database/connection");
const delete_private = require("express").Router();

delete_private.put("/", async (req, res) => {
    console.log("/api/events/private/delete")
    const body = req.body

    // 3. delete event
    let delete_event
    try {
        delete_event = await query(`DELETE FROM events_private WHERE id=${body.eventId}`)
    } catch (error) {
        res.send(error)
    }

    res.send({
        ...req.body,
        delete_event
    }).status(200)
})

module.exports = delete_private