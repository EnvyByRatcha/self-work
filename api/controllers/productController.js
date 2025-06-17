const { Product, Category } = require("../models/productModel");
const errorHandler = require("../utils/error");
const { uploadImage, deleteImage } = require("../service/cloudinaryService");
const { extractPublicIdFromUrl } = require("../utils/cloudinaryHelper");
const { mapJoiErrors } = require("../utils/validators");
const { GENERAL_STATUS } = require("../utils/enum");
const validateObjectId = require("../helpers/validateObjectId");
const validatePagination = require("../helpers/paginationValidator");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/product.validator");

const transformProduct = (product) => {
  return {
    _id: product._id,
    name: product.name,
    qty: product.qty,
    photoUrl: product.photoUrl,
    status: product.status,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    categoryId: product.categoryId,
    categoryName: product.categoryId?.name,
  };
};

exports.getAllProduct = async (req, res, next) => {
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
    if (search) {
      filter.name = { $regex: search.trim().toLowerCase(), $options: "i" };
    }
    if (status && status !== "all" && GENERAL_STATUS.includes(status)) {
      filter.status = status;
    }

    const totalProducts = await Product.countDocuments(filter);
    const totalPage = Math.ceil(totalProducts / limit);

    if (page > totalPage && totalPage !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPage}` },
      });
    }
    const skip = (page - 1) * limit;

    const sortOption = {};
    if (["name", "updatedAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const products = await Product.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("categoryId", "name")
      .lean();

    const tranformed = products.map(transformProduct);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: {
        products: tranformed,
        pagination: {
          totalPage,
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
    if (!validateObjectId(id, res)) return;

    const product = await Product.findById(id)
      .populate("categoryId", "name")
      .lean();

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const tranformed = transformProduct(product);

    res.status(200).json({
      success: true,
      message: "Product retrieved successfully",
      data: { product: tranformed },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { error, value } = createProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mapJoiErrors(error),
      });
    }

    const name = value.name.trim().toLowerCase();
    const categoryName = value.categoryName.trim().toLowerCase();
    const { photo } = value;

    const existingProduct = await Product.findOne({
      name: name,
    }).lean();
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "Product already exists",
        errors: { name: "Duplicate product name" },
      });
    }

    const category = await Category.findOne({
      name: categoryName,
    }).lean();
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
        errors: { categoryName: "No category matches the provided name" },
      });
    }

    const photoUrl = await uploadImage(photo, "products");

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
    if (!validateObjectId(id, res)) return;

    const { error, value } = updateProductSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mapJoiErrors(error),
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

    const updates = {};

    if (value.name) {
      updates.name = value.name.trim().toLowerCase();
    }

    if (value.categoryName) {
      const category = await Category.findOne({
        name: value.categoryName.trim().toLowerCase(),
      }).lean();
      if (!category) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
          errors: { categoryName: "No category matches the provided name" },
        });
      }
      updates.categoryId = category._id;
    }

    if (value.photo) {
      if (product.photoUrl) {
        const publicId = extractPublicIdFromUrl(product.photoUrl);
        await deleteImage("products", publicId);
      }
      updates.photoUrl = await uploadImage(value.photo, "products");
    }

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

exports.inactivateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const product = await Product.findByIdAndUpdate(
      id,
      { status: "inactive" },
      {
        new: true,
      }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: { id: "No product with this ID" },
      });
    }

    res.status(200).json({
      success: true,
      message: "Product marked as inactive",
      data: { product },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
