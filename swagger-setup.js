const swaggerJsDoc = required("swagger-jsdoc");
const swaggerUi = required("swagger-ui-express");

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API REST noteApp Swagger Node.js",
    description: "RESTful API backend for noteApp",
    version: "1.0.0",
  },
  servers: [
    {
      url: "http://185.255.88.110:1766",
      description: "IP Local server",
    },
    {
      url: "http://localhost:2070",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const swaggerOptions = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const setupSwagger = (app) =>
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerJsDoc(swaggerOptions))
  );

module.exports = setupSwagger;
