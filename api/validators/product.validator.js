const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  categoryName: Joi.string().trim().min(2).max(100).required(),
  photo: Joi.string()
    .trim()
    .pattern(/^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/)
    .required()
    .messages({
      "string.pattern.base": "Photo must be a valid base64 image string",
      "string.empty": "Photo is required",
      "any.required": "Photo is required",
    }),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  categoryName: Joi.string().trim().min(2).max(100).optional(),
  photo: Joi.string()
    .trim()
    .pattern(/^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/)
    .optional()
    .messages({
      "string.base64": "Photo must be a valid base64 string",
      "any.required": "Photo is required",
    }),
});

module.exports = { createProductSchema, updateProductSchema };
