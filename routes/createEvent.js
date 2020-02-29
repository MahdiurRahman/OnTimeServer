const { query } = require("../database/connection");
const addEvent = require("express").Router();
const uuid = require("uuid");

addEvent.post("/", async (req, res) => {

    // Create entry in events table
    const code = await uuid.v4();
    let events_insert;
    try {
        events_insert = await query(`INSERT INTO events (
            isPrivate,
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
            ${req.body.isPrivate},
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
        )`);
        console.log(events_insert);
    } catch (error) {
        res.send(error)
    }

    // Create entry in users_to_events table
    let users_to_events_insert;
    try {
        users_to_events_insert = await query(`INSERT INTO users_to_events (
            userId,
            eventId
        )
        VALUES (
            ${req.body.ownerId},
            ${events_insert.insertId}
        )`)
    } catch (error) {
        res.send(error);
    }

    res.send({...req.body, events_insert, users_to_events_insert}).status(200);
})

module.exports = addEvent;