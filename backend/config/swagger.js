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
    },
  },

  schemas: {
    LoginRequest: {
      type: "object",
      required: ["email", "password"],
      properties: {
        email: {
          type: "string",
          example: "admin@gym.com",
        },
        password: {
          type: "string",
          example: "Password@123",
        },
      },
    },

    RegisterRequest: {
      type: "object",
      required: ["username", "email", "password"],
      properties: {
        username: {
          type: "string",
          example: "abdulla",
        },
        email: {
          type: "string",
          example: "abdulla@gmail.com",
        },
        password: {
          type: "string",
          example: "Password@123",
        },
        phone: {
          type: "string",
          example: "9876543210",
        },
        age: {
          type: "integer",
          example: 25,
        },
        gender: {
          type: "string",
          example: "male",
        },
      },
    },
  },
},
  },

  apis: ["./routes/*.js"],
};

module.exports = swaggerJsDoc(options);