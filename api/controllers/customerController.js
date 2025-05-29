const Customer = require("../models/customerModel");
const errorHandler = require("../utils/error");
const { mapJoiErrors } = require("../utils/validators");
const { GENERAL_STATUS } = require("../utils/enum");
const validateObjectId = require("../helpers/validateObjectId");
const validatePagination = require("../helpers/paginationValidator");
const {
  createCustomerSchema,
  updateCustomerSchema,
} = require("../validators/customer.validator");

exports.getAllCustomers = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sort = "updatedAt",
      order = "desc",
      status,
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const paginationErrors = validatePagination(page, limit);
    if (paginationErrors) {
      return res.status(400).json({
        success: false,
        message: `Invalid pagination parameters`,
        errors: paginationErrors,
      });
    }

    const filter = {};
    if (search.trim().toUpperCase()) {
      filter.customerCode = {
        $regex: search.trim().toUpperCase(),
        $options: "i",
      };
    }
    if (status && status !== "all" && GENERAL_STATUS.includes(status)) {
      filter.status = status;
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
    if (["updatedAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const customers = await Customer.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

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
    if (!validateObjectId(id, res)) return;

    const customer = await Customer.findById(id).lean();

    if (!customer) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    res.status(200).json({
      success: true,
      message: "Customer retrieved successfully",
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
        errors: mapJoiErrors(error),
      });
    }

    const name = value.name.trim().toUpperCase();

    const existingCustomer = await Customer.findOne({
      name,
    }).lean();
    if (existingCustomer) {
      return res.status(409).json({
        success: false,
        message: "Customer already exists",
        errors: { name: "Duplicate customer name" },
      });
    }

    const newCustomer = new Customer({
      ...value,
      name,
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
    if (!validateObjectId(id, res)) return;

    const { error, value } = updateCustomerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mapJoiErrors(error),
      });
    }

    const allowedFields = [
      "name",
      "customerCode",
      "address",
      "tel_1",
      "tel_2",
      "email",
      "status",
    ];
    const payload = allowedFields.reduce((acc, field) => {
      if (value[field] !== undefined) acc[field] = value[field];
      return acc;
    }, {});

    const updatedCustomer = await Customer.findByIdAndUpdate(id, payload, {
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

exports.inactivateCustomer = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const customer = await Customer.findByIdAndUpdate(
      id,
      { status: "inactive" },
      {
        new: true,
      }
    );
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Customer marked as inactive",
      data: { customer },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
