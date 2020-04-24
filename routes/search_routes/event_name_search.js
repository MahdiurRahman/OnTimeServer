const { query } = require("../../database/connection")
const event_name_search = require("express").Router()

event_name_search.get("/", async (req, res) => {
    console.log("/api/search/name")
    const body = req.body

    // 1. find event with same name as search term
    let events
    try {
        events = await query(`SELECT * FROM events_public WHERE eventName='${body.eventName}'`)
    } catch (error) {
        res.send(error)
    }

    // 2. If event not found
    if (events.length === 0) {
        res.send(`Could not find event with name '${body.eventName}'`)
        return
    }
    // events = event[0]

    // 3. find all users connected to this event
    // let users
    // try {
    //     users = await query(`SELECT userId FROM users_to_public 
    //     WHERE 
    //         eventId=${event.id}
    //     AND
    //         userId!=${body.userId}`)
    // } catch(error) {
    //     res.send(error)
    // }

    // 4. find their user_info ids from users
    // let user_info_ids = []
    // let user_info_id
    // for (let i = 0; i < users.length; i++) {
    //     try {
    //         user_info_id = await query(`SELECT user_info FROM users WHERE id=${users[i].userId}`)
    //     } catch (error) {
    //         // user_info_ids.push(`ERROR on {${users[i]} -> ${user_info_id}}`)
    //         continue
    //     }
    //     user_info_ids.push(user_info_id[0].user_info)
    // }

    // 5. use user_info ids to finally get full user infos
    // let users_info = []
    // let capture
    // for (let i = 0; i < user_info_ids.length; i++) {
    //     try {
    //         capture = await query(`SELECT * FROM users_info WHERE id=${user_info_ids[i]}`)
    //     } catch (error) {
    //         continue
    //     }
    //     users_info.push(capture[0])
    // }

    res.send({
        ...body,
        events
    }).status(200)
})

module.exports = event_name_search