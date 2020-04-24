const { query } = require("../../database/connection")
const search_private = require("express").Router()

search_private.get("/", async (req, res) => {
    console.log("/api/events/private/search")
    const body = req.body

    // 1. Form query from terms
        const terms = body.terms
        let keys = terms ? Object.keys(terms) : [""]
        if (keys[0] !== "") {
            keys.push(keys[0])
            keys[0] = ""
        }

        let event_private_query = `SELECT * FROM events_private WHERE ownerId=${body.ownerId} AND`
        event_private_query = keys.length > 0 ? event_private_query + keys.reduce((accumulator, key) => accumulator + ` ${key}=${typeof(terms[key]) === "string" ? "\'" + terms[key] + "\'" : terms[key]} AND`)
        : event_private_query
        event_private_query = event_private_query.slice(0, -4)
    
    // 2. Run query for search of events_private
        let event_private
        try {
            event_private = await query(event_private_query)
        } catch (error) {
            res.send({
                error,
                message: "Failed on: Run query for search",
                query: event_private_query
            })
        }

    res.send({
        ...body,
        event_private
    }).status(200)
})

module.exports = search_private