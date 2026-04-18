import User from "../Models/user.model.js"
import { hashedPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";
import { validateRegister, validateLogin, validateUpdateProfile } from "../Validations/auth.validate.js";
export const registerUser = async (data) => {
    const { error } = validateRegister(data);
    if (error) throw new Error(error.details[0].message);
    const exist = await User.findOne({ email: data['email'] });
    if (exist) throw new Error("User already exist");

    const hashed = await hashedPassword(data['password']);
    const user = await User.create({
        ...data,
        password: hashed
    })

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj };
}

export const loginUser = async ({ email, password }) => {
    const { error } = validateLogin({ email, password });
    if (error) throw new Error(error.details[0].message);

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isValid = await comparePassword(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    const token = await generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
}

export const updateUserProfile = async (data, user_id) => {
    const { error } = validateUpdateProfile(data);
    if (error) throw new Error(error.details[0].message);

    const user = await User.findByIdAndUpdate(user_id, data, { new: true });
    if (!user) throw new Error("User not found");

    const token = await generateToken(user);
    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
}