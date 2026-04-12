import User from "../models/user.model.js"
import { hashedPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const registerUser = async (data) => {
    const exist = await User.findOne({ email: data['email'] });
    if (exist) throw new Error("User already exist");

    const hashed = await hashedPassword(data['password']);
    const user = await User.create({
        ...data,
        password: hashed
    })
    return user;
}

export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const token = await generateToken(user);
    return { user, token };
}