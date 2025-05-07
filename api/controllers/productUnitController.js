const {
  ProductUnit,
  ProductBatch,
  Product,
} = require("../models/productModel");
const errorHandler = require("../utils/error");
const { isValidObjectId } = require("../utils/validators");

const MAX_LIMIT = 50;

exports.getProductUnitByProductId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    let { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const productUnits = await ProductUnit.find({ productId: id })
      .skip(skip)
      .limit(limit);
    const totalProductUnits = await ProductUnit.countDocuments();

    const totalPages = Math.ceil(totalProductUnits / limit);

    res.status(200).json({
      success: true,
      message: "Product-unit retrieved successfully",
      data: {
        productUnits,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalProductUnits,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getProductUnitByCustomerId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    let {
      page = "1",
      limit = "10",
      search = "",
      sort = "createdAt",
      order = "asc",
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);
    search = search.toString().trim();

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

    const filter = {
      customerId: id,
    };

    if (search) {
      filter.serialNumber = { $regex: search, $options: "i" };
    }

    const totalProductUnits = await ProductUnit.countDocuments(filter);
    const totalPages = Math.ceil(totalProductUnits / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }

    const skip = (page - 1) * limit;
    const sortOption = {};
    if (["serialNumber", "createdAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const productUnits = await ProductUnit.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      message: "Product-unit retrieved successfully",
      data: {
        productUnits,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalProductUnits,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createProductUnit = async (req, res, next) => {
  try {
    const { serialNumber, productBatchId, productId } = req.body;

    const existingProductUnit = await ProductUnit.findOne({
      serialNumber,
    }).lean();
    if (existingProductUnit) {
      return res.status(409).json({
        success: false,
        message: "Product-unit already exists",
        errors: { serialNumber: "Duplicate serial number" },
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $inc: { qty: 1 } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: { productId: "No product with this ID" },
      });
    }

    const productBatch = await ProductBatch.findByIdAndUpdate(
      productBatchId
    ).lean();
    if (!productBatch) {
      return res.status(404).json({
        success: false,
        message: "Product-batch not found",
        errors: { id: "No product-batch with this ID" },
      });
    }

    const totalProductUnits = await ProductUnit.countDocuments({
      productBatchId,
    });

    if (totalProductUnits >= productBatch.qty) {
      return res.status(409).json({
        success: false,
        message: "Cannot register more units than batch quantity",
        errors: { productBatchId: "Product batch is already full" },
      });
    }

    await ProductBatch.findByIdAndUpdate(productBatchId, {
      $inc: { registered: 1 },
    });

    const newProductUnit = new ProductUnit({
      serialNumber,
      productBatchId,
      productId,
    });

    await newProductUnit.save();

    res.status(201).json({
      success: true,
      message: "Product-unit created successfully",
      data: { productUnit: newProductUnit },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateProductUnit = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const allowedUpdates = ["serialNumber", "customerId"];
    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No updatable fields provide",
      });
    }

    if (updates.serialNumber) {
      const exists = await ProductUnit.findOne({
        serialNumber: updates.serialNumber,
        _id: { $ne: id },
      });
      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Serial number already in use",
          errors: { serialNumber: "Duplicated serial number" },
        });
      }
    }

    const updatedProductUnit = await ProductUnit.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updatedProductUnit) {
      return res.status(404).json({
        success: false,
        message: "Product unit not found",
        errors: { id: "No product-unit with this ID" },
      });
    }

    res.status(200).json({
      success: true,
      message: "Product-unit updated successfully",
      data: { productUnit: updatedProductUnit },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.removePProductUnit = async (req, res, next) => {
  try {
    const productDetailId = req.params.id;
    const productDetail = await Products.findById(productDetailId);

    if (!productDetail) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = "unused";
    product.save();

    res.status(200).json({ message: "success", productDetail: productDetail });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
