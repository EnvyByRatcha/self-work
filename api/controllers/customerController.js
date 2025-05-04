const Customer = require("../models/customerModel");
const errorHandler = require("../utils/error");
const Joi = require("joi");
const { isValidObjectId } = require("../utils/validators");

exports.createCustomerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  customerCode: Joi.string().trim().max(20).optional(),
  address: Joi.string().trim().max(255).optional(),
  tel_1: Joi.string()
    .trim()
    .pattern(/^[0-9\-+() ]{6,20}$/)
    .optional(),
  tel_2: Joi.string()
    .trim()
    .pattern(/^[0-9\-+() ]{6,20}$/)
    .optional(),
  email: Joi.string().trim().email().optional(),
});

exports.updateCustomerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional(),
  address: Joi.string().trim().max(255).optional(),
  tel_1: Joi.string()
    .trim()
    .pattern(/^[0-9\-+() ]{6,20}$/)
    .optional(),
  tel_2: Joi.string()
    .trim()
    .pattern(/^[0-9\-+() ]{6,20}$/)
    .optional(),
  email: Joi.string().trim().email().optional(),
}).min(1);

exports.getAllCustomers = async (req, res, next) => {
  try {
    let { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const customers = await Customer.find().skip(skip).limit(limit);
    const totalCustomers = await Customer.countDocuments();
    const totalPages = Math.ceil(totalCustomers / limit);

    res.status(200).json({
      message: "success",
      page: {
        totalPage: totalPages,
        currentPage: page,
      },
      customers: customers,
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createCustomer = async (req, res, next) => {
  try {
    const { error, value } = createCustomerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }
    const existingCustomer = await Customer.findOne({ name: value.name });
    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists",
        errors: { name: "Duplicate customer name" },
      });
    }

    const newCustomer = new Customer({
      ...value,
    });
    await newCustomer.save();

    res.status(201).json({
      success: true,
      message: "Customer created successfully",
      data: { customer: newCustomer },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const { error, value } = updateCustomerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((err) => err.message),
      });
    }

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const allowedUpdates = [
      "name",
      "customerCode",
      "address",
      "tel_1",
      "tel_2",
      "email",
    ];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        errors: { id: "No customer with this ID" },
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: { customer: updatedCustomer },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.deactivateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid customer ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    customer.status = "inactive";
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Customer removed",
      data: { customer },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
