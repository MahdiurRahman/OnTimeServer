const { query } = require("../../database/connection")
const search_public = require("express").Router()

search_public.put("/", async (req, res) => {
    console.log("/api/events/public/search")

    // 1. Form query from terms
        const terms = req.body
        let keys = Object.keys(terms)
        keys.push(keys[0])
        keys[0] = ""

        let event_public_query = `SELECT * FROM events_public WHERE`
        event_public_query = keys.length > 0 ? event_public_query + keys.reduce((accumulator, key) => accumulator + ` ${key}=${typeof(terms[key]) === "string" ? "\'" + terms[key] + "\'" : terms[key]} AND`)
        : event_public_query
        event_public_query = event_public_query.slice(0, -4)
    
    // 2. Run query for search of events_public
        let event_public
        try {
            event_public = await query(event_public_query)
        } catch (error) {
            res.send({
                error,
                message: "Failed on: Run query for search",
                query: event_public_query
            })
        }

    res.send({
        ...req.body,
        event_public
    }).status(200)
})

module.exports = search_public