import Joi from "joi";

export const reporteAddSchema = Joi.object({
    mascota: Joi.number().required(),
    fechaInicio: Joi.date().max('now').required(),
    tieneRecompensa: Joi.number().min(0).max(1).required(),
    cantidad: Joi.number().allow(null),
    adicional: Joi.string().allow(null)
})

export const reporteEditSchema = Joi.object({
    mascota: Joi.number().required(),
    fechaInicio: Joi.date().max('now').required(),
    fechaFin: Joi.date().max('now').required(),
    tieneRecompensa: Joi.number().min(0).max(1).required(),
    cantidad: Joi.number().allow(null),
    adicional: Joi.string().allow(null)
})