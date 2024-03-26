export const options = {
    definition: {
        openapi: "3.1.0",
        info: {
            title: "React Native Trekker Pilot Backend",
            version: "0.1.0",
            description: "Trekker Pilot API",
        },
        servers: [
            {
                url: "https://3f17brkk-8000.euw.devtunnels.ms/",
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./swagger/schemas/*.ts','./swagger/routes/*.ts'],
};