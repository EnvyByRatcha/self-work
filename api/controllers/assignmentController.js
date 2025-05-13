const { Assignment, AssignmentDetail } = require("../models/AssignmentModel");
const Customer = require("../models/customerModel");
const errorHandler = require("../utils/error");
const { isValidObjectId } = require("../utils/validators");
const Joi = require("joi");

const MAX_LIMIT = 50;

exports.getAllAssignment = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
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

    const totalAssignments = await Assignment.countDocuments(filter);
    const totalPages = Math.ceil(totalAssignments / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }

    const skip = (page - 1) * limit;

    const sortOption = {};
    if (["createdAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const assignments = await Assignment.find()
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Assignments retrieved successfully",
      data: {
        assignments,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalAssignments,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getAssignmentByTechnicianId = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    let {
      page = 1,
      limit = 10,
      search = "",
      sort = "createdAt",
      order = "asc",
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
    filter.technicianId = userId;
    if (search.trim()) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    const totalAssignments = await Assignment.countDocuments(filter);
    const totalPages = Math.ceil(totalAssignments / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }

    const skip = (page - 1) * limit;

    const sortOption = {};
    if (["createdAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const assignments = await Assignment.find()
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Assignments retrieved successfully",
      data: {
        assignments,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalAssignments,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createAssignment = async (req, res, next) => {
  try {
    const {
      title,
      customerCode,
      technicianId,
      userId,
      solution,
      addressRemark,
    } = req.body;

    const customer = await Customer.findOne({ customerCode });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        errors: {
          categoryName: "No Customer matches the provided customerCode",
        },
      });
    }

    const newAssignment = new Assignment({
      title,
      customerCode,
      technicianId,
      userId,
      solution,
      addressRemark,
    });

    await newAssignment.save();
    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: { assignment: newAssignment },
    });
  } catch (error) {}
};

exports.createAssignmentByTechnician = async (req, res, next) => {
  try {
    const { assignment, details } = req.body;
    const technicianId = req.user.id;

    const customer = await Customer.findOne({
      customerCode: assignment.customerCode,
    });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        errors: {
          categoryName: "No Customer matches the provided customerCode",
        },
      });
    }

    const newAssignment = new Assignment({
      title: assignment.title,
      customerCode: assignment.customerCode,
      technicianId,
      solution: assignment.solution,
      addressRemark: assignment.addressRemark,
    });

    await newAssignment.save();
    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: { assignment: newAssignment },
    });
  } catch (error) {}
};
