import { mysql } from '../Config/db.js';
import { ID_ESTATUS_USUARIO_ACTIVO, ID_ESTATUS_USUARIO_REGISTRO } from '../Config/constants.js';
import { getDate } from '../Utils/date.helper.js';

export const obtenerUsuarioPorEmail = async (email) => {
    const [rows] = await mysql.query('SELECT * FROM usuarios WHERE us_email = ?', [email]);
    return rows[0];
};

export const obtenerUsuarioPorId = async (id) => {
    const [rows] = await mysql.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
    return rows[0];
};

export const obtenerCodigoPorUsuario = async (id) => {
    const [rows] = await mysql.query(`SELECT MD5(CONCAT(id_usuario,'_', us_email)) AS code FROM usuarios WHERE id_usuario = ? `, [id]);
    return rows[0];
}

export const obtenerUsuarioPorEmailPassword = async (email, password) => {
    const [rows] = await mysql.query('SELECT * FROM usuarios WHERE us_email = ? AND us_password = ?', [email, password]);
    return rows[0];
};


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

export const actualizarUsuario = async (id, data) => {
    const [result] = await mysql.query(
        `UPDATE usuarios
            SET us_apellido_p= ?, us_apellido_m = ? , us_nombre = ?, us_fecha_nac = ?, us_sexo = ?, us_telefono = ?, us_telefono_fijo = ?, us_fecha_updated = ? WHERE id_usuario = ?`, [
        data.apellidoP,
        data.apellidoM,
        data.nombre,
        data.fechaNac,
        data.sexo,
        data.telefono,
        data.telefonoFijo,
        getDate('Y-m-d H:i:s'),
        id
    ]
    )
    return {
        affectedRows: result.affectedRows
    };
}

export const validarCuentaPorCodigo = async (codigo) => {
    const [row] = await mysql.query(`SELECT * FROM usuarios WHERE MD5(CONCAT(id_usuario,'_', us_email)) = ? `, [codigo]);
    return row[0];
}

export const activarCuentaUsuario = async (id) => {
    const [result] = await mysql.query(`UPDATE usuarios SET id_estatus_usuarios = ? WHERE id_usuario = ?`, [ID_ESTATUS_USUARIO_ACTIVO, id]);
    return {
        affectedRows: result.affectedRows
    };
}

export const guardarCodigoRecuperacion = async (codigo, id) => {
    const [result] = await mysql.query(`UPDATE usuarios SET us_codigo_app = ? WHERE id_usuario = ?`, [codigo, id]);
    return {
        affectedRows: result.affectedRows
    };
}

export const updatePasswordUsuario = async (password, id) => {
    const [result] = await mysql.query(`UPDATE usuarios SET us_password = ?, us_codigo_app = ? WHERE id_usuario = ?`, [password, null, id]);
    return {
        affectedRows: result.affectedRows
    };
}

export const updateTokenUsuario = async (token, id) => {
    const [result] = await mysql.query(`UPDATE usuarios SET us_token = ? WHERE id_usuario = ?`, [token, id]);
    return {
        affectedRows: result.affectedRows
    };
}

export const updateFotoUsuario = async (imagen, id) => {
    const [result] = await mysql.query(`UPDATE usuarios SET us_foto = ? WHERE id_usuario = ?`, [imagen, id]);
    return {
        affectedRows: result.affectedRows
    }
}

export const updateEmailUsuario = async (email, id) => {
    const [result] = await mysql.query(`UPDATE usuarios SET us_email = ? WHERE id_usuario = ?`, [email, id]);
    return {
        affectedRows: result.affectedRows
    }
}