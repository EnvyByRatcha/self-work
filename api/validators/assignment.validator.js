const Joi = require("joi");

const createAssignmentSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    "any.required": "Title is required",
    "string.empty": "Title cannot be empty",
  }),
  serialNumber: Joi.string().trim().length(10).required().messages({
    "any.required": "Customer code is required",
    "string.empty": "Customer code cannot be empty",
  }),
  customerCode: Joi.string().trim().length(8).required().messages({
    "any.required": "Customer code is required",
    "string.empty": "Customer code cannot be empty",
  }),
  solution: Joi.string().trim().required().messages({
    "any.required": "Solution is required",
    "string.empty": "Solution cannot be empty",
  }),
  addressRemark: Joi.string().trim().allow("").messages({
    "string.base": "Address remark must be a string",
  }),
});

module.exports = { createAssignmentSchema };
