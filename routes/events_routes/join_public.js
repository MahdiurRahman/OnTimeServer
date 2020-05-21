const { query } = require("../../database/connection")
const join_public = require("express").Router()
const {
    combinePublicEventsToUsers,
    preprocessPublicEvents,
    schedulePushNotifications
} = require("../../utilities/utilities")

join_public.post("/", async (req, res) => {
    console.log("/api/events/public/join")
  
    // 1. Find event matching the code in req.body
    let event
    try {
        event = await query(`SELECT * FROM events_public WHERE code='${req.body.code}'`)
    } catch (error) {
        res.send(error)
    }
  
    if (event.length <= 0) {
        res.send(`This event does not exist`)
        return
    }
    event = event[0]
  
    // 2. Check if maybe user is already joined into event
    let user_to_public_entry
    try {
        user_to_public_entry = await query(`SELECT * FROM users_to_public 
            WHERE
                userId=${req.body.userId}
            AND
                eventId=${event.id}`)
    } catch (error) {
        res.send(error)
    }
  
    if (user_to_public_entry.length > 0) {
        res.send(`User is already connected to the event`)
        return
    }
  
    // 3. Create entry in users_to_public table
    let user_to_public_insert
    try {
        user_to_public_insert = await query(`INSERT INTO users_to_public (userId, eventId, startLat, startLng) VALUES (${req.body.userId}, ${event.id}, ${req.body.startLat}, ${req.body.startLng})`)
    } catch (error) {
        res.send(error)
    }
  
    // 4. Update 'attendees' in events_public for this event
    let update_event_attendees
    try {
        update_event_attendees = await query(`UPDATE events_public 
        SET
            attendees=attendees+1
        WHERE
            id=${event.id}`)
    } catch (error) {
        res.send(error)
    }

    // 5. Get user user-table entry
    let users_entry_query = `SELECT * FROM users WHERE id=${req.body.userId}`
    let users_entry
    try {
        users_entry = await query(users_entry_query)
    } catch (error) {
        res.send({
            error,
            message: "Failed on: Get user's pushToken",
            query: users_entry_query
        })
    }
    users_entry = users_entry[0]
    
    // 6. Get users_info entry
    let users_info_query = `SELECT * FROM users_info WHERE id=${users_entry.user_info}`
    let users_info
    try {
        users_info = await query(users_info_query)
    } catch (error) {
        res.send({
            error,
            message: "Failed on: Get users_info entry",
            query: users_info_query
        })
    }

    // 7. Issue new notification setting
    const dummyObject = {
        event,
        user: user_to_public_entry[0]
    }
    const processed_event = preprocessPublicEvents([dummyObject])
    schedulePushNotifications(processed_event, users_info.pushToken)

    // Get user's users_info entry
    // let users_info_query = `SELECT * FROM users_info WHERE id=${}`
  
    res.send({
        ...req.body, 
        event, 
        user_to_public_insert, 
        update_event_attendees
    }).status(200)
})

module.exports = join_public