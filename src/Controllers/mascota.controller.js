import path from 'path';
import { fileURLToPath } from 'url';

import { mascotaDTO } from "../DTO/mascota.dto.js";
import { mascotaGaleriaDTO } from "../DTO/mascota.galeria.dto.js";
import { eliminarGaleria, insertarGaleria, obtenerGaleriaPorMascota } from "../Models/mascota.galeria.model.js";
import { actualizarMascota, eliminarMascota, insertarMascota, obtenerMascotaNombreFechaNac, obtenerMascotaPorSha, obtenerMascotasPorId, obtenerMascotasPorUsuario, updateUrlQR } from "../Models/mascota.model.js";
import { asegurarImagenFavorita } from "../Utils/galeria.helper.js";
import { hashMD5 } from "../Utils/hash.helper.js";
import { mascotaAddSchema, mascotaDeleteSchema, mascotaEditSchema } from "../Validators/mascota.validator.js";
import { generarQRConEstilo } from '../Utils/generarQRConEstilo.js';
import { guardarImagenBase64 } from '../Utils/file.helper.js';
import { obtenerUsuarioPorId } from '../Models/usuario.model.js';
import { eliminarReporteMascota } from '../Models/reporte.model.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const agregarMascotasUsuario = async (req, res) => {
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
            idUsuario: idUsuario,
            nombreMascota: req.body.nombre_mascota,
            fechaNacimiento: req.body.fecha_nacimiento,
            galery: [],
            tipo: req.body.tipo,
            raza: req.body.raza,
            color: req.body.color,
            temperamento: req.body.temperamento,
            caracteristicas: req.body.caracteristicas,
            medicas: req.body.medicas
        }

        const { error } = mascotaAddSchema.validate(params)
        if (!error) {
            //Validacion mascota existente
            const mascotaExistente = await obtenerMascotaNombreFechaNac(params.nombreMascota, params.fechaNacimiento);

            //si existe el usuario marca error 404
            if (mascotaExistente != null && mascotaExistente.id_usuario == idUsuario) {
                return res.json({
                    status: 404,
                    response: {
                        text: 'Ya existe una mascota con ese nombre y fecha de nacimiento, favor de validar su información',
                        type: 2
                    }
                });
            }

            // Asegura que haya una imagen favorita
            req.body.galery = asegurarImagenFavorita(req.body.galery);


            const insert = await insertarMascota(params);
            if (insert.affectedRows > 0) {
                const hash = `${req.protocol}://${req.get('host')}/${hashMD5('masc-' + insert.insertId + '-user-' + params.idUsuario)}`;
                const rutaLogo = path.join(__dirname, '../Assets/img/logo.jpeg');
                const qrBase64 = await generarQRConEstilo(hash, rutaLogo);
                const ruta = guardarImagenBase64(qrBase64, idUsuario, 'qr_' + insert.insertId, req);
                const updateUrl = await updateUrlQR(ruta, insert.insertId);

                for (const galeria of req.body.galery) {
                    const insertGalery = await insertarGaleria(insert.insertId, galeria);
                }

                res.json({
                    status: 200,
                    response: {
                        text: 'Se ha insertado la mascota correctamente',
                        idMascota: insert.insertId,
                        type: 1
                    }
                })
            } else {
                res.json({
                    status: 404,
                    response: {
                        text: 'Ha ocurrido un error, intente nuevamente',
                        type: 2
                    }
                })
            }
        } else {
            res.json({
                status: 404,
                response: {
                    text: `Ha ocurrido un error, favor de validar su información`,
                    type: 3
                    //text: `Ha ocurrido un error, favor de validar su información ${error}`
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            response: {
                text: `Someting goes wrong ${error}`,
                type: 3
                //text: 'Ha ocurrido un error, intente nuevamente'
            }
        });
    }
}

export const editarMascotasUsuario = async (req, res) => {
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
            idMascota: req.body.id_mascota,
            nombreMascota: req.body.nombre_mascota,
            fechaNacimiento: req.body.fecha_nacimiento,
            galery: [],
            tipo: req.body.tipo,
            raza: req.body.raza,
            color: req.body.color,
            temperamento: req.body.temperamento,
            caracteristicas: req.body.caracteristicas,
            medicas: req.body.medicas
        }

        const { error } = mascotaEditSchema.validate(params)
        if (!error) {
            //Validacion mascota existente
            const mascotaExistente = await obtenerMascotasPorId(params.idMascota);

            //si existe el usuario marca error 404
            if (mascotaExistente == null) {
                return res.json({
                    status: 404,
                    response: {
                        text: 'No existe la mascota, favor de validar su información',
                        type: 3
                    }
                });
            }

            // Asegura que haya una imagen favorita
            req.body.galery = asegurarImagenFavorita(req.body.galery);

            const insert = await actualizarMascota(params.idMascota, params);
            if (insert.affectedRows > 0) {
                const eliminarGalery = await eliminarGaleria(params.idMascota);
                for (const galeria of req.body.galery) {
                    const insertGalery = await insertarGaleria(params.idMascota, galeria);
                }

                res.json({
                    status: 200,
                    response: {
                        text: 'Se ha actualizado la mascota correctamente',
                        type: 1
                    }
                })
            } else {
                res.json({
                    status: 404,
                    response: {
                        text: 'Ha ocurrido un error, intente nuevamente',
                        type: 2
                    }
                })
            }
        } else {
            res.json({
                status: 404,
                response: {
                    //text: `Ha ocurrido un error, favor de validar su información ${error}`
                    text: `Ha ocurrido un error, favor de validar su información`,
                    type: 3
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            response: {
                //text: `Someting goes wrong ${error}`
                text: 'Ha ocurrido un error, intente nuevamente',
                type: 3
            }
        });
    }
}

export const verFichaMascotaPorSha = async (req, res) => {
    const { sha } = req.params;

    if (!sha || sha.trim() === '') {
        return res.redirect('/');
    }

    try {
        const mascota = await obtenerMascotaPorSha(sha);

        if (!mascota) {
            return res.render('error404');
        }

        const galeria = await obtenerGaleriaPorMascota(mascota.id_mascota);
        const mascotaAdaptada = mascotaDTO(mascota);
        const usuario = await obtenerUsuarioPorId(mascota.id_usuario);
        mascotaAdaptada.gallery = galeria.map((foto, i) => mascotaGaleriaDTO(foto, i));
        res.render('fichaMascota', {
            sha: sha,
            mascota: mascotaAdaptada,
            usuario: usuario
        });
    } catch (error) {
        res.status(500).render('error', {
            mensaje: 'Ha ocurrido un error al cargar la mascota.',
            type: 3
        });
    }
};

export const eliminarMascotaUsuario = async (req, res) => {
    try {
        const idUsuario = req.idUsuario; // Middleware debe haberlo inyectado
        if (!idUsuario) {
            return res.status(400).json({
                status: 400,
                response: {
                    text: "ID de usuario no proporcionado en el token.",
                    type: 3
                },
            });
        }

        const params = { idMascota: req.body.id_mascota };

        const { error } = mascotaDeleteSchema.validate(params);
        if (!error) {
            //Validacion mascota existente
            const mascotaExistente = await obtenerMascotasPorId(params.idMascota);

            //si existe el usuario marca error 404
            if (mascotaExistente == null) {
                return res.json({
                    status: 404,
                    response: {
                        text: "No existe la mascota, favor de validar su información",
                        type: 2
                    },
                });
            }

            const eliminarReporteM = await eliminarReporteMascota(params.idMascota);
            const eliminarGaleriaM = await eliminarGaleria(params.idMascota);
            const eliminarMascotaM = await eliminarMascota(params.idMascota);

            if (eliminarMascotaM.affectedRows > 0) {
              res.json({
                status: 200,
                response: {
                  text: "Se ha eliminado la mascota correctamente",
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
                    //text: `Ha ocurrido un error, favor de validar su información ${error}`
                    text: `Ha ocurrido un error, favor de validar su información`,
                    type: 3
                },
            });
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            response: {
                text: `Someting goes wrong ${error}`,
                type: 3
                //text: "Ha ocurrido un error, intente nuevamente",
            },
        });
    }
};