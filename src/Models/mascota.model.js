import { mysql } from '../Config/db.js';
import { getDate } from '../Utils/date.helper.js';
export const obtenerMascotasPorUsuario = async (id) => {
    const [rows] = await mysql.query('SELECT * FROM mascotas WHERE id_usuario = ?', [id]);
    return rows;
};

export const obtenerMascotasPorId = async (id) => {
    const [rows] = await mysql.query('SELECT * FROM mascotas WHERE id_mascota = ?', [id]);
    return rows;
};

export const obtenerMascotaNombreFechaNac = async (nombre, fechaNac) => {
    const [rows] = await mysql.query('SELECT * FROM mascotas WHERE ms_nombre = ? AND ms_fecha_nac = ?', [nombre, fechaNac]);
    return rows;
}

export const insertarMascota = async (data) => {
    const [result] = await mysql.query(
        `INSERT INTO mascotas 
            (id_usuario, ms_nombre, ms_fecha_nac, ms_tipo, ms_raza, ms_color, ms_temperamento, ms_caracteristicas, ms_medicas, ms_fecha_registro)
            VALUES(?,?,?,?,?,?,?,?,?,?)`, [
        data.idUsuario,
        data.nombreMascota,
        data.fechaNacimiento,
        data.tipo,
        data.raza,
        data.color,
        data.temperamento,
        data.caracteristicas,
        data.medicas,
        getDate('Y-m-d H:i:s')
    ]
    );

    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows
    };
}

export const updateUrlQR = async (ruta, id) => {
    const [result] = await mysql.query(`UPDATE mascotas SET ms_qr = ? WHERE id_mascota = ?`, [ruta, id]);
    return {
        affectedRows: result.affectedRows
    };
}

export const actualizarMascota = async (id, data) => {
    const [result] = await mysql.query(
        `UPDATE mascotas SET
            ms_nombre = ?, ms_fecha_nac = ?, ms_tipo = ?, ms_raza = ?, ms_color = ?, ms_temperamento = ?, ms_caracteristicas = ? , ms_medicas = ? , ms_fecha_update = ?
            WHERE id_mascota = ?`, [
        data.nombreMascota,
        data.fechaNacimiento,
        data.tipo,
        data.raza,
        data.color,
        data.temperamento,
        data.caracteristicas,
        data.medicas,
        getDate('Y-m-d H:i:s'),
        id
    ]
    );

    return {
        affectedRows: result.affectedRows
    };
}