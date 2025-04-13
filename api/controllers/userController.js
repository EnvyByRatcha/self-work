const Users = require("../models/userModel");
const encrypt = require("../utils/encrypt");
const errorHandler = require("../utils/error");
const dotenv = require("dotenv");
dotenv.config();

exports.getAllUsers = async (req, res, next) => {
  try {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const users = await Users.find({ status: "used" })
      .select("-password -__v")
      .skip(skip)
      .limit(limit);
    const totalUser = await Users.countDocuments({ status: "used" });
    const totalPages = Math.ceil(totalUser / limit);

    res.status(200).json({
      message: "success",
      page: {
        totalPage: totalPages,
        currentPage: page,
      },
      users: users,
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById({ _id: userId }).select("-password -__v");
    res.status(200).json({ message: "success", user: user });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, level } = req.body;

    const existingEmail = await Users.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const hasPassword = await encrypt.hashPassword(password);

    const newUser = new Users({
      firstName,
      lastName,
      email,
      password: hasPassword,
      level,
    });
    await newUser.save();

    res.status(201).json({ message: "success" });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    const restrictedFields = ["_id", "role", "createAt"];
    restrictedFields.forEach((field) => delete req.body[field]);

    const updatedUser = await Users.findByIdAndUpdate(userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.removeUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await Users.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "unused";
    await user.save();

    res.status(200).json({ message: "success" });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
