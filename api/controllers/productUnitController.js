const {
  ProductUnit,
  ProductBatch,
  Product,
} = require("../models/productModel");
const errorHandler = require("../utils/error");
const { mapJoiErrors } = require("../utils/validators");
const validateObjectId = require("../helpers/validateObjectId");
const {
  createProductUnitSchema,
  updateProductUnitSchema,
} = require("../validators/productUnit.validator");

exports.getProductUnitByProductId = async (req, res, next) => {
  try {
    const { id: productId } = req.params;
    if (!validateObjectId(productId, res)) return;

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

    const filter = { productId };
    if (search.trim()) {
      filter.serialNumber = { $regex: search.trim(), $options: "i" };
    }
    if (status && status !== "all" && GENERAL_STATUS.includes(status)) {
      filter.status = status;
    } else {
      filter.status = "active";
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
    if (["serialNumber", "updatedAt"].includes(sort)) {
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

exports.getProductUnitByCustomerId = async (req, res, next) => {
  try {
    const { id: customerId } = req.params;
    if (!validateObjectId(customerId, res)) return;

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
    search = search.toString().trim();

    const paginationErrors = validatePagination(page, limit);
    if (paginationErrors) {
      return res.status(400).json({
        success: false,
        message: `Invalid pagination parameters`,
        errors: paginationErrors,
      });
    }

    const filter = { customerId };
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
    if (["serialNumber", "updatedAt"].includes(sort)) {
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error, value } = createProductUnitSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mapJoiErrors(error),
      });
    }

    const { productBatchId, productId } = value;
    const serialNumber = value.serialNumber.trim().toUpperCase();

    const product = await Product.findById(productId).lean();
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: { productId: "No product with this ID" },
      });
    }

    const productBatch = await ProductBatch.findById(productBatchId).lean();
    if (!productBatch) {
      return res.status(404).json({
        success: false,
        message: "Product-batch not found",
        errors: { id: "No product-batch with this ID" },
      });
    }

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

    const totalProductUnits = await ProductUnit.countDocuments({
      productBatchId,
    });

    if (totalProductUnits >= productBatch.qty) {
      return res.status(409).json({
        success: false,
        message: "Cannot register more units than batch quantity",
        errors: { productBatch: "Product batch is already full" },
      });
    }

    await ProductBatch.findByIdAndUpdate(
      productBatchId,
      {
        $inc: { registered: 1 },
      },
      { session }
    );

    const newProductUnit = new ProductUnit({
      serialNumber,
      productBatchId,
      productId,
    });

    await newProductUnit.save({ session });
    await Product.findByIdAndUpdate(
      productId,
      { $inc: { qty: 1 } },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Product-unit created successfully",
      data: { productUnit: newProductUnit },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateProductUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const { error, value } = updateProductUnitSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mapJoiErrors(error),
      });
    }

    const allowedUpdates = ["serialNumber"];
    const updates = allowedUpdates.reduce((acc, field) => {
      if (value[field] !== undefined) acc[field] = value[field];
      return acc;
    }, {});

    if (updates.serialNumber) {
      const exists = await ProductUnit.findOne({
        serialNumber: updates.serialNumber.trim().toUpperCase(),
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

exports.inactiveProductUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const productUnit = await ProductUnit.findByIdAndUpdate(
      id,
      {
        status: "inactive",
      },
      {
        new: true,
      }
    );

    if (!productUnit) {
      return res.status(404).json({ message: "Product unit not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product unit marked as inactive",
      data: { productUnit },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
