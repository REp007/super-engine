import mongoose, {Schema} from "mongoose"
// import type { User as userShema } from "../types/interfaces"
import dotenv from "dotenv";
dotenv.config();

mongoose.connect(process.env.MONGO_URI!)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err))

const userSchema = new Schema({
    name: String,
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);

export default User;