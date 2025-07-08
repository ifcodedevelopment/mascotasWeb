import { iconDTO, mascotaDTO } from "../DTO/mascota.dto.js";
import { mascotaGaleriaDTO } from "../DTO/mascota.galeria.dto.js";
import { obtenerGaleriaPorMascota } from "../Models/mascota.galeria.model.js";
import { obtenerMascotasPorUsuario, obtenerMascotasPorUsuarioOrdenado } from "../Models/mascota.model.js";
import { obtenerReportePorMascota } from "../Models/reporte.model.js";


export const obtenerMascotasUsuario = async (req, res) => {
    try {
        const idUsuario = req.idUsuario; // Middleware debe haberlo inyectado
        if (!idUsuario) {
            return res.status(400).json({
                status: 400,
                response: {
                    text: "ID de usuario no proporcionado en el token.",
                },
            });
        }

        const mascotas = await obtenerMascotasPorUsuarioOrdenado(idUsuario);

        const mascotasDTO = [];
        for (const mascota of mascotas) {
            const dto = mascotaDTO(mascota);
            const galeria = await obtenerGaleriaPorMascota(mascota.id_mascota);
            const reporte = await obtenerReportePorMascota(mascota.id_mascota);
            console.log(reporte);

            const MAX_GALLERY = 4;
            const numPlaceholders = Math.max(MAX_GALLERY - galeria.length, 0);

            const placeholders = Array.from(
                { length: numPlaceholders },
                (_, i) => ({
                    id_galeria_mascota: null,
                    url: "",
                    descripcion: "",
                    index: i,
                })
            );

            const reales = galeria.map((foto, i) =>
                mascotaGaleriaDTO(foto, i + numPlaceholders)
            );

            dto.gallery = [...placeholders, ...reales].slice(0, MAX_GALLERY);
            dto.icon = iconDTO(reporte != null);
            mascotasDTO.push(dto);
        }

        res.json({
            status: 200,
            response: {
                text: "Información encontrada correctamente",
                mascotas: mascotasDTO,
                idLastNotification: null,
                type: 1
            },
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            response: {
                text: `Someting goes wrong ${error}`
                //text: "Ha ocurrido un error, intente nuevamente",
            },
        });
    }
};
