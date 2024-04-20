import mongoose from "mongoose"
import express from "express"

const app = express()




const port = process.env.PORT || 3000
const host = process.env.HOST

app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`)
})