const { query } = require("../database/connection");
const testRoute = require("express").Router();

testRoute.get("/", async (req, res) => {
    // try {
    //     const ans = await query("SELECT count(age) FROM test1 WHERE age >= 250");
    //     res.send(ans);
    // } catch (err) {
    //     res.send(err).status(500);
    // }

    const people = await query("SELECT * FROM users")
    res.send(people).status(200)
})

module.exports = testRoute;