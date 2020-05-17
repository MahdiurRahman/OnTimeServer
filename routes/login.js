const { query } = require("../database/connection")
const login = require("express").Router()
const bcrypt = require("bcrypt")
const {
  combinePublicEventsToUsers,
  preprocessPublicEvents,
  schedulePushNotifications
} = require("../utilities/utilities")
const schedule = require("node-schedule")
const sgMail = require("@sendgrid/mail")

// This route, the way it is, will have to make several requests to the db. We could try creating a huge query like the one from Raman's class where it gets all the user info and user event info etc. in one request.
login.post("/", async (req, res) => {
  console.log("/api/login")
  const body = req.body

  // 1. Check if user exists
  let user
  try {
    user = await query(`SELECT * FROM users WHERE email='${body.email}'`)
  } catch (error) {
    res
      .send({
        error,
        message: "Failed on: Check if user exists",
        query: `SELECT * FROM users WHERE email='${body.email}'`
      })
      .status(404)
  }
  if (user.length <= 0) {
    res.send({ authError: `No user with that email` }).status(404)
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
    res
      .send({
        error,
        message: "Failed on: Update users_info pushToken",
        query: updatePushTokenQuery
      })
      .status(404)
  }

  // push(body.pushToken)

  // 3b. Retrieve user information from users_info as well
  let userInfo
  try {
    userInfo = await query(`SELECT * FROM users_info WHERE id=${user.user_info}`)
  } catch (error) {
    res
      .send({
        error,
        message: "Failed on: Retrieve user information",
        query: `SELECT * FROM users_info WHERE id=${user.user_info}`
      })
      .status(404)
  }
  userInfo = userInfo[0]

  // 4. Iterate events and setup notifications

  // 4. Retrieve private events
  let events = {
    private: [],
    public: []
  }
  try {
    events.private = await query(`SELECT * FROM events_private WHERE ownerId=${user.id}`)
  } catch (error) {
    res
      .send({
        error: error,
        message: `Failed on: Retrieve private events`,
        query: `SELECT * FROM events_private WHERE ownerId=${user.id}`
      })
      .status(404)
  }

  // 5. Retrieve public events
  // 5a. Retreve user_to_public entries
  let user_to_public
  try {
    user_to_public = await query(`SELECT * FROM users_to_public WHERE userId=${user.id}`)
  } catch (error) {
    res
      .send({
        error,
        message: `Failed on: Retreve users_to_public entries`,
        query: `SELECT * FROM users_to_public WHERE userId=${user.id}`
      })
      .status(404)
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
      res
        .send({
          error,
          message: `Failed on: Retrieve public events`,
          query: public_events_query
        })
        .status(404)
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
  const processedPublicEvents = preprocessPublicEvents(events.public)
  const eventsForNotifications = events.private.concat(processedPublicEvents)
  schedulePushNotifications(eventsForNotifications, body.pushToken)

  // Send user an email with their verification token
  const authToken = Math.floor(100000 + Math.random() * 900000)
  sgMail.setApiKey(process.env.SG_KEY)
  sgMail.send({
    to: user.email,
    from: "OnTimeCapstone@gmail.com",
    subject: "Your Verification Token",
    text: `Your one-time verification token is: ${authToken}`,
    html: `Your one-time verification token is:<strong> ${authToken}</strong>`
  })

  // Set the user's authToken in the database
  try {
    await query(`UPDATE users_info SET authToken = ${authToken} WHERE id=${user.user_info};`)
  } catch (error) {
    res
      .send({
        error,
        message: "Failed on: updating authToken"
      })
      .status(404)
  }

  res.send({ user, userInfo, events, notifications }).status(200)
})

login.post("/authenticate", async (req, res) => {
  const { usersInfoId, userToken } = req.body
  try {
    const response = await query(`SELECT authToken FROM users_info WHERE id=${usersInfoId}`)
    const { authToken } = response[0]
    authToken == userToken
      ? res.send({ success: "The user has entered the correct token." }).status(200)
      : res.send({ error: "The token you have entered is incorrect." }).status(200)
  } catch (error) {
    res.send({ error: "There was an error while attempting to authenticate." }).status(404)
  }
})

module.exports = login
