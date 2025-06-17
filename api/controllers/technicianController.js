const Technician = require("../models/TechnicianModel");
const encrypt = require("../utils/encrypt");
const { GENERAL_STATUS } = require("../utils/enum");
const errorHandler = require("../utils/error");
const { mapJoiErrors } = require("../utils/validators");
const validateObjectId = require("../helpers/validateObjectId");
const validatePagination = require("../helpers/paginationValidator");
const {
  createTechnicianSchema,
  updateTechnicianSchema,
} = require("../validators/user.validator");

exports.getAllTechnicians = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sort = "updatedAt",
      order = "desc",
      level,
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
    if (search.trim()) {
      filter.firstName = { $regex: search.trim(), $options: "i" };
    }
    if (level && level !== "all") {
      filter.level = level;
    }
    if (status && status !== "all" && GENERAL_STATUS.includes(status)) {
      filter.status = status;
    }

    const totalTechnician = await Technician.countDocuments(filter);
    const totalPage = Math.ceil(totalTechnician / limit);

    if (page > totalPage && totalPage !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPage}` },
      });
    }

    const skip = (page - 1) * limit;
    const sortableFields = ["updatedAt"];
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
          totalPage,
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
    if (!validateObjectId(id, res)) return;

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

exports.getTechnicianByCustomerId = async (req, res, next) => {
  try {
    const { id: customerId } = req.params;
    if (!validateObjectId(customerId, res)) return;

    let {
      page = 1,
      limit = 10,
      search = "",
      sort = "updatedAt",
      order = "desc",
      level,
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

    const filter = { customerId };
    if (search.trim()) {
      filter.firstName = { $regex: search.trim(), $options: "i" };
    }
    if (level && level !== "all") {
      filter.level = level;
    }
    if (status && status !== "all" && GENERAL_STATUS.includes(status)) {
      filter.status = status;
    }

    const totalTechnician = await Technician.countDocuments(filter);
    const totalPage = Math.ceil(totalTechnician / limit);
    if (page > totalPage && totalPage !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPage}` },
      });
    }

    const skip = (page - 1) * limit;
    const sortableFields = ["updatedAt"];
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
          totalPage,
          currentPage: page,
          totalItems: totalTechnician,
        },
      },
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
        errors: mapJoiErrors(error),
      });
    }
    const { firstName, lastName, email, password, level } = value;

    const existingTechnician = await Technician.findOne({
      email,
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
      email,
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

    if (!validateObjectId(id, res)) return;

    const { error, value } = updateTechnicianSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: mapJoiErrors(error),
      });
    }

    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "address",
      "tel_1",
    ];
    const payload = allowedUpdates.reduce((acc, field) => {
      if (value[field] !== undefined) acc[field] = value[field];
      return acc;
    }, {});

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
    if (!validateObjectId(id, res)) return;

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
