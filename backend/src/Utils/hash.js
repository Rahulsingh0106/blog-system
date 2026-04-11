import bcrypt from "bcryptjs";

export const hashedPassword = async (data) => {
    return await bcrypt.hash(data,10);
}

export const comparePassword = async (password, hashed) => {
    return await bcrypt.compare(password, hashed);
}