import { Router } from "express";
import { validarToken } from "../Middleware/auth.middleware.js";
import { addReporte, closeReporte, editReporte, obtenerReportesPorMascotas } from "../Controllers/reporte.controller.js";

/**
 * Metodos reportes 
 */

const router = Router();

/**
 * @swagger
 * /reportes:
 *   post:
 *     summary: Obtener reportes por usuario autenticado
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reportes obtenidos correctamente
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
 *                       example: Reportes encontrados satisfactoriamente
 *                     mascotas:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reporte'
 *       401:
 *         description: Token no proporcionado o inválido
 *       500:
 *         description: Error del servidor
 */
router.post('/reportes', validarToken, obtenerReportesPorMascotas);

/**
 * @swagger
 * /reportes/add:
 *   post:
 *     summary: Agregar un nuevo reporte de mascota
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mascota
 *               - fecha_inicio
 *             properties:
 *               mascota:
 *                 type: integer
 *                 example: 12
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 example: 2024-04-10
 *               tiene_recompensa:
 *                 type: boolean
 *                 example: true
 *               cantidad:
 *                 type: number
 *                 example: 500
 *               adicional:
 *                 type: string
 *                 example: Se perdió en el parque central con collar rojo
 *     responses:
 *       200:
 *         description: Reporte agregado correctamente
 *       404:
 *         description: Mascota ya tiene un reporte activo o datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/reportes/add', validarToken, addReporte);

/**
 * @swagger
 * /reportes/edit:
 *   post:
 *     summary: Editar un reporte de mascota existente
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mascota
 *               - fecha_inicio
 *             properties:
 *               mascota:
 *                 type: integer
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *               fecha_fin:
 *                 type: string
 *                 format: date
 *               tiene_recompensa:
 *                 type: boolean
 *               cantidad:
 *                 type: number
 *               adicional:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reporte actualizado correctamente
 *       404:
 *         description: Mascota no tiene reporte abierto o error en los datos
 *       500:
 *         description: Error del servidor
 */
router.post('/reportes/edit', validarToken, editReporte);


/**
 * @swagger
 * /reportes/close:
 *   post:
 *     summary: Cerrar un reporte de mascota existente
 *     tags:
 *       - Reportes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - qrCode
 *             properties:
 *               qrCode:
 *                 type: string
 *                 description: Código QR asociado a la mascota cuyo reporte se desea cerrar
 *     responses:
 *       200:
 *         description: Reporte cerrado correctamente
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
 *                       example: "Se ha finalizado el reporte correctamente"
 *                     type:
 *                       type: integer
 *                       example: 1
 *       400:
 *         description: ID de usuario no proporcionado en el token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 response:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "ID de usuario no proporcionado en el token."
 *       404:
 *         description: Error de validación o recurso no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 response:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "Ha ocurrido un error, no existen reportes abiertos para esta mascota"
 *                     type:
 *                       type: integer
 *                       example: 2
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 response:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *                       example: "Ha ocurrido un error, intente nuevamente"
 *                     type:
 *                       type: integer
 *                       example: 3
 */
router.post('/reportes/close', validarToken, closeReporte);

export default router;