const { query } = require("../database/connection");
const register = require("express").Router();

register.post("/", async (req, res) => {
    // console.log(req.body);
    let results = undefined;
    try {
        results = await query("select * from test1");
        res.send(results);
    } catch (error) {
        res.send("error").status(404);
    }
})

module.exports = register
