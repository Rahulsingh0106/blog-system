import express from "express";
const router = express.Router();
import { login, logout, register } from "./src/Controllers/auth.controller.js";
import { protect } from "./src/Middlewares/auth.middleware.js";
import { posts, create } from "./src/Controllers/posts.controller.js";
import { getCSRFToken } from "./src/Controllers/security.controller.js";
import { verifyCSRF } from "./src/Middlewares/csrf.middleware.js";

router.get('/csrf-token', getCSRFToken);
router.post("/login", login);
router.post("/register", register);
router.get("/profile", protect, (req, res) => {
    res.json({
        status: true,
        data: req.user
    })
});
router.get("/posts", protect, posts)
router.post("/posts", protect, create)
router.get("/logout", logout)

export default router;