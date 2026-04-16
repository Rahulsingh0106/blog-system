import { registerUser, loginUser } from "../Services/auth.services.js";
import dotenv from "dotenv";
dotenv.config();

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