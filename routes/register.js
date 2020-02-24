const { query } = require("../database/connection");
const register = require("express").Router();
const bcrypt = require("bcrypt");

register.post("/", async (req, res) => {
    // 1. find user from email
    let duplicates;
    try {
        duplicates = await query(`SELECT * FROM users WHERE email='${req.body.email}'`);
    } catch (error) {
        res.send("error").status(404);
    }

    // 2. check if duplicate
    if (duplicates.length > 0) {
        res.send("User already exists").status(404);
        return;
    }

    // 3. Not duplicate, create new entry in users_info first
    let user_info;
    try {
        user_info = await query(`INSERT INTO users_info (firstName, lastName) VALUES ('${req.body.firstName}', '${req.body.lastName}')`);
    } catch (error) {
        res.send("error").status(404);
    }

    // 4. Create new entry in users
    let user;
    try {
        const password = await bcrypt.hash(req.body.password, 10);
        user = await query(`INSERT INTO users (email, password, user_info) VALUES ('${req.body.email}', '${password}', ${user_info["insertId"]})`);
    } catch (error) {
        res.send("error").status(404);
    }

    // 5. Send back user info using req.body
    let response = req.body;
    delete response.password;
    res.send(response);
})

module.exports = register
