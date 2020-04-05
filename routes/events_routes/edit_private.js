const { query } = require("../../database/connection");
const edit_private = require("express").Router();

edit_private.put("/", async (req, res) => {

    // confirm if its the event owner
    let event;
    try {
        event = await query(`SELECT * FROM events_private
        WHERE
            ownerId=${req.body.ownerId}
        AND
            id=${req.body.eventId}`);
    } catch(error) {
        res.send({"error": error});
    }

    if (event.length <= 0) {
        res.send({"error": `You aren't the owner of this event or event doesn't exist`});
    }
    event = event[0];

    // construct sql query string
    const changes = req.body.changes;
    let sql_query = "";
    const keys = Object.keys(changes);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] === "code") continue; // just to make sure "code" can't be changed
        let value = (typeof(changes[keys[i]]) === "string" ? ("\'" + changes[keys[i]] + "\'") : changes[keys[i]]);
        sql_query += (keys[i] + "=" + value + ", ");
    }
    sql_query = sql_query.slice(0, -2);

    // run the sql query
    let conduct_edit;
    try {
        conduct_edit = await query(`UPDATE events_private SET ${sql_query} WHERE id=${req.body.eventId}`);
    } catch (error) {
        res.send({"error": error});
    }

    res.send({...req.body, conduct_edit}).status(200);
});

module.exports = edit_private;