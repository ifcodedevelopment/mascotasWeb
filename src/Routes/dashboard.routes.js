import { Router } from "express";
import { validarToken } from "../Middleware/auth.middleware.js";
import { obtenerMascotasUsuario } from "../Controllers/dashboard.controller.js"; 
 
/**
 * Metodos Dashboard
 */

const router = Router();
/**
 * @swagger
 * /mascotas:
 *   post:
 *     summary: Obtener mascotas del usuario autenticado
 *     description: Devuelve las mascotas asociadas al usuario autenticado mediante JWT.
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de mascotas obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 200
 *                 response:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: Mascotas encontradas satisfactoriamente
 *                     mascotas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Mascota'
 *       401:
 *         description: Token no proporcionado o inválido
 *       500:
 *         description: Error del servidor
 */
router.post("/dashboard", validarToken, obtenerMascotasUsuario);

export default router;