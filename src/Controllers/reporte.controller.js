import { reporteDTO } from "../DTO/reporte.dto.js";
import { actualizarReporte, insertarReporte, obtenerReportePorMascota, obtenerReportePorMascotasUsuarios } from "../Models/reporte.model.js";
import { reporteAddSchema, reporteEditSchema } from "../Validators/reporte.validator.js";

export const obtenerReportesPorMascotas = async (req, res) => {
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

        const reportes = await obtenerReportePorMascotasUsuarios(idUsuario);
        const reportesDTO = [];
        for (const reporte of reportes) {
            const dto = await reporteDTO(reporte);
            reportesDTO.push(dto);
        }

        res.json({
            status: 200,
            response: {
                text: "Reportes encontrados satisfactoriamente",
                mascotas: reportesDTO,
                type: 1
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            response: {
                //text: `Someting goes wrong ${error}`
                text: 'Ha ocurrido un error, intente nuevamente'
            }
        });
    }
};

export const addReporte = async (req, res) => {
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
            mascota: req.body.mascota,
            fechaInicio: req.body.fecha_inicio,
            tieneRecompensa: req.body.tiene_recompensa,
            cantidad: req.body.cantidad,
            adicional: req.body.adicional
        }

        const { error } = reporteAddSchema.validate(params)

        if (!error) {
            const reportes = await obtenerReportePorMascota(params.mascota);
            
            if (reportes.length > 0) {
                return res.json({
                    status: 404,
                    response: {
                        text: "No es posible agregar un reporte, la mascota ya cuenta con un reporte activo",
                        type: 2
                    },
                });
            }

            const insert = await insertarReporte(params);
            if (insert != null && insert.insertId) {
                res.json({
                    status: 200,
                    response: {
                        text: "Se ha agregado el reporte correctamente",
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
                    text: 'Ha ocurrido un error, favor de validar su información',
                    type: 3
                }
            })
        }
    } catch (error) {
        res.json({
            status: 500,
            response: {
                text: `Someting goes wrong ${error}`,
                type: 3
                //text: 'Ha ocurrido un error, intente nuevamente'
            }
        })
    }
}

export const editReporte = async (req, res) => {
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
            mascota: req.body.mascota,
            fechaInicio: req.body.fecha_inicio,
            fechaFin: req.body.fecha_fin,
            tieneRecompensa: req.body.tiene_recompensa,
            cantidad: req.body.cantidad,
            adicional: req.body.adicional
        }

        const { error } = reporteEditSchema.validate(params)

        if (!error) {
            const reportes = await obtenerReportePorMascota(params.mascota);
            if (reportes.length > 0 ) {
                return res.json({
                    status: 404,
                    response: {
                        text: "No es posible editar este reporte, la mascota no cuenta con reportes abiertos",
                        type: 2
                    },
                });
            }

            if (reportes.id_mascota != params.idMascota) {
                return res.json({
                    status: 404,
                    response: {
                        text: "No es posible editar este reporte, el reporte no corresponde a la mascota",
                        type: 2,
                    },
                });
            }

            const update = await actualizarReporte(reportes.id_reporte, params);
            if (update != null && update.affectedRows > 0) {
                res.json({
                    status: 200,
                    response: {
                        text: "Se ha actualizado el reporte correctamente",
                        type: 1
                    },
                });
            } else {
                res.json({
                    status: 404,
                    response: {
                        text: "Ha ocurrido un error, intente nuevamente",
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
                text: `Someting goes wrong ${error}`,
                type: 3
                //text: 'Ha ocurrido un error, intente nuevamente'
            },
        });
    }
}