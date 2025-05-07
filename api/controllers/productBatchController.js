const { ProductUnit, ProductBatch } = require("../models/productModel");
const errorHandler = require("../utils/error");
const { isValidObjectId } = require("../utils/validators");

exports.getProductBashByProductId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const productBatches = await ProductBatch.find({ productId: id });

    if (!productBatches) {
      return res
        .status(404)
        .json({ success: false, message: "ProductBatch not found" });
    }

    res.status(200).json({
      success: true,
      message: "ProductBatch retrieved",
      data: { productBatches },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
