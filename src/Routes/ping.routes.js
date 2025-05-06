import { Router } from "express";
import { ping } from "../Controllers/ping.controller.js";

/**
 * Metodos Ping 
 */

const router = Router();

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Verifica conexión con la base de datos
 *     description: Retorna la fecha y hora actual desde MySQL para confirmar que la conexión está activa.
 *     tags:
 *       - Test de conexión a la BD
 *     responses:
 *       200:
 *         description: Fecha y hora actual
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 NOW():
 *                   type: string
 *                   format: date-time
 *                   example: "2025-04-22T16:02:53.000Z"
 */
router.get('/ping', ping)

export default router;