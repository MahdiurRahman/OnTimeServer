const { query } = require("../../database/connection")
const read_public = require("express").Router()

read_public.get("/", async (req, res) => {
    console.log("/api/events/public/read")
    const body = req.body

    // 1. Get users_to_public entries for this user
        let user_to_public
        let user_to_public_query = `SELECT * FROM users_to_public WHERE userId=${body.userId}`
        try {
            user_to_public = await query(user_to_public_query)
        } catch (error) {
            res.send({
                error,
                message: "Failed on: Get users_to_public entries for this user",
                query: user_to_public_query
            })
        }

    // 2. Generate query
        user_to_public.push(user_to_public[0])
        user_to_public[0] = ""
        const OR_statements = user_to_public.reduce((accumulator, event) => accumulator + ` id=${event.eventId} OR`).slice(0, -3)
        const public_events_query = "SELECT * FROM events_public WHERE " + OR_statements

    // 3. Run query
        let public_events
        try {
            public_events = await query(public_events_query)
        } catch (error) {
            res.send({
                error,
                message: "Failed on: Run query",
                query: public_events_query
            })
        }


    res.send({
        ...body,
        user_to_public,
        public_events
    }).status(200)
})

module.exports = read_public