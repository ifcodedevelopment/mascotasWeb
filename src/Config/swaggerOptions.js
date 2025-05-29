import { HOST, PORT } from "./config.js";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Mascotas",
      version: "1.0.0",
      description: "Documentación de la API con Swagger",
    },
    tags: [
      {
        name: "Test de conexión a la BD",
        description: "Metodo de prueba de conexion hacia la BD",
      },
      { name: "Autenticación", description: "Inicio de sesión y validación" },
      { name: "Usuario", description: "Operaciones con usuarios" },
      { name: "Mascotas", description: "Operaciones con mascotas" },
      { name: "Reportes", description: "Manejo de reportes de mascotas" },
    ],
    servers: [
      {
        url: `${HOST}:${PORT}`,
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
    security: [{ bearerAuth: [] }],
  },
  apis: ["./src/Routes/*.js"],
};
  