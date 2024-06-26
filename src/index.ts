import express from "express"
import swaggerJSDoc from "swagger-jsdoc";
import SwaggerUi from "swagger-ui-express";
import logger from './logger';
import expressWinston from 'express-winston';
import router from '../routes/userRoute';

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

app.use('/users', router);


const swaggerDocs = swaggerJSDoc(swaggerOptions);
// console.log(swaggerDocs); // Check the content of swaggerDocs

app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(swaggerDocs));


app.listen(port, () => {
    console.log(`Server is running on ${host}:${port}`)
})