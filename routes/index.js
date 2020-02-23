const apiRouter = require("express").Router();
const register = require("../routes/register");

apiRouter.get("/", (req, res) => {
    const res_string = "Welcome to OnTime API's route instructions. You can try the following routes:\n\n\t/api/register\n\t/api/add_event";
    res.send(res_string);
});

apiRouter.use("/register", register);

module.exports = apiRouter;