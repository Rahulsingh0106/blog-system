import jwt from "jsonwebtoken"
import dotenv  from "dotenv";
dotenv.config();
export const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWt_SECRET,
        {expiresIn: "7d"}
    );
}