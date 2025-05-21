const mongoose = require("mongoose");
const { Product } = require("../models/productModel");
const { SparePart } = require("../models/sparePartModel");
const errorHandler = require("../utils/error");
const { GENERAL_STATUS } = require("../utils/enum");
const { uploadImage, deleteImage } = require("../service/cloudinaryService");
const { extractPublicIdFromUrl } = require("../utils/cloudinaryHelper");
const validateObjectId = require("../helpers/validateObjectId");
const validatePagination = require("../helpers/paginationValidator");

const MAX_LIMIT = 50;

exports.getAllSpareParts = async (req, res, next) => {
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

    const totalSpareParts = await SparePart.countDocuments(filter);
    const totalPages = Math.ceil(totalSpareParts / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }

    const skip = (page - 1) * limit;
    const sortOption = {};
    if (["name", "updatedAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const spareParts = await SparePart.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("productId", "name")
      .lean();

    res.status(200).json({
      success: true,
      message: "SpareParts retrieved successfully",
      data: {
        spareParts,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalSpareParts,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getSparePartById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const sparePart = await SparePart.findById(id)
      .populate("productId", "name")
      .lean();

    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "SparePart not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "SparePart retrieved successfully",
      data: { sparePart },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createSparePart = async (req, res, next) => {
  try {
    const { error, value } = createSparePartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mapJoiErrors(error),
      });
    }

    const name = value.name.trim().toLowerCase();
    const productId = value.productId;
    const { photo } = value;

    const existingSparePart = await SparePart.findOne({ name }).lean();
    if (existingSparePart) {
      return res.status(409).json({
        success: false,
        message: "SparePart already exists",
        errors: { name: "Duplicate spare part name" },
      });
    }

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: { productId: "No product matches the provided product ID" },
      });
    }

    const photoUrl = await uploadImage(photo, "spareParts");

    const newSparePart = new SparePart({
      name,
      productId: product._id,
      photoUrl,
    });

    await newSparePart.save();

    res.status(201).json({
      success: true,
      message: "SparePart created successfully",
      data: { sparePart: newSparePart },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateSparePart = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const { error, value } = updateSparePartSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mapJoiErrors(error),
      });
    }

    const sparePart = await SparePart.findById(id);
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "SparePart not found",
        errors: { id: "No spare part with this ID" },
      });
    }

    const updates = {};

    if (value.name) {
      updates.name = value.name.trim().toLowerCase();
    }

    if (value.productId) {
      const product = await Product.findById(value.productId).lean();
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
          errors: { productId: "No product matches the provided product ID" },
        });
      }
      updates.productId = product._id;
    }

    if (value.photo) {
      if (sparePart.photoUrl) {
        const publicId = extractPublicIdFromUrl(sparePart.photoUrl);
        await deleteImage("spareParts", publicId);
      }
      updates.photoUrl = await uploadImage(value.photo, "spareParts");
    }

    const updatedSparePart = await SparePart.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).populate("productId", "name");

    res.status(200).json({
      success: true,
      message: "SparePart updated successfully",
      data: { sparePart: updatedSparePart },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.deactivateSparePart = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const sparePart = await SparePart.findByIdAndUpdate(
      id,
      { status: "inactive" },
      {
        new: true,
      }
    );
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "SparePart not found",
        errors: { id: "No spare part with this ID" },
      });
    }

    res.status(200).json({
      success: true,
      message: "SparePart marked as inactive",
      data: { sparePart },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
