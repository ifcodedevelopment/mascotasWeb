import Joi from "joi";

export const reporteAddSchema = Joi.object({
    mascota: Joi.number().required(),
    fechaInicio: Joi.date().max("now").required(),
    tieneRecompensa: Joi.number().allow(null),
    cantidad: Joi.number().allow(null),
    adicional: Joi.string().allow(null),
});

export const reporteEditSchema = Joi.object({
    mascota: Joi.number().required(),
    fechaInicio: Joi.date().max("now").required(),
    fechaFin: Joi.date().max("now").required(),
    tieneRecompensa: Joi.number().allow(null),
    cantidad: Joi.number().allow(null),
    adicional: Joi.string().allow(null),
});

export const reporteDeleteSchema = Joi.object({
    mascota: Joi.number().required()
})

export const reporteScanSchema = Joi.object({
    codigo: Joi.string().required()
})