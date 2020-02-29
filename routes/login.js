const { query } = require("../database/connection")
const login = require("express").Router()
const bcrypt = require("bcrypt")


// This route, the way it is, will have to make several requests to the db. We could try creating a huge query like the one from Raman's class where it gets all the user info and user event info etc. in one request.
login.post("/", async (req, res) => {
  let user;
  try {
    user = await query(`SELECT * FROM users WHERE email='${req.body.email}'`);
  } catch (error) {
    res.send(error)
  }

  // Check if user exists
  if (user.length <= 0) {
    res.send(`No user with that email address`);
    return;
  }

  // Retreive user entry from users_info as well
  let userInfo;
  try {
    userInfo = await query(`SELECT * FROM users_info WHERE id=${user[0].user_info}`)
  } catch (error) {
    res.send(error);
  }

  // Retreive events info
  let userEvents;
  try {
    userEvents = await query(`SELECT * FROM events WHERE ownerId=${user[0].id}`)
  } catch (error) {
    res.send(error);
  }

  // All nessecary information retreive from database. Sent to user:
  res.send({user, userInfo, userEvents}).status(200);
})

module.exports = login
