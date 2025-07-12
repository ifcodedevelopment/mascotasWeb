import { obtenerEscaneosPorReporte } from "../Models/escaneo.model.js";
import { formatDate_DMY, formatDate_YMD } from "../Utils/date.helper.js";

export const reporteDTO = async (reporte) => {

    const escaneos = await obtenerEscaneosPorReporte(reporte.id_reporte);

    return {
        id: reporte.id_reporte,
        mascota: reporte.id_mascota,
        fechas: {
            fecha_inicio: reporte.rep_inicio
                ? formatDate_YMD(reporte.rep_inicio)
                : "",
            fecha_fin: reporte.rep_fin ? formatDate_YMD(reporte.rep_fin) : "",
        },
        recompensa: {
            tieneRecompensa: reporte.rep_recompensa == 1 ? 1 : 2,
            cantidad: reporte.rep_monto_recompensa
                ? reporte.rep_monto_recompensa
                : null,
        },
        adicional: reporte.rep_comentarios,
        locations: escaneos.map((item, index) => ({
            id: index + 1,
            lat: item.esc_lat,
            lon: item.esc_long,
            fecha: formatDate_YMD(item.esc_fecha),
            hora: item.esc_hora,
        })),
    };
}
