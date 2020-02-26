const { query } = require("../database/connection")
const login = require("express").Router()
const bcrypt = require("bcrypt")

login.post("/", async (req, res) => {
  let userInfo;
  try {
    userInfo = await query(`SELECT * FROM users WHERE email = '${req.body.email}';`);
  } catch (error) {
    res.send(error)
  }
  // If a user with the specified email exists, check if the hashed password matches the hashed password in the database
  if (userInfo.length > 0) {
    const userPassword = userInfo[0].password;
    bcrypt.compare(req.body.password, userPassword, (error, passwordMatches) => {
      if (passwordMatches) {
        return res.send(`Logging in as ${req.body.email} `);
      } else {
        return res.send("Email or password is incorrect");
      }
    })
  } // User with the specified email does not exist
  else {
    return res.send("Email or password is incorrect");
  }
})

module.exports = login
