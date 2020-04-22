const { query } = require("../../database/connection");
const edit_favorite = require("express").Router();

edit_favorite.put("/", async (req, res) => {
    console.log("api/favorites/edit")
    const body = req.body

    // 1. generate sql query
    let changes = body.changes
    let sql_query = ""
    const keys = Object.keys(changes)
    for (let i = 0; i < keys.length; i++) {
        let value = typeof(changes[keys[i]]) === "string" ? ("\'" + changes[keys[i]] + "\'") : changes[keys[i]];
        sql_query += (keys[i] + "=" + value + ", ");
    }
    sql_query = sql_query.slice(0, -2);

    // !NOTE: A good check to add would be to check for duplicate favorites by lat and lng.

    // 2. run sql query
    let edit_favorite
    try {
        edit_favorite = await query(`UPDATE favorites SET ${sql_query} WHERE id=${body.favoriteId}`)
    } catch (error) {
        res.send(error)
    }

    res.send({
        ...body,
        edit_favorite
    })
})

module.exports = edit_favorite