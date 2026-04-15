import express from "express"
import { db } from "./src/Config/db.js";
import { login, register } from "./src/Controllers/auth.controller.js";
import { protect } from "./src/Middlewares/auth.middleware.js";
import { posts, create } from "./src/Controllers/posts.controller.js";
import { getCSRFToken } from "./src/Controllers/security.controller.js";
import { verifyCSRF } from "./src/Middlewares/csrf.middleware.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser())
db();

app.get('/csrf-token', getCSRFToken);


app.post("/login", login);
app.post("/register", register);
app.get("/profile", protect, (req, res) => {
    res.json({
        status: true,
        data: req.user
    })
});
app.get("/posts", protect, posts)
app.post("/posts", protect, create)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running"))