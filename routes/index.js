const apiRouter = require("express").Router();
const register = require("../routes/register");
const login = require("../routes/login");
const testRoute = require("../routes/testRoute");
const createEvent = require("../routes/createEvent");

apiRouter.get("/", (req, res) => {
    const res_string = "Welcome to OnTime API's route instructions. You can try the following routes:\n\n\t/api/register\n\t/api/add_event";
    res.send(res_string);
});

apiRouter.use("/register", register);
apiRouter.use("/login", login);
apiRouter.use("/test", testRoute);
apiRouter.use("/createEvent", createEvent);

module.exports = apiRouter;