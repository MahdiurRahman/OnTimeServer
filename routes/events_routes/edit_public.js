const { query } = require("../../database/connection")
const edit_public = require("express").Router()
const axios = require("axios")

edit_public.put("/", async (req, res) => {
  console.log("/api/events/public/edit")

  // 1. confirm if this request was sent from event owner
  let event
  try {
    event = await query(`SELECT * FROM events_public
        WHERE
            ownerId=${req.body.ownerId}
        AND
            id=${req.body.eventId}`)
  } catch (error) {
    res.send({ error: error })
  }
  if (event.length <= 0) {
    res.send(`You aren't the owner or event doesn't exist`)
  }
  event = event[0]

  // 2. construct sql_query string AND message
  let changes = req.body.changes
    delete changes.startLat
    delete changes.startLng
  let sql_query = ""
  let message = ""
  const keys = Object.keys(changes)
  for (let i = 0; i < keys.length; i++) {
    if (keys[i] === "code") continue // just to make sure event "code" can't be changed

    // sql_query
    let value = typeof changes[keys[i]] === "string" ? "'" + changes[keys[i]] + "'" : changes[keys[i]]
    sql_query += keys[i] + "=" + value + ", "

    // message
    message += keys[i] + ": " + event[keys[i]] + " -> " + changes[keys[i]] + "\n"
  }
  sql_query = sql_query.slice(0, -2)
  message = message.slice(0, -1)

  // 3. run sql query string
  let conduct_edit
  try {
    conduct_edit = await query(`UPDATE events_public SET ${sql_query} WHERE id=${req.body.eventId}`)
  } catch (error) {
    res.send({ error: error })
  }

  // 4. propogate notifications w/ message:

  // find all users connected to this event via users_to_public and make a notifications entry for them
  let users
  try {
    users = await query(`SELECT * FROM users_to_public 
        WHERE 
            userId!=${req.body.ownerId}
        AND
            eventId=${req.body.eventId}`)
  } catch (error) {
    res.send({ error: error })
  }

  // use user id's to get pushTokens
  if (users.length > 0) {
    // Get entries from users table
      // generate Query
      let OR_statements = ""
      for (let i = 0; i < users.length; i++) {
        OR_statements += `id=${users[i].userId} OR `
      }
      OR_statements = OR_statements.slice(0, -4)
      const users_query = `SELECT * FROM users WHERE ${OR_statements}`
      
      let users_;
      try {
        users_ = await query(users_query)
      } catch (error) {
        res.send({
          error,
          message: "Failed on: Get entries from users table",
          query: users_query
        })
      }
      
    // Get entries from users_info table
      // generate query
      OR_statements = ""
      for (let i = 0; i < users_.length; i++) {
        OR_statements += `id=${users_[i].user_info} OR `
      }
      OR_statements = OR_statements.slice(0, -4)
      const users_info_query = `SELECT * FROM users_info WHERE ${OR_statements}`
      console.log(users_info_query)

      let usersInfo;
      try {
        usersInfo = await query(users_info_query)
      } catch (error) {
        res.send({
          error,
          message: "Failed on: Get entries from users_info table",
          query: users_info_query
        })
      }
      
    // Propogate push notifications
      let pushResponse
      for (let i = 0; i < usersInfo.length; i++) {
        let pushToken = usersInfo[i].pushToken
        if (pushToken !== null && pushToken !== undefined) {
          const info = {
            to: pushToken,
            sound: 'default',
            title: `Event Changed!`,
            body: message,
            data: { 
              data: message,
              status: false,
            },
            _displayInForeground: true,
          };
          pushResponse = await axios.post('https://exp.host/--/api/v2/push/send', info, {
            headers: {
                Accept: 'application/json',
                'Accept-encoding': 'gzip, deflate',
                'Content-Type': 'application/json',
            }
          })
        }
      }
  }
  
  // get updated event
  let edited_event
  try {
    edited_event = await query(`SELECT * FROM events_public
          WHERE
              ownerId=${req.body.ownerId}
          AND
              id=${req.body.eventId}`)
  } catch (error) {
    res.send({ error: error })
  }

  res.send({
    ...edited_event[0],
    notification: {
      userId: req.body.ownerId,
      eventId: req.body.eventId,
      current_time,
      message
    }
  })
})

module.exports = edit_public
