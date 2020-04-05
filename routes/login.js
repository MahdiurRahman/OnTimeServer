const { query } = require("../database/connection")
const login = require("express").Router()
const bcrypt = require("bcrypt")

// This route, the way it is, will have to make several requests to the db. We could try creating a huge query like the one from Raman's class where it gets all the user info and user event info etc. in one request.
login.post("/", async (req, res) => {
  console.log(req.body)
  let user
  try {
    user = await query(`SELECT * FROM users WHERE email='${req.body.email}'`)
  } catch (error) {
    res.send({ error: error })
  }
  console.log(user)
  // Check if user exists
  if (user.length <= 0) {
    res.send({ authError: "Email or password is incorrect" })
    return
  }

  // check password
  const userPassword = user[0].password
  let result = await bcrypt.compare(req.body.password, userPassword)
  //!!!^Requires error checking in case bcrypt unable to compare passwords
  if (!result) {
    res.send({ authError: "Email or password is incorrect" })
  }

  // Retrieve user entry from users_info as well
  let userInfo
  try {
    [userInfo] = await query(`SELECT * FROM users_info WHERE id=${user[0].user_info}`)
  } catch (error) {
    res.send({ error: error })
  }

  // Retrieve events info
  let events = {
    private: [],
    public: [],
  }
  try {
    events.private = await query(
      `SELECT 
        id, 
        ownerId, 
        eventName, 
        DATE_FORMAT(startDate,'%Y-%m-%d') AS "startDate", 
        DATE_FORMAT(endDate,'%Y-%m-%d') AS "endDate",
        repeatWeekly,
        weeklySchedule,
        time,
        locationName,
        lat,
        lng,
        code
      FROM events_private WHERE ownerId=${user[0].id}`
    )
    events.public = await query(
      `SELECT 
        id, 
        ownerId, 
        eventName, 
        DATE_FORMAT(startDate,'%Y-%m-%d') AS "startDate", 
        DATE_FORMAT(endDate,'%Y-%m-%d') AS "endDate",
        repeatWeekly,
        weeklySchedule,
        time,
        locationName,
        lat,
        lng,
        code,
        attendees
      FROM events_public WHERE ownerId=${user[0].id}`)
  } catch (error) {
    res.send({ error: error })
  }

  console.log(events)

  user = user[0]
  // All necessary information retrieve from database. Sent to user:
  res.send({ user, userInfo, events }).status(200)
})

module.exports = login
