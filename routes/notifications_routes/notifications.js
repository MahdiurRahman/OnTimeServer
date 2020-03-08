const { query } = require("../../database/connection");
const notifications = require("express").Router();

notifications.get("/", async (req, res) => {
    const body = req.body
    let user_notifications
    try {
        user_notifications = await query(`SELECT * FROM notifications WHERE userId=${body.userId}`)
    } catch (error) {
        res.send(error)
    }
    res.send({
        ...body,
        user_notifications
    })
})

module.exports = notifications