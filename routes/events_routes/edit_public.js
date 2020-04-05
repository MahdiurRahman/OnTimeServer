const { query } = require("../../database/connection");
const edit_public = require("express").Router();

edit_public.put("/", async (req, res) => {

    // 1. confirm if this request was sent from event owner
    let event;
    try {
        event = await query(`SELECT * FROM events_public
        WHERE
            ownerId=${req.body.ownerId}
        AND
            id=${req.body.eventId}`);
    } catch(error) {
        res.send({"error": error});
    }
    if (event.length <= 0) {
        res.send(`You aren't the owner or event doesn't exist`);
    }
    event = event[0];

    // 2. construct sql_query string AND message
    const changes = req.body.changes;
    let sql_query = "";
    let message = "";
    const keys = Object.keys(changes);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] === "code") continue; // just to make sure event "code" can't be changed

        // sql_query
        let value = (typeof(changes[keys[i]]) === "string" ? ("\'" + changes[keys[i]] + "\'") : changes[keys[i]]);
        sql_query += (keys[i] + "=" + value + ", ");

        // message
        message += (keys[i] + ": " + event[keys[i]] + " -> " + changes[keys[i]] + "\n");
    }
    sql_query = sql_query.slice(0, -2);
    message = message.slice(0, -1);

    // run sql query string
    let conduct_edit;
    try {
        conduct_edit = await query(`UPDATE events_public SET ${sql_query} WHERE id=${req.body.eventId}`);
    } catch (error) {
        res.send({"error": error});
    }

    // 3. propogate notifications w/ message:

    // find all users connected to this event via users_to_public and make a notifications entry for them
    let users;
    try {
        users = await query(`SELECT * FROM users_to_public 
        WHERE 
            userId!=${req.body.ownerId}
        AND
            eventId=${req.body.eventId}`);
    } catch (error) {
        res.send({"error": error});
    }

    // make sure there are users to notify
    // iterate through "users" variable and create entries in notifications
    let current_time;
    if (users.length > 0) {
        current_time = new Date();
        current_time = current_time.toJSON().replace("T", " ").slice(0, -5);
        for (let i = 0; i < users.length; i++) {
            try {
                query(`INSERT INTO notifications (
                    userId,
                    eventId, 
                    createdOn, 
                    message) 
                VALUES (
                    ${users[i].userId}, 
                    ${req.body.eventId}, 
                    '${current_time}', 
                    '${message}')`);
            } catch(error) {
                res.send({"error": error});
            }
        }
    }
    else {
        //res.send({"error": "No users other than owner connected to this event. No notifications sent"});
    }
    
    let publicEvents
  try {
    publicEvents = await query(
        `SELECT 
            id, 
            ownerId, 
            eventName, 
            DATE_FORMAT(startDate,'%Y-%m-%d') AS "startDate", 
            DATE_FORMAT(endDate,'%Y-%m-%d') AS "endDate",
            repeatWeekly,
            weeklySchedule,
            time,
            locationName,
            lat,
            lng,
            code,
            attendees
        FROM events_public WHERE ownerId=${req.body.ownerId}`
    )
  } catch (error) {
    res.send({ error: error })
  }

  // send updated list of user's private events
  res.send({publicEvents}).status(200)



});

module.exports = edit_public