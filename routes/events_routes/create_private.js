const { query } = require("../../database/connection")
const create_private = require("express").Router()
const uuid = require("uuid")

create_private.post("/", async (req, res) => {
  console.log("/api/events/private/create")
    // Date format: YYYY-MM-DD
    // Time format: HH:MM:SS
    
    // Create entry in events table
    const code = await uuid.v4()
    let events_insert
    try {
      events_insert = await query(`INSERT INTO events_private (
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
                  code
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
                  '${code}'
              )`)
    } catch (error) {
      res.send(error)
    }
  
    // Create entry in users_to_events table
    let user_to_private_insert
    try {
      user_to_private_insert = await query(`INSERT INTO users_to_private (
                  userId,
                  eventId
              )
              VALUES (
                  ${req.body.ownerId},
                  ${events_insert.insertId}
              )`)
    } catch (error) {
      res.send(error)
    }
  
    res.send({ ...req.body, events_insert, user_to_private_insert }).status(200)
})

module.exports = create_private