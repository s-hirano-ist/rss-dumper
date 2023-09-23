import Joi from "joi";

const headingSchema = Joi.string()
  .min(2)
  .max(16)
  // only contain "a" to "z" or "-", separator "-" and does not finish with "-".
  .regex(/^[a-z]+$|^[a-z]+[-]*[a-z]$/)
  .required();

const descriptionSchema = Joi.string().min(2).required();

export const newsPostSchema = Joi.object().keys({
  heading: headingSchema,
  description: descriptionSchema,
});

export const newsPatchSchema = Joi.object().keys({
  description: descriptionSchema,
});

export const idSchema = Joi.object().keys({
  id: Joi.number().required().integer().min(1),
});

export const newsDetailPostSchema = Joi.object().keys({
  title: Joi.string().required(),
  url: Joi.string().uri().required(),
  quote: Joi.string().optional().default(""),
});
