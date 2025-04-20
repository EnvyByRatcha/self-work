const { ProductUnits, ProductBashes } = require("../models/productModel");
const errorHandler = require("../utils/error");

exports.getAllProductUnit = async (req, res, next) => {
  try {
    const productId = req.params.id;
    let { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const productUnits = await ProductUnits.find({ productId })
      .skip(skip)
      .limit(limit);
    const totalProductUnits = await ProductUnits.countDocuments();

    const totalPages = Math.ceil(totalProductUnits / limit);

    res.status(200).json({
      message: "success",
      page: {
        totalPage: totalPages,
        currentPage: page,
      },
      productUnits: productUnits,
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createProductUnit = async (req, res, next) => {
  try {
    const { serialNumber, productBashId, productId, customerId } = req.body;

    const productBash = await ProductBashes.findById(productBashId);
    if (!productBash) {
      return res.status(404).json({ message: "Product bash not found" });
    }

    const existingProductUnit = await ProductUnits.findOne({ serialNumber });
    if (existingProductUnit) {
      return res.status(409).json({ message: "Product already exits" });
    }

    const totalProductUnits = await ProductUnits.countDocuments({
      productBashId,
    });

    if (totalProductUnits >= productBash.qty) {
      return res
        .status(409)
        .json({ message: "Cannot register more units than available" });
    }

    const newProductUnit = new ProductUnits({
      serialNumber,
      customerId,
      productId,
      productBashId,
    });

    await newProductUnit.save();

    res.status(200).json({ message: "success", productUnit: newProductUnit });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateProductUnit = async (req, res, next) => {
  try {
    const productDetailId = req.params.id;

    const updateProductDetail = await ProductUnits.findByIdAndUpdate(
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
