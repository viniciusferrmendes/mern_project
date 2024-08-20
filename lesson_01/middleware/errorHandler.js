const { logEvents } = require("./logger.js");

const errorHandler = (error, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errorLog.log");
    console.log(error.stack);

    const status = res.statusCode ? res.status : 500 // Server Error

    res.status(status);
    res.json({ message: err.message });

};

module.exports = errorHandler;
