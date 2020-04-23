const { query } = require("../database/connection")
const events = require("express").Router()
const create_private = require("./events_routes/create_private")
const create_public = require("./events_routes/create_public")
const read_all_private = require("./events_routes/read_all_private")
const read_search_private = require("./events_routes/read_search_private")
const edit_private = require("./events_routes/edit_private")
const edit_public = require("./events_routes/edit_public")
const delete_private = require("./events_routes/delete_private")
const delete_public = require("./events_routes/delete_public")
const uuid = require("uuid")

// PRIVATE:
events.use("/private/create", create_private)

events.use("/private/read/all", read_all_private)

events.use("/private/search", read_search_private)

events.use("/private/edit", edit_private)

events.use("/private/delete", delete_private)

// PUBLIC:

events.use("/public/create", create_public)

events.use("/public/edit", edit_public)

events.use("/public/delete", delete_public)

// BOTH:

events.post("/join", async (req, res) => {
  console.log("api/events/join")

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
    user_to_public_insert = await query(`INSERT INTO users_to_public (userId, eventId) VALUES (${req.body.userId}, ${event.id})`)
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

  res.send({ ...req.body, event, user_to_public_insert, update_event_attendees }).status(200)
})

module.exports = events
