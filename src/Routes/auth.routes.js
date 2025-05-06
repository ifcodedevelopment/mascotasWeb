import { Router } from "express"
import { authLogin } from "../Controllers/auth.controller.js";

const router = Router()

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Verifica las credenciales del usuario. Si la cuenta está activada, retorna sus datos y un JWT. Si no, envía un correo con el enlace de activación.
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: segura123
 *               token:
 *                 type: string
 *                 description: Token del dispositivo (opcional, para notificaciones push u otras funciones)
 *                 example: fcm_token_opcional
 *     responses:
 *       200:
 *         description: Usuario autenticado correctamente
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                           example: Juan
 *                         apellidoPaterno:
 *                           type: string
 *                           example: Pérez
 *                         apellidoMaterno:
 *                           type: string
 *                           example: López
 *                         fechaNacimiento:
 *                           type: string
 *                           format: date
 *                           example: 1995-06-15
 *                         sexo:
 *                           type: string
 *                           enum: [M, F]
 *                           example: M
 *                         email:
 *                           type: string
 *                           format: email
 *                           example: juan.perez@example.com
 *                         password:
 *                           type: string
 *                           example: segura123
 *                         token:
 *                           type: string
 *                           description: JWT generado para autenticación
 *                           example: eyJhbGciOiJIUzI1NiIsInR5cCI6...
 *                         img:
 *                           type: string
 *                           example: http://localhost:3000/uploads/perfil.jpg
 *       404:
 *         description: Usuario no activado o credenciales inválidas
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
 *                       example: El usuario y/o contraseña son incorrectos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/auth/login', authLogin)

export default router;