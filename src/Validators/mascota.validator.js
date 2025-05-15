import Joi from "joi";

export const mascotaAddSchema = Joi.object({
  idUsuario: Joi.number().required(),
  nombreMascota: Joi.string().required(),
  fechaNacimiento: Joi.date().max('now').required(),
  tipo: Joi.number().min(1).max(2).required(),
  raza: Joi.string().required(),
  color: Joi.string().required(),
  temperamento: Joi.number().min(1).max(3).required(),
  caracteristicas: Joi.string().required(),
  medicas: Joi.string().required(),
  galery: Joi.array()
    .max(4)
    .items(
      Joi.object({
        url: Joi.string().required(),
        favorite: Joi.boolean().default(false)
      })
    )
    .default([])
});

export const mascotaEditSchema = Joi.object({
  idMascota: Joi.number().required(),
  nombreMascota: Joi.string().required(),
  fechaNacimiento: Joi.date().max('now').required(),
  tipo: Joi.number().min(1).max(2).required(),
  raza: Joi.string().required(),
  color: Joi.string().required(),
  temperamento: Joi.number().min(1).max(3).required(),
  caracteristicas: Joi.string().required(),
  medicas: Joi.string().required(),
  galery: Joi.array()
    .max(4)
    .items(
      Joi.object({
        url: Joi.string().required(),
        favorite: Joi.boolean().default(false)
      })
    )
    .default([])
});

  