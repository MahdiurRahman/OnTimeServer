const { query } = require("../../database/connection");
const password = require("express").Router();
const bcrypt = require("bcrypt")

password.put("/", async (req, res) => {
    // find user
    const body = req.body
    let user
    try {
        user = await query(`SELECT * FROM users WHERE email='${body.email}'`)
    } catch (error) {
        res.send(error)
    }
    user = user[0]

    // confirm password
    const result = await bcrypt.compare(body.password, user.password)
    if (!result) {
        res.send(`Wrong password buddy`)
        return
    }

    // change password
    let new_password
    let change_password_action
    try {
        new_password = await bcrypt.hash(body.new_password, 10);
        change_password_action = await query(`UPDATE users SET password='${new_password}' WHERE id=${user.id}`)
    } catch (error) {
        res.send(error)
    }

    res.send({
        user,
        new_password,
        change_password_action
    })
})

module.exports = password