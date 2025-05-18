const User = require("../models/userModel");
const encrypt = require("../utils/encrypt");
const errorHandler = require("../utils/error");
const dotenv = require("dotenv");
const { isValidObjectId, mapJoiErrors } = require("../utils/validators");
const {
  createUserSchema,
  updateUserSchema,
} = require("../validators/user.validator");
dotenv.config();

const MAX_LIMIT = 50;

exports.getAllUsers = async (req, res, next) => {
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
    const sortableFields = ["createdAt"];
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

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

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

    const { firstName, lastName, email, password, level } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "Email already exists" });
    }

    const hasPassword = await encrypt.hashPassword(password);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hasPassword,
      level,
    });
    await newUser.save();

    const userSafeData = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      level: newUser.level,
      status: newUser.status,
    };

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

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

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

    const allowedFields = ["firstName", "lastName", "status"];
    const payload = {};
    allowedFields.forEach((field) => {
      if (value[field] !== undefined) {
        payload[field] = value[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    }).select("-password -__v");

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.inactiveUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    user.status = "inactive";
    await user.save();

    res.status(200).json({
      success: true,
      message: "User marked as inactive",
      data: {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          status: user.status,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
