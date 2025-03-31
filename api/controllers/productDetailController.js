const { ProductDetails } = require("../models/productModel");
const errorHandler = require("../utils/error");

exports.getAllProductDetail = async (req, res, next) => {
  try {
    const productsDetails = await ProductDetails.find();
    res
      .status(200)
      .json({ message: "success", productsDetails: productsDetails });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createProductDetail = async (req, res, next) => {
  try {
    const { serialNumber, customerId } = req.body;

    const existingProductDetail = await Products.findOne({ serialNumber });
    if (existingProductDetail) {
      return res.status(409).json({ message: "Product already exits" });
    }

    const newProductDetail = new Products({
      serialNumber,
      customerId,
    });

    await newProductDetail.save();

    res.status(200).json({ message: "success", productDetail: newProduct });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateProductDetail = async (req, res, next) => {
  try {
    const productDetailId = req.params.id;

    const updateProductDetail = await ProductDetails.findByIdAndUpdate(
      productDetailId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateProductDetail) {
      return res.status(409).json({ message: "Product already exits" });
    }

    res
      .status(200)
      .json({ message: "success", productDetail: updateProductDetail });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.removeProductDetail = async (req, res, next) => {
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
