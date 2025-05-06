import { Router } from "express";
import { agregarMascotasUsuario, obtenerMascotasUsuario } from "../Controllers/mascota.controller.js";
import { validarToken } from "../Middleware/auth.middleware.js";

/**
 * Metodos Mascotas 
 */

const router = Router();

router.post('/mascotas', validarToken, obtenerMascotasUsuario);
router.post('/mascotas/add', validarToken, agregarMascotasUsuario);
export default router;