import mongoose from "mongoose";

export const db = () => {
    mongoose.connect("mongodb+srv://rahulsingh01062000:rahul4626l@cluster0.oklqumj.mongodb.net/next-auth-kit?retryWrites=true&w=majority&appName=Cluster0s");
    console.log("DB connected successfully")
}

