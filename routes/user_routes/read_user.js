const { query } = require("../../database/connection");
const read_user = require("express").Router();

read_user.get("/", async (req, res) => {
    console.log("api/users/read")
    const body = req.body

    let user_info
    try {
        user_info = await query(`SELECT * FROM users_info WHERE id=${body.userInfoId}`)
    } catch (error) {
        res.send(error)
    }

    if (user_info.length === 0) {
        res.send(`Sorry, no user information with that id`).status(404)
    }

    res.send({
        ...body,
        user_info
    }).status(200)
})

module.exports = read_user