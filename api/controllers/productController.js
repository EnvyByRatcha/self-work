const { Products, Categories } = require("../models/productModel");
const errorHandler = require("../utils/error");

exports.getAllProduct = async (req, res, next) => {
  try {
    let { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const products = await Products.find().skip(skip).limit(limit);
    const totalProducts = await Products.countDocuments();

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      message: "success",
      page: {
        totalPage: totalPages,
        currentPage: page,
      },
      products: products,
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, cost, categoryName, price } = req.body;

    const existingProduct = await Products.findOne({ name });
    if (existingProduct) {
      return res.status(409).json({ message: "Product already exits" });
    }

    const category = await Categories.findOne({ name: categoryName });

    const newProduct = new Products({
      name,
      cost,
      price,
      categoryId: category.id,
    });

    await newProduct.save();

    res.status(200).json({ message: "success" });
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
