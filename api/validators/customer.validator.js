const Joi = require("joi");

const createCustomerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  customerCode: Joi.string().trim().length(8).required(),
  address: Joi.string().trim().max(255).optional(),
  tel_1: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .required(),
  tel_2: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .allow(null, "")
    .optional(),
  email: Joi.string().trim().email().lowercase().optional(),
});

const updateCustomerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  customerCode: Joi.string().trim().length(8).optional(),
  address: Joi.string().trim().max(255).optional(),
  tel_1: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .optional(),
  tel_2: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .allow(null, "")
    .optional(),
  email: Joi.string().trim().email().lowercase().optional(),
}).min(1);

module.exports = {
  createCustomerSchema,
  updateCustomerSchema,
};
