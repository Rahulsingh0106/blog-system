import { registerUser, loginUser, updateUserProfile } from "../Services/auth.services.js";
import redisClient from "../Config/redis.js";

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            status: true,
            data: user.user,
            msg: "User registered successfully."
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            data: {},
            msg: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await loginUser(req.body);
        res.cookie("token", user.token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            status: true,
            data: user['user'],
            msg: "User logged in successfully."
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            data: {},
            msg: error.message
        })
    }
}

export const logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            // Blacklist the token in Redis for 24 hours (matching maxAge)
            await redisClient.set(token, "blacklisted", {
                EX: 24 * 60 * 60
            });
        }
        res.clearCookie("token");
        res.status(200).json({
            status: true,
            data: {},
            msg: "User logged out successfully."
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            data: {},
            msg: "Something went wrong"
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = `/uploads/${req.file.filename}`;
        }
        
        const user = await updateUserProfile(updateData, req.user.id);
        res.clearCookie("token");
        res.cookie("token", user.token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({
            status: true,
            data: user.user,
            msg: "User updated successfully."
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            data: {},
            msg: error.message
        })
    }
}