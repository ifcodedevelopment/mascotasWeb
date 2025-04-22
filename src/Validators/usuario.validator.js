import Joi from "joi";

export const usuarioAddSchema = Joi.object({
    nombre: Joi.string().required(),
    apellidoP: Joi.string().required(),
    apellidoM: Joi.string().required(),
    fechaNac: Joi.date().max('now').required(),
    sexo: Joi.number().min(1).max(2).required(),
    telefono: Joi.string().allow(null),
    telefonoFijo: Joi.string().allow(null),
    email: Joi.string().email().required(),
    password: Joi.string().min(1).max(100).required()
})

export const usuarioEditSchema = Joi.object({
    nombre: Joi.string().required(),
    apellidoP: Joi.string().required(),
    apellidoM: Joi.string().required(),
    fechaNac: Joi.date().max('now').required(),
    sexo: Joi.number().min(1).max(2).required(),
    telefono: Joi.string().allow(null),
    telefonoFijo: Joi.string().allow(null),
    email: Joi.string().email().required(),
    password: Joi.string().min(1).max(100).required()
})

export const usuarioDeleteSchema = Joi.object({
    id_usuario: Joi.number().required()
})