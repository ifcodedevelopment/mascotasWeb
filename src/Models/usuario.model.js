import { mysql } from '../Config/db.js';
import { ID_ESTATUS_USUARIO_REGISTRO } from '../Config/constants.js';
import { getDate } from '../Config/config.js';

export const obtenerUsuarioPorEmail = async (email) => {
    const [rows] = await mysql.query('SELECT * FROM usuarios WHERE us_email = ?', [email]);
    return rows[0];
};

export const obtenerCodigoPorUsuario = async (id) => {
    const [rows] = await mysql.query(`select MD5(CONCAT(id_usuario,'_', us_email)) as code from usuarios where id_usuario = ? `, [id]);
    return rows[0];
}

export const insertarUsuario = async (data) => {
    const [result] = await mysql.query(
         `INSERT INTO usuarios
            (id_estatus_usuarios, us_apellido_p, us_apellido_m, us_nombre, us_fecha_nac, us_sexo, us_telefono, us_telefono_fijo, us_email, us_password, us_fecha_registro)
            VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                ID_ESTATUS_USUARIO_REGISTRO,
                data.apellidoP,
                data.apellidoM,
                data.nombre,
                data.fechaNac,
                data.sexo,
                data.telefono,
                data.telefonoFijo,
                data.email,
                data.password,
                getDate('Y-m-d H:i:s')
            ]
    )
    return {
        insertId: result.insertId,
        affectedRows: result.affectedRows
    };
}

