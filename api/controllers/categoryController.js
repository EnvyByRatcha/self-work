const mongoose = require("mongoose");
const { Category } = require("../models/productModel");
const errorHandler = require("../utils/error");
const { GENERAL_STATUS } = require("../utils/enum");

const MAX_LIMIT = 50;

exports.getAllCategory = async (req, res, next) => {
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

    if (status && GENERAL_STATUS.includes(status)) {
      filter.status = status;
    } else {
      filter.status = "active";
    }

    const totalCategories = await Category.countDocuments(filter);
    const totalPages = Math.ceil(totalCategories / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages (${totalPages})`,
        errors: {
          page: `Max available page is ${totalPages}`,
        },
      });
    }

    const skip = (page - 1) * limit;
    const sortOption = {};
    if (["name", "createdAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const categories = await Category.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Categories retrieved successfully",
      data: {
        categories,
        pagination: {
          totalPage: totalPages,
          currentPage: page,
          totalItems: totalCategories,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    let { name } = req.body;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ message: "Invalid category name" });
    }

    name = name.trim().toLowerCase();

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
        errors: { name: "Duplicate category name" },
      });
    }

    const newCategory = new Category({
      name,
    });
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Category created",
      data: { category: newCategory },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const allowedUpdates = ["name"];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        errors: { id: "No category with this ID" },
      });
    }

    res.status(200).json({
      success: true,
      message: "Category updated",
      data: { category: updatedCategory },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.removeCategoryById = async (req, res, next) => {
  try {
    const categoryId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        errors: { id: "No category with this ID" },
      });
    }

    category.status = "inactive";
    category.save();

    res.status(200).json({
      success: true,
      message: "Category removed",
      data: { category },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
