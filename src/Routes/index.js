import { Router } from "express";
import pingRoutes from "../Routes/ping.routes.js";
import usuarioRoutes from "../Routes/usuario.routes.js";
import authRoutes from "../Routes/auth.routes.js";
import mascotaRoutes from "../Routes/mascota.routes.js";

const router = Router();

// Swagger
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { swaggerOptions } from "../Config/swaggerOptions.js";
const swaggerDocs = swaggerJsDoc(swaggerOptions);
router.use('/documentacion', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutas individuales
router.use(pingRoutes);
router.use(usuarioRoutes);
router.use(authRoutes);
router.use(mascotaRoutes);

export default router;