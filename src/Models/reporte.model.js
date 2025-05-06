import { mysql } from "../Config/db.js";

export const obtenerReportePorMascota = async (id) => {
    const [rows] = await mysql.query('SELECT * from reportes WHERE id_mascota = ? AND rep_fin IS NULL', [id])
    return rows;
}