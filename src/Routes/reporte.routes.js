import { Router } from "express";
import { validarToken } from "../Middleware/auth.middleware.js";
import { addReporte, editReporte, obtenerReportesPorMascotas } from "../Controllers/reporte.controller.js";

/**
 * Metodos reportes 
 */

const router = Router();

router.post('/reportes', validarToken, obtenerReportesPorMascotas);
router.post('/reportes/add', validarToken, addReporte);
router.post('/reportes/edit', validarToken, editReporte);


export default router;