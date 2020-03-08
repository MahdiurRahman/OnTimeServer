const { query } = require("../../database/connection");
const read_user = require("express").Router();

read_user.get("/", async (req, res) => {
    const body = req.body

    let user_info
    try {
        user_info = await query(`SELECT * FROM users_info WHERE id=${body.id}`)
    } catch (error) {
        res.send(error)
    }

    res.send({
        ...body,
        user_info
    })
})

module.exports = read_user