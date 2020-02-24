const PORT = process.env.PORT || 8080;
const express = require("express");
const { db } = require("./database/connection");
const bodyParser = require("body-parser");

// Run manual entry commands:
    // require("./database/manual_entry");

// 'app' middlewares:
const app = express();
const apiRouter = require("./routes/index");
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/api", apiRouter);

app.listen(PORT, () => {
    console.log(`Server started on localhost:${PORT}`);
});
