const Joi = require("joi");
const {  USER_LEVEL,TECHNICIAN_LEVEL } = require("../utils/enum");

const createUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  level: Joi.string().valid(...USER_LEVEL).required(),
});

const createTechnicianSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required(),
  lastName: Joi.string().trim().min(2).max(50).required(),
  email: Joi.string().trim().lowercase().email().required(),
  password: Joi.string().min(6).required(),
  level: Joi.string().valid(...TECHNICIAN_LEVEL).required(),
});

const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50),
  lastName: Joi.string().trim().min(2).max(50),
  email: Joi.string().trim().email(),
  address: Joi.string().trim().min(2).max(255),
  tel_1: Joi.string()
    .trim()
    .pattern(/^[0-9\-+() ]{6,20}$/),
  level: Joi.string().valid(...USER_LEVEL),
  status: Joi.string().valid("active", "inactive"),
}).min(1);

const updateTechnicianSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50),
  lastName: Joi.string().trim().min(2).max(50),
  email: Joi.string().trim().email(),
  address: Joi.string().trim().min(2).max(255),
  tel_1: Joi.string()
    .trim()
    .pattern(/^[0-9\-+() ]{6,20}$/),
  level: Joi.string().valid(...TECHNICIAN_LEVEL),
  status: Joi.string().valid("active", "inactive"),
}).min(1);

module.exports = {
  createUserSchema,
  createTechnicianSchema,
  updateUserSchema,
  updateTechnicianSchema,
};
