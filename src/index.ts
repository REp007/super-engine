import mongoose from "mongoose"
import express from "express"
import User from "./User"
import type { User as userShema } from "../types/interfaces"

const app = express()
app.use(express.json())



app.get("/", async (req, res) => {
    try{
        const users:Array<userShema> = await User.find();
        res.json(users);
    }catch(err){
        res.status(500).json({message: 'no users found'})
    }
});


app.get("/users/:id", 
    async (req, res) => {
        try{
            const user = await User.findById(req.params.id);
            res.json(user);
        }catch(err){
            res.status(500).json({message: 'no user found'})
        }
    }
);




const port = process.env.PORT || 3000
const host = process.env.HOST

app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`)
})