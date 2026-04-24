import logger from "../Utils/logger.js";

export const errorHandler = (err, req, res, next) => {
    logger.error("Unhandled error", {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method
    })

    res.status(500).json({
        msg: "Something went wrong"
    })
}