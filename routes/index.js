const apiRouter = require("express").Router();
const register = require("../routes/register");
const login = require("../routes/login");
const testRoute = require("../routes/testRoute");
const events = require("../routes/events");
const notifications = require("./notifications_routes/notifications");
const favorites = require("./favorites");
const user = require("./user");
const search = require("./search");

apiRouter.get("/", (req, res) => {
    const res_string = "Welcome to OnTime API's route instructions. You can try the following routes:\n\n\t/api/register\n\t/api/add_event";
    res.send(res_string);
});

apiRouter.use("/register", register);
apiRouter.use("/login", login);
apiRouter.use("/test", testRoute);
apiRouter.use("/events", events);
apiRouter.use("/notifications", notifications);
apiRouter.use("/favorites", favorites);
apiRouter.use("/user", user);
apiRouter.use("/search", search);

module.exports = apiRouter;