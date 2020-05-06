const { query } = require("../../database/connection");
const delete_public = require("express").Router();

delete_public.put("/", async (req, res) => {
    console.log("/api/events/public/delete")

    const body = req.body

    // 1. find event
    let event
    try {
        event = await query(`SELECT * FROM events_public WHERE id=${body.eventId}`)
    } catch (error) {
        res.send(error)
    }
    event = event[0]

    // 2. check code
    if (body.code != event.code) {
        res.send(`Sorry. Wrong credentials to delete event`)
        return
    }

    // 4. get all users connected to this event (NOT including owner)
    let users
    try {
        users = await query(`SELECT * FROM users_to_public 
        WHERE 
            eventId=${body.eventId}
        AND
            userId!=${event.ownerId}`)
    } catch (error) {
        res.send(error)
    }

    // 6. delete all entrys in users_to_public
    let delete_users_to_public
    try {
        delete_users_to_public = await query(`DELETE FROM users_to_public WHERE eventId=${body.eventId}`)
    } catch(error) {
        res.send(error)
    }

    // 3. delete event
    let delete_event
    try {
        delete_event = await query(`DELETE FROM events_private WHERE id=${body.eventId}`)
    } catch (error) {
        res.send(error)
    }

    // 5. propogate notification
    let current_time
    let message = `The event '${event.eventName}' was deleted.`  
    let notification
    for (let i = 0; i < users.length; i++) {
        current_time = new Date();
        current_time = current_time.toJSON().replace("T", " ").slice(0, -5);
        try {
            notification = await query(`INSERT INTO notifications (
                userId, 
                eventId, 
                createdOn,
                message)
            VALUES
                ${users[i].userId},
                ${event.id},
                '${current_time}',
                '${message}'`)
        } catch (error) {
            continue
        }
    }

    res.send({
        ...body,
        event, 
        delete_event,
        delete_users_to_public,
        notification
    })
})

module.exports = delete_public