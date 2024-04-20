import mongoose from "mongoose"

mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.0")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);
