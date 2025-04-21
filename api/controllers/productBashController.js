const { ProductUnits, ProductBashes } = require("../models/productModel");
const errorHandler = require("../utils/error");

exports.getProductBashByProductId = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const productBashes = await ProductBashes.find({ productId });
    res.status(200).json({ message: "success", productBashes: productBashes });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
