import { registerUser, loginUser } from "../Services/auth.services.js";

export const register = async(req, res) => {
    try {
        const user =  await registerUser(req.body);
        res.send({status: true, data: user, msg: "User registered successfully."});
    } catch (error) {
        res.send({status: false, data:{}, msg: "Something went wrong! Please try again later."});
    }
}

export const login = async(req, res) => {
    try {
        const user = await loginUser(req.body);
        res.send({status: true, data: user, msg: "User get logged in successfully."})
    } catch (error) {
        res.send({status: false, data:{}, msg: "Something went wrong! Please try again later."});
    }
}