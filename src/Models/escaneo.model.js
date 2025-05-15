import { mysql } from '../Config/db.js';

export const obtenerEscaneosPorReporte = async (id) => {
    const [rows] = await mysql.query('SELECT * FROM escaneos WHERE id_reporte = ?', [id]);
    return rows;
};
