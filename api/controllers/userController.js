const User = require("../models/userModel");
const encrypt = require("../utils/encrypt");
const errorHandler = require("../utils/error");
const { mapJoiErrors } = require("../utils/validators");
const { GENERAL_STATUS } = require("../utils/enum");
const { sanitizeUser } = require("../utils/sanitizers");
const validateObjectId = require("../helpers/validateObjectId");
const validatePagination = require("../helpers/paginationValidator");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validators/user.validator");


exports.getAllUsers = async (req, res, next) => {
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

    const totalUser = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUser / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }

    const skip = (page - 1) * limit;
    const sortableFields = ["updatedAt"];
    const sortOption = {};
    if (sortableFields.includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const users = await User.find(filter)
      .select("-password -__v")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: {
        users,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalUser,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const user = await User.findById(id).select("-password -__v").lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User retrieved successfully",
      data: { user },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { error, value } = createUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: mapJoiErrors(error),
      });
    }

    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const hasPassword = await encrypt.hashPassword(value.password);

    const newUser = new User({
      ...value,
      password: hasPassword,
    });
    await newUser.save();

    const userSafeData = sanitizeUser(newUser);

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: { user: userSafeData },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const { error, value } = updateUserSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: mapJoiErrors(error),
      });
    }

    const allowedUpdates = ["firstName", "lastName", "status"];
    const updates = allowedUpdates.reduce((acc, field) => {
      if (value[field] !== undefined) acc[field] = value[field];
      return acc;
    }, {});

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userSafeData = sanitizeUser(updatedUser);

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user: userSafeData },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.inactiveUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const user = await User.findByIdAndUpdate(
      id,
      { status: "inactive" },
      {
        new: true,
      }
    );
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userSafeData = sanitizeUser(user);

    res.status(200).json({
      success: true,
      message: "User marked as inactive",
      data: { user: userSafeData },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
