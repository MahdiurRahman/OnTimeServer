const PORT = process.env.PORT || 8080;
const express = require("express");
const db = require("./database/connection");

// Run manual entry commands:
    // require("./database/manual_entry");

// 'app' middlewares:
const app = express();
const apiRouter = require("./routes/index");
app.use("/", apiRouter);

app.listen(PORT, () => {
    console.log(`Server started on localhost:${PORT}`);
});
