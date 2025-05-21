const Joi = require("joi");

const createProductUnitSchema = Joi.object({
  serialNumber: Joi.string().trim().uppercase().length(8).required(),
  productBatchId: Joi.string().trim().min(2).max(100).required(),
  productId: Joi.string().trim().min(2).max(100).required(),
});

const updateProductUnitSchema = Joi.object({
  serialNumber: Joi.string().trim().uppercase().length(8).required(),
});

module.exports = { createProductUnitSchema, updateProductUnitSchema };
