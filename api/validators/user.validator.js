const Joi = require("joi");

const createUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  level: Joi.string().valid("admin", "user", "manager").required(),
});

const createTechnicianSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  level: Joi.string().valid("technician", "lead-technician").required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50),
  lastName: Joi.string().trim().min(2).max(50),
  level: Joi.string().valid("admin", "user", "manager"),
  status: Joi.string().valid("active", "inactive"),
}).min(1);

const updateTechnicianSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50),
  lastName: Joi.string().trim().min(2).max(50),
  level: Joi.string().valid("admin", "user", "manager"),
  status: Joi.string().valid("active", "inactive"),
}).min(1);

module.exports = {
  createUserSchema,
  createTechnicianSchema,
  updateUserSchema,
};
