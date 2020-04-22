const { query } = require("../../database/connection");
const notifications = require("express").Router();

notifications.get("/read", async (req, res) => {
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

notifications.delete("/delete", async (req, res) => {
    const body = req.body

    // 1. Retreive notification from db
    let confirm_notification
    try {
        confirm_notification = await query(`SELECT * FROM notifications WHERE id=${body.notificationId}`)
    } catch (error) {
        res.send({error})
    }

    // 2. Confirmation if notification exist & allowed to delete
    if (confirm_notification.length === 0) {
        res.send(`Sorry. This notification does not exist to delete.`)
        return
    }
    if (confirm_notification[0].userId !== body.userId) {
        res.send(`You do not have permission to delete this notification.`)
        return
    }

    // 3. Delete notification
    let delete_notification
    try {
        delete_notification = await query(`DELETE FROM notifications WHERE id=${body.notificationId}`)
    } catch (error) {
        res.send({error})
    }

    res.send({
        ...body,
        confirm_notification,
        delete_notification
    }).status(200)
})

module.exports = notifications