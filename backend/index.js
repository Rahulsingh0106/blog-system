import dotenv from "dotenv";
import { metricMiddleware } from "./src/Middlewares/metrics.middleware.js";
import { errorHandler } from "./src/Middlewares/log.middleware.js";
dotenv.config();

import client from "./src/Utils/metrics.js";

import express from "express"
import morgan from "morgan";
import logger from "./src/Utils/logger.js";
import { db } from "./src/Config/db.js";

import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes.js";


import { createServer } from "http";
import { initSocket } from "./src/Config/socket.js";

const app = express();
const httpServer = createServer(app);
initSocket(httpServer);

app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}));
app.use(cookieParser())
app.use(metricMiddleware)
app.use(errorHandler)
app.use('/uploads', express.static('uploads'));

db();



app.use("/api/v1", router);
app.get("/metrics", async (req, res) => {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
});
const port = process.env.PORT || 5000;
httpServer.listen(port, () => logger.info(`Server is running on port ${port}`));