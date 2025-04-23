import { usuarioAddSchema } from "../Validators/usuario.validator.js";
import { obtenerUsuarioPorEmail, insertarUsuario, obtenerCodigoPorUsuario, validarCuentaPorCodigo, activarCuentaUsuario } from "../Models/usuario.model.js";
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDate, mailSend } from "../Config/config.js";
import { ID_ESTATUS_USUARIO_REGISTRO } from "../Config/constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, '../Views/view_template_active.html');
const templateActivate = path.join(__dirname, '../Views/view_html_activacion.html');
const templateActivate2 = path.join(__dirname, '../Views/view_html_activacion_2.html');
const template404 = path.join(__dirname, '../Views/view_html_404.html');


export const addUsuario = async (req, res) => {
    try {
        const params = {
            nombre: req.body.nombres,
            apellidoP: req.body.ape_paterno,
            apellidoM: req.body.ape_materno,
            fechaNac: req.body.fecha_nacimiento,
            sexo: req.body.sexo,
            telefono: req.body.telefono_personal,
            telefonoFijo: req.body.telefono_fijo,
            email: req.body.correo,
            password: req.body.password
        }

        const { error } = usuarioAddSchema.validate(params)

        if (!error) {
            //Validacion email existente
            const usuarioExistente = await obtenerUsuarioPorEmail(params.email);

            //si existe el usuario marca error 404
            if (usuarioExistente) {
                return res.json({
                    status: 404,
                    response: {
                      text: 'Ya existe un usuario con ese email, favor de validar su información'
                    }
                  });
            }

            //si no existe se inserta el usuario
            const insert = await insertarUsuario(params);

            if (insert.affectedRows > 0) {
                const codigo = await obtenerCodigoPorUsuario(insert.insertId);
                
                let htmlContent = '';
                htmlContent = fs.readFileSync(templatePath, 'utf8');
                
                const enlace = `${req.protocol}://${req.get('host')}/usuario/activate/${codigo.code}`;
                htmlContent = htmlContent.replace('{{ENLACE}}', enlace)
                htmlContent = htmlContent.replace('{{NOMBRE}}', params.nombre + ' ' + params.apellidoP + ' ' + params.apellidoM)
                htmlContent = htmlContent.replace('{{ENLACE2}}', enlace)
                htmlContent = htmlContent.replace('{{YEAR}}', getDate('Y'))                

                const mail = {
                    to: params.email,
                    subject: 'Activación de Cuenta - Mascotas App',
                    content: htmlContent
                }
                const send_mail = await mailSend(mail)

                res.json({
                    status: 200,
                    response: {
                        text: 'Se ha enviado un correo para verificar su cuenta'
                    }
                })
            } else {
                res.json({
                    status: 404,
                    response: {
                        text: 'Ha ocurrido un error, intente nuevamente'
                    }
                })
            }
        } else {
            res.json({
                status: 404,
                response: {
                    text: 'Ha ocurrido un error, favor de validar su información'
                }
            })
        }
    } catch (error) {
        res.json({
            status: 500,
            response: {
                //text: `Someting goes wrong ${error}`
                text: 'Ha ocurrido un error, intente nuevamente'
            }
        })  
    }
}

export const setActivacionCuenta = async(req, res) => {
    const validacion = await validarCuentaPorCodigo(req.params.activate);
    if(validacion != null){
        if(validacion.id_estatus_usuarios == ID_ESTATUS_USUARIO_REGISTRO){
            const actualizar = activarCuentaUsuario(validacion.id_usuario);
            res.sendFile(templateActivate)
        } else {
            res.sendFile(templateActivate2)
        }
    } else {
        res.sendFile(template404)
    }
}