const { query } = require("../database/connection")
const login = require("express").Router()
const bcrypt = require("bcrypt")
const { push, combinePublicEventsToUsers } = require("../utilities/utilities")
const schedule = require('node-schedule')

// This route, the way it is, will have to make several requests to the db. We could try creating a huge query like the one from Raman's class where it gets all the user info and user event info etc. in one request.
login.post("/", async (req, res) => {
  console.log("/api/login")
  const body = req.body

  // 1. Check if user exists
  let user
  try {
    user = await query(`SELECT * FROM users WHERE email='${body.email}'`)
  } catch (error) {
    res.send({ 
      error,
      message: "Failed on: Check if user exists",
      query: `SELECT * FROM users WHERE email='${body.email}'`
    }).status(404)
  }
  if (user.length <= 0) {
    res.send({ authError: `No user with that email`}).status(404)
    return
  }
  user = user[0]

  // 2. check password
  const userPassword = user.password
  let result = await bcrypt.compare(body.password, userPassword)
  if (!result) {
    res.send({ authError: "Password is incorrect" })
    return
  }

  // 3. Retrive and update users_info table 
    // 3a. Update users_info pushToken
    let updatePushToken
    let updatePushTokenQuery = `UPDATE users_info SET pushToken='${body.pushToken}' WHERE id=${user.user_info}`
    try {
      updatePushToken = await query(updatePushTokenQuery)
    } catch (error) {
      res.send({
        error,
        message: "Failed on: Update users_info pushToken",
        query: updatePushTokenQuery
      }).status(404)
    }

    // push(body.pushToken)

    // 3b. Retrieve user information from users_info as well
    let userInfo
    try {
      userInfo = await query(`SELECT * FROM users_info WHERE id=${user.user_info}`)
    } catch (error) {
      res.send({ 
        error,
        message: "Failed on: Retrieve user information",
        query: `SELECT * FROM users_info WHERE id=${user.user_info}`
      }).status(404)
    }
    userInfo = userInfo[0]

  // 4. Iterate events and setup notifications
  

  // 4. Retrieve private events
  let events = {
    private: [],
    public: [],
  }
  try {
    events.private = await query(`SELECT * FROM events_private WHERE ownerId=${user.id}`)
  } catch(error) {
    res.send({
      error: error,
      message: `Failed on: Retrieve private events`,
      query: `SELECT * FROM events_private WHERE ownerId=${user.id}`
    }).status(404)
  }

  // 5. Retrieve public events
    // 5a. Retreve user_to_public entries
    let user_to_public
    try {
      user_to_public = await query(`SELECT * FROM users_to_public WHERE userId=${user.id}`)
    } catch (error) {
      res.send({
        error,
        message: `Failed on: Retreve users_to_public entries`,
        query: `SELECT * FROM users_to_public WHERE userId=${user.id}`
      }).status(404)
    }

    // 5b. Collect public event ids from user_to_public
    let public_event_ids = []
    for (let i = 0; i < user_to_public.length; i++) {
      public_event_ids.push(user_to_public[i].eventId)
    }

    // 5c. Formulate single query sentence for all ids
    let public_events_query = `SELECT * FROM events_public WHERE`
    for (let i = 0; i < public_event_ids.length; i++) {
      const entry = ` id=${public_event_ids[i]} OR`
      public_events_query += entry
    }
    public_events_query = public_events_query.slice(0, -3)

    // 5d. Retrieve public events
    if (user_to_public.length > 0) {
      try {
        events.public = await query(public_events_query)
      } catch (error) {
        res.send({
          error,
          message: `Failed on: Retrieve public events`,
          query: public_events_query
        }).status(404)
      }
    }

  // 6. Retrieve notifications
  let notifications
  try {
    notifications = await query(`SELECT * FROM notifications WHERE userId=${user.id}`)
  } catch (error) {
    res.send({
      error,
      message: "Failed on: Retrieve notifications",
      query: `SELECT * FROM notifications WHERE userId=${user.id}`
    })
  }

  // Combine events_public with users_to_public
  events.public = combinePublicEventsToUsers(events.public, user_to_public)

  // Propogate Notifications
    
    // const now = new Date()
    // console.log(`0 ${now.getMinutes() + 1} ${now.getHours()} * * *`)
    // const job1 = schedule.scheduleJob(`0 ${now.getMinutes() + 1} ${now.getHours()} * * *`, async () => push(body.pushToken))

  res.send({ user, userInfo, events, notifications }).status(200)
})

module.exports = login
