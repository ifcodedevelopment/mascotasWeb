import { mysql } from "../Config/db.js";
import { getDate } from "../Utils/date.helper.js";

export const obtenerReportePorMascota = async (id) => {
    const [rows] = await mysql.query('SELECT * from reportes WHERE id_mascota = ? AND rep_fin IS NULL', [id])
    return rows;
}

export const obtenerReportePorMascotasUsuarios = async (id) => {
    const [rows] = await mysql.query(`SELECT * FROM reportes r INNER JOIN mascotas m ON r.id_mascota = m.id_mascota WHERE id_usuario = ?`, id)
    return rows;
}

export const insertarReporte = async (data) => {
    const [result] = await mysql.query(`
        INSERT INTO reportes (id_mascota, rep_inicio, rep_recomensa, rep_monto_recompensa, rep_comentarios, rep_fecha_registro)
        VALUES (?, ?, ?, ?, ?, ?)`, [
        data.mascota, data.fechaInicio, data.tieneRecompensa, data.cantidad, data.adicional, getDate('Y-m-d H:i:s')
    ])
    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows
    };
}

export const actualizarReporte = async (id_reporte, data) => {
    const [result] = await mysql.query(`
        UPDATE reportes
        SET rep_inicio = ? , rep_fin = ?, rep_recomensa = ?, rep_monto_recompensa = ?, rep_comentarios = ?, rep_fecha_updated = ?
        WHERE id_mascota `, [
        data.fechaInicio, data.fechaFin, data.tieneRecompensa, data.cantidad, data.adicional, getDate('Y-m-d H:i:s'), id_reporte
    ])
    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows
    };
}

export const eliminarReporteMascota = async (idMascota) => {
  const [result] = await mysql.query(
    `DELETE FROM reportes WHERE id_mascota = ?`,
    idMascota
  );
  return {
    affectedRows: result.affectedRows,
  };
};