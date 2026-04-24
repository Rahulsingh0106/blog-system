import { requestCounter, httpDuration } from "../Utils/metrics.js";

export const metricMiddleware = (req, res, next) => {
    requestCounter.inc();

    const start = Date.now();
    res.on("finish", () => {
        const duration = (Date.now() - start) / 1000;
        httpDuration.observe(duration)
    })
    next();
}