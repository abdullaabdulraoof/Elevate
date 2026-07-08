const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gym Management API",
      version: "1.0.0",
      description: "API documentation for Gym Management System",
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1",
      },
    ],

    // JWT Bearer Authentication
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter JWT token in the format: Bearer <your_token>",
        },
      },
    },
  },

  apis: ["./routes/*.js"],
};

module.exports = swaggerJsDoc(options);