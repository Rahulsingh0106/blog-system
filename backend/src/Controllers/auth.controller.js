import { registerUser, loginUser } from "../Services/auth.services.js";

export const register = async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({
            status: true,
            data: user,
            msg: "User registered successfully."
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            data: {},
            msg: "Something went wrong"
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await loginUser(req.body);
        res.status(200).json({
            status: true,
            data: user,
            msg: "User logged in successfully."
        })
    } catch (error) {
        res.status(400).json({
            status: false,
            data: {},
            msg: "Something went wrong"
        })
    }
}