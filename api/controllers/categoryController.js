const { Category } = require("../models/productModel");
const errorHandler = require("../utils/error");
const { GENERAL_STATUS } = require("../utils/enum");
const validateObjectId = require("../helpers/validateObjectId");
const validatePagination = require("../helpers/paginationValidator");

exports.getAllCategory = async (req, res, next) => {
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
    if (search.trim()) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }
    if (status && status !== "all" && GENERAL_STATUS.includes(status)) {
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
    if (["name", "updatedAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const categories = await Category.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

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

exports.getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const category = await Category.findById(id).lean();
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category retrieved successfully",
      data: { category },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    let { name } = req.body;

    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Invalid category name",
        errors: { name: "Name must be a non-empty string" },
      });
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
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const allowedFields = ["name"];
    const payload = allowedFields.reduce((acc, field) => {
      if (req.body[field] !== undefined) acc[field] = req.body[field];
      return acc;
    }, {});

    if (payload.name) {
      if (typeof payload.name !== "string" || payload.name.trim() === "") {
        return res.status(400).json({
          success: false,
          message: "Invalid category name",
          errors: { name: "Name must be a non-empty string" },
        });
      }

      payload.name = payload.name.trim().toLowerCase();
      const duplicate = await Category.findOne({ name: payload.name });
      if (duplicate && duplicate._id.toString() !== id) {
        return res.status(409).json({
          success: false,
          message: "Category already exists",
          errors: { name: "Duplicate category name" },
        });
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

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

exports.inactiveCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const category = await Category.findById(id);
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
      message: "Category marked as inactive",
      data: { category },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
