import { Router } from "express";
import { agregarMascotasUsuario, editarMascotasUsuario, obtenerMascotasUsuario, verFichaMascotaPorSha } from "../Controllers/mascota.controller.js";
import { validarToken } from "../Middleware/auth.middleware.js";

/**
 * Metodos Mascotas 
 */

const router = Router();

router.post('/mascotas', validarToken, obtenerMascotasUsuario);
router.post('/mascotas/add', validarToken, agregarMascotasUsuario);
router.post('/mascotas/update', validarToken, editarMascotasUsuario);
router.get('/:sha', verFichaMascotaPorSha);

export default router;