import { usuarioAddSchema, usuarioEditSchema } from "../Validators/usuario.validator.js";
import { obtenerUsuarioPorEmail, insertarUsuario, obtenerCodigoPorUsuario, validarCuentaPorCodigo, activarCuentaUsuario, guardarCodigoRecuperacion, obtenerUsuarioPorId, updatePasswordUsuario, actualizarUsuario, updateFotoUsuario, updateEmailUsuario } from "../Models/usuario.model.js";
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getDate } from "../Utils/date.helper.js";
import { mailSend } from "../Utils/mail.helper.js";
import { ID_ESTATUS_USUARIO_REGISTRO } from "../Config/constants.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const template = path.join(__dirname, '../Views/view_template_active.html');
const templateActivate = path.join(__dirname, '../Views/view_html_activacion.html');
const templateActivate2 = path.join(__dirname, '../Views/view_html_activacion_2.html');
const template404 = path.join(__dirname, '../Views/view_html_404.html');
const templateReset = path.join(__dirname, '../Views/view_template_reset.html')


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
            if (usuarioExistente != null) {
                return res.json({
                    status: 404,
                    response: {
                        text: "Ya existe un usuario con ese email, favor de validar su información",
                        type: 2
                    },
                });
            }

            //si no existe se inserta el usuario
            const insert = await insertarUsuario(params);

            if (insert.affectedRows > 0) {
                const codigo = await obtenerCodigoPorUsuario(insert.insertId);

                let htmlContent = '';
                htmlContent = fs.readFileSync(template, 'utf8');

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
                        text: "Ha ocurrido un error, intente nuevamente",
                        type: 2
                    },
                });
            }
        } else {
            res.json({
                status: 404,
                response: {
                    text: "Ha ocurrido un error, favor de validar su información",
                    type: 3
                },
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            response: {
                text: `Someting goes wrong ${error}`,
                type: 3
                //text: 'Ha ocurrido un error, intente nuevamente'
            },
        });
    }
}

export const setActivacionCuenta = async (req, res) => {
    try {
        const validacion = await validarCuentaPorCodigo(req.params.activate);
        if (validacion != null) {
            if (validacion.id_estatus_usuarios == ID_ESTATUS_USUARIO_REGISTRO) {
                const actualizar = await activarCuentaUsuario(validacion.id_usuario);
                res.sendFile(templateActivate)
            } else {
                res.sendFile(templateActivate2)
            }
        } else {
            res.sendFile(template404)
        }
    } catch (error) {
        res.sendFile(template404)
    }
}

export const sendCodigoRecuperacion = async (req, res) => {
    try {
        if (req.body.email) {
            const usuario = await obtenerUsuarioPorEmail(req.body.email);
            if (usuario != null) {
                let htmlContent = '';
                htmlContent = fs.readFileSync(templateReset, 'utf8');

                const recoveryCode = Math.floor(100000 + Math.random() * 900000)
                htmlContent = htmlContent.replace('{{RECOVERY_CODE}}', recoveryCode)

                const mail = {
                    to: usuario.us_email,
                    subject: 'Codigo de Recuperación - Mascotas App',
                    content: htmlContent
                }

                const send_mail = await mailSend(mail)
                if (send_mail) {
                    const updateCodigo = await guardarCodigoRecuperacion(recoveryCode, usuario.id_usuario);
                }

                res.json({
                    status: send_mail ? 200 : 400,
                    response: {
                        text: send_mail
                            ? "Se ha enviado correctamente el código"
                            : "Ha ocurrido un error, intente nuevamente",
                        id_usuario: send_mail ? usuario.id_usuario : null,
                    },
                    type: send_mail ? 1 : 2
                });
            } else {
                res.json({
                    status: 404,
                    response: {
                        text: "El correo proporcionado no se encuentra registrado",
                        type: 3
                    },
                });
            }
        } else {
            res.json({
                status: 404,
                response: {
                    text: "Ha ocurrido un error, intente nuevamente",
                    type: 3
                },
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            response: {
                //text: `Someting goes wrong ${error}`
                text: "Ha ocurrido un error, intente nuevamente",
                type: 3
            },
        });
    }
}

export const setValidacionCodigo = async (req, res) => {
    try {
        if (req.body.id_usuario) {
            const usuario = await obtenerUsuarioPorId(req.body.id_usuario);
            if (usuario) {
                const regex = /^\d{6}$/;
                let valid = (!regex.test(req.body.codigo) || usuario.us_codigo_app == null || usuario.us_codigo_app != req.body.codigo ? false : true);
                if (valid) {
                    res.json({
                        status: 200,
                        response: {
                            text: "Codigo valido",
                            id_usuario: usuario.id_usuario,
                        },
                        type: 1
                    });
                } else {
                    res.json({
                        status: 404,
                        response: {
                            text: "El codigo introducido no es valido, favor de verificarlo",
                        },
                        type: 2
                    });
                }
            } else {
                res.json({
                    status: 404,
                    response: {
                        text: "Ha ocurrido un error, el usuario no existe",
                        type: 3
                    },
                });
            }
        } else {
            res.json({
                status: 404,
                response: {
                    text: "Ha ocurrido un error, intente nuevamente",
                    type: 3
                },
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            response: {
                //text: "Ha ocurrido un error, intente nuevamente" + error
                text: "Ha ocurrido un error, intente nuevamente",
                type: 3
            },
        });
    }
}

export const updatePassword = async (req, res) => {
    try {
        if (req.body.password && req.body.id_usuario) {
            const usuario = await obtenerUsuarioPorId(req.body.id_usuario);
            if (usuario) {
                const update = await updatePasswordUsuario(req.body.password, req.body.id_usuario);
                if (update) {
                    res.json({
                        status: 200,
                        response: {
                            text: "Se ha actualizado correctamente su contraseña",
                            type: 1
                        },
                    });
                } else {
                    res.json({
                        status: 404,
                        response: {
                            text: "Ha ocurrido un error, intente nuevamente",
                            type: 2
                        },
                    });
                }
            } else {
                res.json({
                    status: 404,
                    response: {
                        text: "El usuario no existe, favor de validar su información",
                        type: 3
                    },
                });
            }
        } else {
            res.json({
                status: 404,
                response: {
                    text: "Ha ocurrido un error, favor de validar su información",
                    type: 3
                },
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            response: {
                //text: "Ha ocurrido un error, intente nuevamente" + error
                text: "Ha ocurrido un error, intente nuevamente",
                type: 3
            },
        });
    }
}

export const updateUsuario = async (req, res) => {
    try {
        const idUsuario = req.idUsuario; // Middleware debe haberlo inyectado
        if (!idUsuario) {
            return res.status(400).json({
                status: 400,
                response: {
                    text: 'ID de usuario no proporcionado en el token.'
                }
            });
        }

        const params = {
            nombre: req.body.nombres,
            apellidoP: req.body.ape_paterno,
            apellidoM: req.body.ape_materno,
            fechaNac: req.body.fecha_nacimiento,
            sexo: req.body.sexo,
            telefono: req.body.telefono_personal,
            telefonoFijo: req.body.telefono_fijo,
            email: req.body.correo,
            password: req.body.password,
            imagen: req.body.imagen
        }

        const { error } = usuarioEditSchema.validate(params)

        if (!error) {
            //Validacion email existente con otro email
            const usuarioExistente = await obtenerUsuarioPorEmail(params.email);

            //si existe el usuario y no es el que se esta editando marca error 404
            if (usuarioExistente != null && usuarioExistente.id_usuario != idUsuario) {
                return res.json({
                    status: 404,
                    response: {
                        text: "Ya existe un usuario con ese email, favor de validar su información",
                        type: 2
                    },
                });
            }

            //si existe pero es el mismo usuario lo actualiza, si no marca error
            const update = await actualizarUsuario(idUsuario, params);

            if (update.affectedRows > 0) {
                if (params.password != null) {
                    const updatePassword = await updatePasswordUsuario(params.password, idUsuario);
                }


                if (params.imagen != null) {
                    const updateFoto = await updateFotoUsuario(params.imagen, idUsuario);
                }

                if (params.email != null) {
                    const updateEmail = await updateEmailUsuario(params.email, idUsuario);
                }

                res.json({
                    status: 200,
                    response: {
                        text: "Se ha actualizado la cuenta correctamente",
                        type: 1
                    },
                });
            } else {
                res.json({
                    status: 404,
                    response: {
                        text: "Ha ocurrido un error, intente nuevamente",
                        type: 2
                    },
                });
            }
        } else {
            res.json({
                status: 404,
                response: {
                    text: "Ha ocurrido un error, favor de validar su información",
                    type: 3
                },
            });
        }
    } catch (error) {
        res.json({
            status: 500,
            response: {
                text: `Someting goes wrong ${error}`,
                //text: "Ha ocurrido un error, intente nuevamente",
                type: 3
            },
        });
    }
}