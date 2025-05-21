const { ProductBatch } = require("../models/productModel");
const errorHandler = require("../utils/error");
const validateObjectId = require("../helpers/validateObjectId");

exports.getProductBatchByProductId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const productBatches = await ProductBatch.find({
      productId: id,
      $expr: { $lt: ["$registered", "$qty"] },
    });

    if (productBatches.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No product batches available for this product",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product batches retrieved successfully",
      data: { productBatches },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
