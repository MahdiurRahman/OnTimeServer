const { query } = require("../database/connection");
const testRoute = require("express").Router();
const {timeFromGoogleMapsAPI} = require("../utilities/utilities")

// timeFromGoogleMapsAPI({ lat: 40.7678, lng: -73.9645 }, { lat: 40.8714, lng: -73.8963 })

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