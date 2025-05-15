import { mysql } from '../Config/db.js';
import { getDate } from '../Utils/date.helper.js';
export const obtenerGaleriaPorMascota = async (id) => {
    const [rows] = await mysql.query('SELECT * FROM galeria_mascotas WHERE id_mascota = ?', [id]);
    return rows;
}

export const insertarGaleria = async (idMascota, data) => {
    const [result] = await mysql.query(
        `INSERT INTO galeria_mascotas (id_mascota, gl_url, gl_favorito, gl_fecha_registro)
        VALUES(?,?,?,?)`, [
        idMascota,
        data.url,
        data.favorite,
        getDate('Y-m-d H:i:s')
    ]
    )
    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows
    };
}

export const eliminarGaleria = async (idMascota) => {
    const [result] = await mysql.query(`DELETE FROM galeria_mascotas WHERE id_mascota = ?`, idMascota);
    return {
        affectedRows: result.affectedRows
    };
}