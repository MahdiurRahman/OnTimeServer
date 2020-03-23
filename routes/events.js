const { query } = require("../database/connection");
const events = require("express").Router();
const edit_private = require("./events_routes/edit_private")
const edit_public = require("./events_routes/edit_public")
const delete_private = require("./events_routes/delete_private")
const delete_public = require("./events_routes/delete_public")
const uuid = require("uuid");

// PRIVATE:

    events.post("/private", async (req, res) => {
        // Date format: YYYY-MM-DD
        // Time format: HH:MM:SS
        console.log(req.body)
        // Create entry in events table
        const code = await uuid.v4();
        let events_insert;
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
            )`);
        } catch (error) {
            res.send(error)
        }

        // Create entry in users_to_events table
        let user_to_private_insert;
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
            res.send(error);
        }

        res.send({...req.body, events_insert, user_to_private_insert}).status(200);
    });

    events.use("/private/edit", edit_private);

    events.use("/private/delete", delete_private)


// PUBLIC:

    events.post("/public", async (req, res) => {

        // Create entry in events table
        const code = await uuid.v4();
        let event_insert;
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
            )`);
        } catch (error) {
            res.send(error)
        }

        // Create entry in users_to_public table
        let user_to_public_insert;
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
            res.send(error);
        }

        res.send({...req.body, event_insert, user_to_public_insert}).status(200);
    });

    events.use("/public/edit", edit_public);

    events.use("/public/delete", delete_public)


// BOTH:

    events.post("/join", async (req, res) => {
        
        // Find event matching the code in req.body
        let event;
        try {
            event = await query(`SELECT * FROM events_public WHERE code='${req.body.code}'`)
        } catch (error) {
            res.send(error);
        }

        // If event matching code doesn't exist
        if (event.length <= 0) {
            res.send(`This event does not exist`);
            return;
        }
        event = event[0];

        // Check if users_to_public already has entry
        let user_to_public_entry;
        try {
            user_to_public_entry = await query(`SELECT * FROM users_to_public 
            WHERE
                userId=${req.body.userId}
            AND
                eventId=${event.id}`);
        } catch (error) {
            res.send(error);
        }

        // If users_to_public HAS an entry:
        if (user_to_public_entry.length > 0) {
            res.send(`User is already connected to the event`);
            return;
        }

        // Create entry in users_to_public table
        let user_to_public_insert;
        try {
            user_to_public_insert = await query(`INSERT INTO users_to_public (
                userId,
                eventId
            )
            VALUES (
                ${req.body.userId},
                ${event.id}
            )`)
        } catch (error) {
            res.send(error);
        }

        // Update 'attendees' in events_public for this event
        let update_event_attendees;
        try {
            update_event_attendees = await query(`UPDATE events_public 
            SET
                attendees=attendees+1
            WHERE
                id=${event.id}`)
        } catch(error) {
            res.send(error);
        }

        res.send({...req.body, event, user_to_public_insert, update_event_attendees}).status(200);
    })

module.exports = events;