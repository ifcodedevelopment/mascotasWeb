import fs from 'fs';
import path from 'path';

import { iconDTO, mascotaDTO } from "../DTO/mascota.dto.js";
import { mascotaGaleriaDTO } from "../DTO/mascota.galeria.dto.js";
import { obtenerGaleriaPorMascota } from "../Models/mascota.galeria.model.js";
import { insertarMascota, obtenerMascotaNombreFechaNac, obtenerMascotasPorUsuario, updateUrlQR } from "../Models/mascota.model.js";
import { obtenerReportePorMascota } from "../Models/reporte.model.js";
import { asegurarImagenFavorita } from "../Utils/galeria.helper.js";
import { hashMD5 } from "../Utils/hash.helper.js";
import { mascotaAddSchema } from "../Validators/mascota.validator.js";
import { generarQR } from '../Utils/qr.helper.js';
import { guardarImagenBase64 } from '../Utils/file.helper.js';



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
            if (mascotaExistente.length > 0) {
                return res.json({
                    status: 404,
                    response: {
                        text: 'Ya existe una mascota con ese nombre y fecha de nacimiento, favor de validar su información'
                    }
                });
            }

            // Asegura que haya una imagen favorita
            req.body.galery = asegurarImagenFavorita(req.body.galery); 


            const insert = await insertarMascota(params);
            if(insert.affectedRows > 0){
                const hash = hashMD5('masc-'+ insert.insertId + '-user-' + params.idUsuario);
                const qrBase64 = await generarQR(hash);
                const ruta = guardarImagenBase64(qrBase64, idUsuario, 'qr_' + insert.insertId, req);                
                const updateUrl = await updateUrlQR(ruta, insert.insertId);
                res.json({
                    status: 200,
                    response: {
                        text: 'Se ha insertado la mascota correctamente'
                    }
                })
            } else{
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
                    text: `Ha ocurrido un error, favor de validar su información ${error}`
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            status: 500,
            response: {
                text: `Someting goes wrong ${error}`
                //text: 'Ha ocurrido un error, intente nuevamente'
            }
        });
    }
}

export const obtenerMascotasUsuario = async (req, res) => {
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

        const mascotas = await obtenerMascotasPorUsuario(idUsuario);

        const mascotasDTO = [];
        for (const mascota of mascotas) {
            const dto = mascotaDTO(mascota);
            const galeria = await obtenerGaleriaPorMascota(mascota.id_mascota);
            const reporte = await obtenerReportePorMascota(mascota.id_mascota);

            dto.gallery = galeria.map((foto, index) => mascotaGaleriaDTO(foto, index));
            dto.icon = iconDTO(reporte.length > 0);
            mascotasDTO.push(dto);
        }

        res.json({
            status: 200,
            response: {
                text: "Mascotas encontradas satisfactoriamente",
                mascotas: mascotasDTO
            }
        });
    } catch (error) {
        console.error("Error en obtenerMascotasUsuario:", error);
        res.status(500).json({
            status: 500,
            response: {
                //text: `Someting goes wrong ${error}`
                text: 'Ha ocurrido un error, intente nuevamente'
            }
        });
    }
};
