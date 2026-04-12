import express from "express"
import { db } from "./src/Config/db.js";
import { login, register } from "./src/Controllers/auth.controller.js";
import { protect } from "./src/Middlewares/auth.middleware.js";
import { posts } from "./src/Controllers/posts.controller.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(express.json());
app.use(cors());
db();

app.post("/login", login);
app.post("/register", register);
app.get("/profile", protect, (req, res) => {
    res.json({
        status: true,
        data: req.user
    })
});
app.get("/posts", protect, posts)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log("Server is running"))