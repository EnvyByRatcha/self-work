const mongoose = require("mongoose");
const { Product } = require("../models/productModel");
const { SparePart } = require("../models/sparePartModel");
const errorHandler = require("../utils/error");
const { uploadImage } = require("../service/cloudinaryService");

const MAX_LIMIT = 50;

exports.getAllSpareParts = async (req, res, next) => {
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

    const totalSparePart = await SparePart.countDocuments(filter);
    const totalPages = Math.ceil(totalSparePart / limit);

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

    const spareParts = await SparePart.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .populate("productId", "name");

    res.status(200).json({
      success: true,
      message: "SpareParts retrieved successfully",
      data: {
        spareParts,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalSparePart,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getSparePartById = async (req, res, next) => {
  try {
    let { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sparepart ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const sparePart = await SparePart.findById(id).populate(
      "productId",
      "name"
    );
    if (!sparePart) {
      return res
        .status(404)
        .json({ success: false, message: "SparePart not found" });
    }

    res.status(200).json({
      success: true,
      message: "SparePart retrieved",
      data: { sparePart },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createSparePart = async (req, res, next) => {
  try {
    const { name, productId, photo } = req.body;

    if (!name || !productId || !photo) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        errors: {
          name: !name ? "Name is required" : undefined,
          productId: !productId ? "Product_id is required" : undefined,
          photo: !photo ? "Photo is required" : undefined,
        },
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
        errors: { productId: "Not a valid ObjectId" },
      });
    }

    const existingSparePart = await SparePart.findOne({
      name: name.trim().toLowerCase(),
    });
    if (existingSparePart) {
      return res.status(409).json({
        success: false,
        message: "Sparepart already exists",
        errors: { name: "Duplicate Sparepart name" },
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: { categoryName: "No product matches the provided product id" },
      });
    }

    const photoUrl = await uploadImage(photo);

    const newSparePart = new SparePart({
      name,
      productId: product._id,
      photoUrl,
    });

    await newSparePart.save();

    res.status(201).json({
      success: true,
      message: "Sparepart created successfully",
      data: { sparePart: newSparePart },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateSparePart = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sparepart ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const allowedUpdates = ["name", "productId", "photoUrl"];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedSparePart = await SparePart.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedSparePart) {
      return res.status(404).json({
        success: false,
        message: "Sparepart not found",
        errors: { id: "No sparepart with this ID" },
      });
    }

    res.status(200).json({
      success: true,
      message: "Sparepart updated successfully",
      data: { sparePart: updatedSparePart },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.deactivateSparePart = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sparepart ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const sparePart = await SparePart.findById(id);
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "Sparepart not found",
        errors: { id: "No Sparepart with this ID" },
      });
    }

    sparePart.status = "inactive";
    await sparePart.save();

    res.status(200).json({
      success: true,
      message: "Product marked as inactive",
      data: { sparePart },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
