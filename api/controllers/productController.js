const mongoose = require("mongoose");
const { Product, Category } = require("../models/productModel");
const errorHandler = require("../utils/error");
const { uploadImage } = require("../service/cloudinaryService");

const MAX_LIMIT = 50;

exports.getAllProduct = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
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
    if (search) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);

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

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name");

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: {
        products,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalProducts,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getProductById = async (req, res, next) => {
  try {
    let { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const product = await Product.findById(id).populate("categoryId", "name");

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product retrieved",
      data: { product },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, categoryName, photo } = req.body;

    if (!name || !categoryName || !photo) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        errors: {
          name: !name ? "Name is required" : undefined,
          categoryName: !categoryName ? "Category name is required" : undefined,
          photo: !photo ? "Photo is required" : undefined,
        },
      });
    }

    const existingProduct = await Product.findOne({
      name: name.trim().toLowerCase(),
    });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
        errors: { name: "Duplicate product name" },
      });
    }

    const category = await Category.findOne({
      name: categoryName.trim().toLowerCase(),
    });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        errors: { categoryName: "No category matches the provided name" },
      });
    }

    const photoUrl = await uploadImage(photo);

    const newProduct = new Product({
      name,
      categoryId: category._id,
      photoUrl,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: { product: newProduct },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const allowedUpdates = ["name", "categoryId", "photoUrl"];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: { id: "No product with this ID" },
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: { product: updatedProduct },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.deactivateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: { id: "No product with this ID" },
      });
    }

    product.status = "inactive";
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product marked as inactive",
      data: { product },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
