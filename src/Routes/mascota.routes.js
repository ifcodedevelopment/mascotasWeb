import { Router } from "express";
import { agregarMascotasUsuario, editarMascotasUsuario, verFichaMascotaPorSha } from "../Controllers/mascota.controller.js";
import { validarToken } from "../Middleware/auth.middleware.js";

/**
 * Metodos Mascotas 
 */

const router = Router();

/**
 * @swagger
 * /mascotas/add:
 *   post:
 *     summary: Agregar nueva mascota
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre_mascota
 *               - fecha_nacimiento
 *               - tipo
 *             properties:
 *               nombre_mascota:
 *                 type: string
 *                 example: Max
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 example: 2020-05-12
 *               tipo:
 *                 type: integer
 *                 description: 1 = Perro, 2 = Gato
 *                 example: 1
 *               raza:
 *                 type: string
 *               color:
 *                 type: string
 *               temperamento:
 *                 type: string
 *               caracteristicas:
 *                 type: string
 *               medicas:
 *                 type: string
 *               galery:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     favorite:
 *                       type: boolean
 *                     rotate:
 *                       type: string
 *     responses:
 *       200:
 *         description: Mascota agregada exitosamente
 *       404:
 *         description: Mascota duplicada o datos inválidos
 *       500:
 *         description: Error del servidor
 */
router.post('/mascotas/add', validarToken, agregarMascotasUsuario);

/**
 * @swagger
 * /mascotas/update:
 *   post:
 *     summary: Editar mascota existente
 *     tags:
 *       - Mascotas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_mascota
 *               - nombre_mascota
 *             properties:
 *               id_mascota:
 *                 type: integer
 *               nombre_mascota:
 *                 type: string
 *               fecha_nacimiento:
 *                 type: string
 *               tipo:
 *                 type: integer
 *               raza:
 *                 type: string
 *               color:
 *                 type: string
 *               temperamento:
 *                 type: string
 *               caracteristicas:
 *                 type: string
 *               medicas:
 *                 type: string
 *               galery:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                     favorite:
 *                       type: boolean
 *                     rotate:
 *                       type: string
 *     responses:
 *       200:
 *         description: Mascota actualizada exitosamente
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error del servidor
 */
router.post('/mascotas/update', validarToken, editarMascotasUsuario);

/**
 * @swagger
 * /{sha}:
 *   get:
 *     summary: Ver ficha de mascota por SHA
 *     tags:
 *       - Mascotas
 *     parameters:
 *       - in: path
 *         name: sha
 *         required: true
 *         schema:
 *           type: string
 *         description: Hash único generado para la ficha de la mascota
 *     responses:
 *       200:
 *         description: Ficha de la mascota renderizada
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: Página HTML renderizada
 *       404:
 *         description: Mascota no encontrada
 *       500:
 *         description: Error al renderizar la ficha
 */
router.get('/:sha', verFichaMascotaPorSha);

export default router;