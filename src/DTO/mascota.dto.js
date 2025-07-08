import { formatDate_DMY } from "../Utils/date.helper.js";

export const mascotaDTO = (mascota) => ({
    id: mascota.id_mascota,
    nombre_mascota: mascota.ms_nombre,
    fecha_nacimiento: mascota.ms_fecha_nac,
    gallery: [],
    tipo: mascota.ms_tipo,
    icon: {},
    raza: mascota.ms_raza,
    color: mascota.ms_color,
    temperamento: (mascota.ms_temperamento == 1
        ? 'Temeroso'
        : (mascota.ms_temperamento == 2 ? 'Sociable' : 'Agresivo')),
    caracteristicas: mascota.ms_caracteristicas,
    medicas: mascota.ms_medicas,
    url: mascota.ms_qr
});

export const iconDTO = (reporte) => ({
  icono: reporte.length > 0 ? "alarm-light" : "home",
  color: reporte.length > 0 ? "#DC3545" : "#6FCF97",
});