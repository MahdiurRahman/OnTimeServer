const apiRouter = require("express").Router();

apiRouter.get("/", (req, res) => {
    const res_string = "Welcome to OnTime API's route instructions. You can try the following routes:\n\n\t/api/register\n\t/api/add_event";
    res.send(res_string);
});

module.exports = apiRouter;