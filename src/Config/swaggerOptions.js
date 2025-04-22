import { HOST, PORT } from "./config.js";

export const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "API Mascotas",
        version: "1.0.0",
        description: "Documentación de la API con Swagger",
      },
      servers: [
        {
          url: `${HOST}:${PORT}`,
        },
      ],
    },
    apis: ["./src/Routes/*.js"]
  };
  