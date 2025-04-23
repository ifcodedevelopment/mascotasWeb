import { Router } from "express"

import { ping } from "../Controllers/ping.controller.js";
import { addUsuario, sendCodigoRecuperacion, setActivacionCuenta, setValidacionCodigo } from "../Controllers/usuario.controller.js";

const router = Router()

/**
 * Metodos Ping 
 */

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


router.post('/usuario/recuperar/codigo', sendCodigoRecuperacion);
router.post('/usuario/validar/codigo', setValidacionCodigo);

/*

// Vista genérica para la raíz
router.get('/', (req, res) => {
  res.render('index');
});

// Ruta dinámica con parámetro :sha
router.get('/:sha', (req, res) => {
  const { sha } = req.params;

  if (!sha || sha.trim() === '') {
    return res.redirect('/');
  }

  // Aquí podrías consultar la base de datos con el SHA
  res.render('fichaMascota', { sha });
});

*/

export default router
