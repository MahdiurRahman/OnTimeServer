const { query } = require("../../database/connection")
const create_public = require("express").Router()
const uuid = require("uuid")

create_public.post("/", async (req, res) => {
  // Date format: YYYY-MM-DD
  // Time format: HH:MM:SS

  console.log("/api/events/public")

  // Create entry in events table
  const code = await uuid.v4()
  let event_insert
  try {
    event_insert = await query(`INSERT INTO events_public (
            ownerId,
            eventName,
            startDate,
            endDate,
            repeatWeekly,
            weeklySchedule,
            time,
            locationName,
            lat,
            lng,
            code,
            attendees
        ) 
        VALUES (
            ${req.body.ownerId},
            '${req.body.eventName ? req.body.eventName : "not provided"}',
            '${req.body.startDate}',
            '${req.body.endDate}',
            ${req.body.repeatWeekly},
            '${req.body.weeklySchedule ? req.body.weeklySchedule : "0000000"}',
            '${req.body.time}',
            '${req.body.locationName ? req.body.locationName : "not provided"}',
            ${req.body.lat},
            ${req.body.lng},
            '${code}',
            1
        )`)
  } catch (error) {
    res.send(error)
  }

  // Create entry in users_to_public table
  let user_to_public_insert
  try {
    user_to_public_insert = await query(`INSERT INTO users_to_public (
            userId,
            eventId
        )
        VALUES (
            ${req.body.ownerId},
            ${event_insert.insertId}
        )`)
  } catch (error) {
    res.send(error)
  }

  res.send({ ...req.body, id: event_insert.insertId }).status(200)
})

module.exports = create_public
