const { query } = require("../../database/connection");
const delete_private = require("express").Router();

delete_private.put("/", async (req, res) => {
    console.log("/api/events/private/delete")
    const body = req.body
    
    // 1. find event
    let event
    try {
        event = await query(`SELECT * FROM events_private WHERE id=${body.eventId}`)
    } catch (error) {
        res.send(error)
    }
    event = event[0]

    // 2. check code
    if (body.code !== event.code) {
        res.send(`Sorry. Wrong credentials to delete event`)
    }

    // 3. delete users_to_private entry as well
    let delete_users_to_private
    try {
        delete_users_to_private = await query(`DELETE FROM users_to_private WHERE eventId=${body.eventId}`)
    } catch(error) {
        res.send(error)
    }

    // 4. delete event
    let delete_event
    try {
        delete_event = await query(`DELETE FROM events_private WHERE id=${body.eventId}`)
    } catch (error) {
        res.send(error)
    }

    res.send({
        ...req.body, 
        event, 
        delete_event, 
        delete_users_to_private
    }).status(200)
})

module.exports = delete_private