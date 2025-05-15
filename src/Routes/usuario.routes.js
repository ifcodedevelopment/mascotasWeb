import { Router } from "express"
import { addUsuario, sendCodigoRecuperacion, setActivacionCuenta, setValidacionCodigo, updatePassword, updateUsuario } from "../Controllers/usuario.controller.js";
import { validarToken } from "../Middleware/auth.middleware.js";

const router = Router();

/**
 * Metodos usuarios
 */

/**
 * @swagger
 * /usuario:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     description: Registra un nuevo usuario si el correo no existe previamente, valida el esquema con Joi, guarda los datos y envía un email de activación.
 *     tags:
 *       - Usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombres
 *               - ape_paterno
 *               - ape_materno
 *               - fecha_nacimiento
 *               - sexo
 *               - telefono_personal
 *               - correo
 *               - password
 *             properties:
 *               nombres:
 *                 type: string
 *                 example: Juan
 *               ape_paterno:
 *                 type: string
 *                 example: Pérez
 *               ape_materno:
 *                 type: string
 *                 example: López
 *               fecha_nacimiento:
 *                 type: string
 *                 format: date
 *                 example: 1995-06-15
 *               sexo:
 *                 type: string
 *                 enum: [M, F]
 *                 example: M
 *               telefono_personal:
 *                 type: string
 *                 example: "5544332211"
 *               telefono_fijo:
 *                 type: string
 *                 example: "55551234"
 *               correo:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "segura123"
 *     responses:
 *       200:
 *         description: Registro exitoso, correo enviado
 *       404:
 *         description: Error en la validación o el correo ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/usuario/add', addUsuario);

/**
 * @swagger
 * /usuario/activate/{activate}:
 *   get:
 *     summary: Activar cuenta de usuario
 *     description: Valida el código de activación enviado por correo y activa la cuenta si corresponde.
 *     tags:
 *       - Usuario
 *     parameters:
 *       - in: path
 *         name: activate
 *         required: true
 *         description: Código de activación
 *         schema:
 *           type: string
 *           example: "c4ca4238a0b923820dcc509a6f75849b"
 *     responses:
 *       200:
 *         description: HTML de éxito o estado correspondiente (ya activado, inválido)
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 *               example: "<html><body><h1>Cuenta activada correctamente</h1></body></html>"
 *       404:
 *         description: Código no válido o cuenta no encontrada
 */
router.get('/usuario/activate/:activate', setActivacionCuenta);

/**
 * @swagger
 * /usuario/recuperar/codigo:
 *   post:
 *     summary: Enviar código de recuperación por correo
 *     description: Envía un código de 6 dígitos al correo del usuario para permitir la recuperación de contraseña.
 *     tags:
 *       - Usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan.perez@example.com
 *     responses:
 *       200:
 *         description: Código enviado correctamente
 *       404:
 *         description: Correo no registrado o datos inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/usuario/recuperar/codigo', sendCodigoRecuperacion);

/**
 * @swagger
 * /usuario/validar/codigo:
 *   post:
 *     summary: Validar código de recuperación
 *     description: Verifica que el código ingresado sea válido para el usuario.
 *     tags:
 *       - Usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - codigo
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 5
 *               codigo:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Código válido
 *       404:
 *         description: Código inválido o usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/usuario/validar/codigo', setValidacionCodigo);

/**
 * @swagger
 * /usuario/update/password:
 *   post:
 *     summary: Actualizar la contraseña del usuario
 *     description: Permite cambiar la contraseña del usuario una vez validado el código de recuperación.
 *     tags:
 *       - Usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_usuario
 *               - password
 *             properties:
 *               id_usuario:
 *                 type: integer
 *                 example: 5
 *               password:
 *                 type: string
 *                 format: password
 *                 example: nuevaPassword123
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       404:
 *         description: Usuario no encontrado o datos incompletos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/usuario/update/password', updatePassword);


router.post('/usuario/update', validarToken, updateUsuario);

export default router;
