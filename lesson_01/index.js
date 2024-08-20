const express = require("express");
const { logger } = require("./middleware/logger.js");
const errorHandler = require("./middleware/errorHandler.js");
const path = require("path");

const PORT = process.env.PORT || 3500;

const app = express();

app.use(logger);
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root.js"));

app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    } else if (req.acceptsEncodings("json")) {
        res.json({ message: "404 - Not Found" });
    } else {
        res.type("txt").send("404 - Not Found")
    }
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
