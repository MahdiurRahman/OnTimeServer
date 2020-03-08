const { query } = require("../../database/connection");
const edit_user = require("express").Router();

edit_user.put("/", async (req, res) => {
    const body = req.body
    
    // 1. create sql query
    const changes = body.changes;
    let sql_query = "";
    const keys = Object.keys(changes);
    for (let i = 0; i < keys.length; i++) {
        let value = (typeof(changes[keys[i]]) === "string" ? ("\'" + changes[keys[i]] + "\'") : changes[keys[i]]);
        sql_query += (keys[i] + "=" + value + ", ");
    }
    sql_query = sql_query.slice(0, -2);

    // 2. run sql query
    let conduct_edit;
    try {
        conduct_edit = await query(`UPDATE users_info SET ${sql_query} WHERE id=${body.id}`);
    } catch (error) {
        res.send(error);
    }

    res.send({
        ...body, 
        conduct_edit
    }).status(200);
})

module.exports = edit_user