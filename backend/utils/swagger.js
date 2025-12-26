import swaggerJSDoc from "swagger-jsdoc";

const port = process.env.port || 3000;

export const swaggerDefinitions = swaggerJSDoc({
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: '2iot-APIs',
            version: '1.0.0',
            description: '2iot-APIs',
        },
        servers: [
            {
                url: `http://localhost:${port}/api`,
            },
        ],
    },
    apis: [
        "../routes/*.js"
    ]
});