import client from "prom-client";

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

export const requestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total number of requests"
});

export const httpDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duration of HTTP requests in seconds",
    labelNames: ["method", "route", "status"],
    buckets: [0.1, 0.5, 1, 2, 5]
});

export const errorCounter = new client.Counter({
    name: "http_errors_total",
    help: "Total number of errors",
    labelNames: ["route", "status"]
});

export default client;