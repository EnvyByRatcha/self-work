const Technician = require("../models/TechnicianModel");
const encrypt = require("../utils/encrypt");
const errorHandler = require("../utils/error");
const dotenv = require("dotenv");
const { isValidObjectId } = require("../utils/validators");
const {
  createTechnicianSchema,
  updateTechnicianSchema,
} = require("../validators/user.validator");
dotenv.config();

const MAX_LIMIT = 50;

exports.getAllTechnicians = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
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
    if (status) {
      filter.status = status;
    }

    const totalTechnician = await Technician.countDocuments(filter);
    const totalPages = Math.ceil(totalTechnician / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }

    const skip = (page - 1) * limit;
    const sortableFields = ["createdAt"];
    const sortOption = {};
    if (sortableFields.includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const technicians = await Technician.find(filter)
      .select("-password -__v")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      message: "Technicians retrieved successfully",
      data: {
        technicians,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalTechnician,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getTechnicianById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technician ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const technician = await Technician.findById(id)
      .select("-password -__v")
      .lean();

    if (!technician) {
      return res
        .status(404)
        .json({ success: false, message: "Technician not found" });
    }

    res.status(200).json({
      success: true,
      message: "Technician retrieved successfully",
      data: { technician },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createTechnician = async (req, res, next) => {
  try {
    const { error, value } = createTechnicianSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    const { firstName, lastName, email, password, level } = value;

    const existingTechnician = await Technician.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingTechnician) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const hashedPassword = await encrypt.hashPassword(password);

    const newTechnician = new Technician({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      level,
    });

    await newTechnician.save();

    const technicianSafeData = {
      _id: newTechnician._id,
      firstName: newTechnician.firstName,
      lastName: newTechnician.lastName,
      email: newTechnician.email,
      level: newTechnician.level,
      status: newTechnician.status,
    };

    res.status(201).json({
      success: true,
      message: "Technician created successfully",
      data: { technician: technicianSafeData },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateTechnicianById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technician ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const { error, value } = updateTechnicianSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((err) => err.message),
      });
    }

    const payload = {};
    const allowedFields = ["firstName", "lastName", "status"];
    allowedFields.forEach((field) => {
      if (value[field] !== undefined) {
        payload[field] = value[field];
      }
    });

    const updatedTechnician = await Technician.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    if (!updatedTechnician) {
      return res
        .status(404)
        .json({ success: false, message: "Technician not found" });
    }

    res.status(200).json({
      success: true,
      message: "Technician updated successfully",
      data: { technician: updatedTechnician },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.inactiveTechnicianById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid technician ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const technician = await Technician.findById(id);
    if (!technician) {
      return res
        .status(404)
        .json({ success: false, message: "Technician not found" });
    }

    technician.status = "inactive";
    await technician.save();

    res.status(200).json({
      success: true,
      message: "Technician marked as inactive",
      data: {
        technician: {
          _id: technician._id,
          firstName: technician.firstName,
          lastName: technician.lastName,
          email: technician.email,
          status: technician.status,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
