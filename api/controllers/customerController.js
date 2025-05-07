const Customer = require("../models/customerModel");
const errorHandler = require("../utils/error");
const Joi = require("joi");
const { isValidObjectId } = require("../utils/validators");

const MAX_LIMIT = 50;

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
    let {
      page = 1,
      limit = 10,
      search = "",
      sort = "createdAt",
      order = "asc",
      status,
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (
      isNaN(page) ||
      isNaN(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > MAX_LIMIT
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid pagination parameters (limit must be between 1 and ${MAX_LIMIT})`,
        errors: {
          page: "Must be greater than 0",
          limit: `Must be between 1 and ${MAX_LIMIT}`,
        },
      });
    }

    const filter = {};
    if (search) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }
    const totalCustomers = await Customer.countDocuments(filter);
    const totalPages = Math.ceil(totalCustomers / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }

    const skip = (page - 1) * limit;
    const sortOption = {};
    if (["name", "createdAt", "price"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const customers = await Customer.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Customers retrieved successfully",
      data: {
        customers,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalCustomers,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getCustomerById = async (req, res, next) => {
  try {
    let { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const customer = await Customer.findById(id);

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Customer retrieved",
      data: { customer },
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
