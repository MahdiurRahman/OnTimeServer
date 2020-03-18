const axios = require("axios")

axios.post("http://localhost:8080/api/login", {
    email: "john@email.com",
    password: "password"
}).then(async res => {
    console.log("RESULT:", res.data)
    console.log("TYPE:", typeof(res.data))
})