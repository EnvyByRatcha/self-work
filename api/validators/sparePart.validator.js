const Joi = require("joi");

const createSparePartSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  productId: Joi.string().trim().min(2).max(100).required(),
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

const updateSparePartSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  productId: Joi.string().trim().min(2).max(100).optional(),
  photo: Joi.string()
    .trim()
    .pattern(/^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/)
    .optional()
    .messages({
      "string.base64": "Photo must be a valid base64 string",
      "any.required": "Photo is required",
    }),
});

const createSparePartUnitSchema = Joi.object({
  serialNumber: Joi.string().trim().length(10).required(),
  sparePartBatchId: Joi.string().trim().min(2).max(100).required(),
  sparePartId: Joi.string().trim().min(2).max(100).required(),
});

const updateSparePartUnitSchema = Joi.object({
  serialNumber: Joi.string().trim().length(10).required(),
});

module.exports = {
  createSparePartSchema,
  updateSparePartSchema,
  createSparePartUnitSchema,
  updateSparePartUnitSchema,
};
