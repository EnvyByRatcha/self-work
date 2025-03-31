const { Products } = require("../models/productModel");
const errorHandler = require("../utils/error");

exports.getAllProduct = async (req, res, next) => {
  try {
    const products = await Products.find();
    res.status(200).json({ message: "success", products: products });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, cost, price } = req.body;

    const existingProduct = await Products.findOne({ name });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already exits" });
    }

    const newProduct = new Products({
      name,
      cost,
      price,
    });

    await newProduct.save();

    res.status(200).json({ message: "success", products: newProduct });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;

    const updateProduct = await Products.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateProduct) {
      return res.status(409).json({ message: "Product already exits" });
    }

    res.status(200).json({ message: "success", product: updateProduct });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.removeProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await Products.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    product.status = "unused";
    product.save();

    res.status(200).json({ message: "success", product: product });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};


