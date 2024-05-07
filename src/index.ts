import express from "express"
import User from "./User"
import type { User as userShema } from "../types/interfaces"

import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";
import logger from './logger';
import expressWinston from 'express-winston';

const port = process.env.PORT || 3000
const host = process.env.HOST

const app = express()
app.use(express.json())
app.use(expressWinston.logger({
    winstonInstance: logger,
    statusLevels: true,
    meta: false,
    colorize: true,
    msg(req, res) {
        return `Method: ${req.method} | URL: ${req.url} | Status: ${res.statusCode}`
    }
}))

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: `Simple REST APIs for`,
            contact: {
                email: 'elamraniy292@gmail.com',
            }
        },
        servers: [
            {
                url: `${host}:${port}`,
                description: 'main production server'
            },
        ],
        components: {
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        password: { type: 'string' }
                    },
                    required: ['name', 'email', 'password']
                }
            }
        }
    },
    tags: {
        name: 'users',
        description: 'all endpoints about this model'
    },
    apis: ['./swagger.yaml'],
};



app.get("/users", async (req, res) => {
    try {
        const users: Array<userShema> = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ 
            status: res.statusCode,
            message: 'no users found',})
    }
});

app.get("/users/:id",
    async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.json(user);
        } catch (err) {
            res.status(500).json({ 
                status: res.statusCode,
                message: 'no user found' 
            });
        }
    }
);

app.post('/users', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    try {
        const newUser = await user.save();
        res.json(newUser);
    } catch (err) {
        res.status(500).json({ 
            status: res.statusCode,
            message: 'user not created' });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            user.name = req.body.name;
            user.email = req.body.email;
            user.password = req.body.password;
            const updatedUser = await user.save();
            res.json(updatedUser);
        }
    } catch (err) {
        res.status(500).json({ 
            status: res.statusCode,
            message: 'user not updated' })
    }
})

app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {

            await user.deleteOne();
            res.json({ 
                status: res.statusCode,
                message: 'user removed' });
        }
    } catch (err) {
        res.status(500).json({ message: 'user not removed' });
    }
}
);



const swaggerDocs = swaggerJSDoc(swaggerOptions);
// console.log(swaggerDocs); // Check the content of swaggerDocs

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerDocs));


app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`)
})