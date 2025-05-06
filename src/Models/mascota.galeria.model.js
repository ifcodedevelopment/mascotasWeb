import { mysql } from '../Config/db.js';
export const obtenerGaleriaPorMascota = async (id) => {
    const [rows] = await mysql.query('SELECT * FROM galeria_mascotas WHERE id_mascota = ?', [id]);
    return rows;
}