import Joi from "joi";

const titleSchema = Joi.string()
  .min(2)
  .max(16)
  // only contain "a" to "z" or "-", separator "-" and does not finish with "-".
  .regex(/^[a-z]+$|^[a-z]+[-]*[a-z]$/)
  .required();

const descriptionSchema = Joi.string().min(2).required();

export const newsPostSchema = Joi.object().keys({
  title: titleSchema,
  description: descriptionSchema,
});

export const newsPatchSchema = Joi.object().keys({
  description: descriptionSchema,
});
