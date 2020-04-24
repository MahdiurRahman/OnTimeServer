const { query } = require("../database/connection");
const register = require("express").Router();
const bcrypt = require("bcrypt");

register.post("/", async (req, res) => {
    console.log("/api/register")
    // 1. Find user from email
        let duplicates;
        const duplicates_query = `SELECT * FROM users WHERE email='${req.body.email}'`
        try {
            duplicates = await query(duplicates_query);
        } catch (error) {
            res.send({
                error,
                message: "Failed on: Find user from email",
                query: duplicates_query
            }).status(404)
        }

    // 2. Check if duplicate
        if (duplicates.length > 0) {
            res.send({
                duplicateUserError: "User already exists"
            }).status(404);
            return;
        }

    // 3. Create new entry in users_info first
        let user_info;
        const user_info_query = `INSERT INTO users_info (firstName, lastName) VALUES ('${req.body.firstName}', '${req.body.lastName}')`
        try {
            user_info = await query(user_info_query);
        } catch (error) {
            res.send({
                error,
                message: "Failed on: create new entry in users_info",
                query: user_info_query
            }).status(404);
        }

    // 4. Create new entry in users
        let user;
        const password = await bcrypt.hash(req.body.password, 10);
        const user_query = `INSERT INTO users (email, password, user_info) VALUES ('${req.body.email}', '${password}', ${user_info["insertId"]})`
        try {
            user = await query(user_query);
        } catch (error) {
            res.send({
                error,
                message: "Failed on: Create new entry in users",
                query: user_query
            }).status(404);
        }

    let response = req.body;
    delete response.password;
    res.send({
        ...response,
        duplicates,
        user_info,
        user
    });
})

module.exports = register
