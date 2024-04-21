import mongoose from "mongoose"
import express from "express"
import User from "./User"
import type { User as userShema } from "../types/interfaces"

import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";

const port = process.env.PORT || 3000
const host = process.env.HOST

const app = express()
app.use(express.json())


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'A sample API for learning Swagger',
        },
        servers: [
            {
                url: `${host}:${port}`,
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
    apis: ['./src/*.ts'],
};



/**
 * @openapi
 * /users:
 *   get:
 *     summary: Retrieve all users
 *     description: Get a list of all users.
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal Server Error
 */
app.get("/users", async (req, res) => {
    try {
        const users: Array<userShema> = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'no users found' })
    }
});

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     description: Get a single user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve.
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal Server Error
 */
app.get("/users/:id",
    async (req, res) => {
        try {
            const user = await User.findById(req.params.id);
            res.json(user);
        } catch (err) {
            res.status(500).json({ message: 'no user found' })
        }
    }
);

/**
 * @openapi
 * /users:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user with the provided name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal Server Error
 */
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
        res.status(500).json({ message: 'user not created' })
    }
});

/**
 * @openapi
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     description: Update an existing user's name, email, and password.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal Server Error
 */
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
        res.status(500).json({ message: 'user not updated' })
    }
})
/**
 * @openapi
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     description: Delete a user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to delete.
 *     responses:
 *       '200':
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Indicates the success of the operation.
 *       '500':
 *         description: Internal Server Error
 */
app.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {

            await user.deleteOne();
            res.json({ message: 'user removed' });
        }
    } catch (err) {
        res.status(500).json({ message: 'user not removed' })
    }
}
);



const swaggerDocs = swaggerJSDoc(swaggerOptions);
console.log(swaggerDocs); // Check the content of swaggerDocs

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerDocs));


app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`)
})