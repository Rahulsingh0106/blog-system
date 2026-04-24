import express from "express";
const router = express.Router();
import { login, logout, register, updateProfile } from "./src/Controllers/auth.controller.js";
import { protect } from "./src/Middlewares/auth.middleware.js";
import { upload } from "./src/Middlewares/uploads.middleware.js";
import { posts, create, update, getPostById, deletePostById } from "./src/Controllers/posts.controller.js";
import { getCSRFToken } from "./src/Controllers/security.controller.js";
import { verifyCSRF } from "./src/Middlewares/csrf.middleware.js";


// auth APIs
router.get('/csrf-token', getCSRFToken);
router.post("/login", login);
router.post("/register", register);
router.get("/logout", logout)
router.get("/profile", protect, (req, res) => {
    res.json({
        status: true,
        data: req.user
    })
});
router.put("/profile/update", protect, upload.single('image'), updateProfile);

// post APIs
router.get("/posts", protect, posts)
router.post("/posts/create", protect, verifyCSRF, create)
router.post("/posts/update", protect, verifyCSRF, update)
router.get("/posts/:id", protect, getPostById)
router.get("/posts/delete/:id", protect, verifyCSRF, deletePostById)
export default router;