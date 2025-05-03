import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

import { obtenerCodigoPorUsuario, obtenerUsuarioPorEmailPassword, updateTokenUsuario } from "../Models/usuario.model.js";
import { authLoginSchema } from "../Validators/auth.validator.js"
import { EXPIRES_KEY_JWT, getDate, mailSend, SECRET_KEY_JWT } from '../Config/config.js';
import { ID_ESTATUS_USUARIO_ACTIVO } from '../Config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const template = path.join(__dirname, '../Views/view_template_active.html');

export const authLogin = async (req, res) => {
    const data = {
        email: req.body.email,
        password: req.body.password
    }

    const { error } = authLoginSchema.validate(data)
    if (!error) {
        const usuario = await obtenerUsuarioPorEmailPassword(data.email, data.password);
        if (usuario) {
            if (usuario.id_estatus_usuarios == ID_ESTATUS_USUARIO_ACTIVO) {
                if (req.body.token) {
                    const updateToken = await updateTokenUsuario(req.body.token, usuario.id_usuario);
                }
                res.json({
                    status: 200,
                    response: {
                        user: {
                            nombre: usuario.nombre,
                            apellidoPaterno: usuario.us_apellido_p,
                            apellidoMaterno: usuario.us_apellido_m,
                            fechaNacimiento: usuario.us_fecha_nac,
                            sexo: usuario.us_sexo,
                            email: usuario.us_email,
                            password: usuario.us_password,
                            token: jwt.sign({ id: usuario.id_usuario }, SECRET_KEY_JWT, { expiresIn: EXPIRES_KEY_JWT }),
                            img: req.protocol + '://' + req.get('host') + '/uploads/' + (usuario.us_foto != null ? usuario.us_foto : 'perfil.jpg')
                        }
                    }
                })

            } else {
                const codigo = await obtenerCodigoPorUsuario(usuario.id_usuario);

                let htmlContent = '';
                htmlContent = fs.readFileSync(template, 'utf8');

                const enlace = `${req.protocol}://${req.get('host')}/usuario/activate/${codigo.code}`;
                htmlContent = htmlContent.replace('{{ENLACE}}', enlace)
                htmlContent = htmlContent.replace('{{NOMBRE}}', usuario.us_nombre + ' ' + usuario.us_apellido_p + ' ' + usuario.us_apellido_m)
                htmlContent = htmlContent.replace('{{ENLACE2}}', enlace)
                htmlContent = htmlContent.replace('{{YEAR}}', getDate('Y'))

                const mail = {
                    to: usuario.us_email,
                    subject: 'Activación de Cuenta - Mascotas App',
                    content: htmlContent
                }
                const send_mail = await mailSend(mail)

                res.json({
                    status: 404,
                    response: {
                        text: 'La cuenta aún no ha sido activada, revisa tu bandeja de entrada y/o SPAM'
                    }
                })
            }
        } else {
            res.json({
                status: 404,
                response: {
                    text: 'El usuario y/o contraseña son incorrectos'
                }
            })
        }
    } else {
        res.json({
            status: 404,
            response: {
                text: 'Usuario y/o contraseña incorrectos'
            }
        })
    }

}