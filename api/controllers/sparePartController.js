const { Products } = require("../models/productModel");
const { SpareParts } = require("../models/sparePartModel");
const errorHandler = require("../utils/error");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.getAllSpareParts = async (req, res, next) => {
  try {
    let { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const spareParts = await SpareParts.find()
      .populate("productId", "name")
      .skip(skip)
      .limit(limit);
    const totalProducts = await SpareParts.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      message: "success",
      page: {
        totalPage: totalPages,
        currentPage: page,
      },
      spareParts: spareParts,
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createSparePart = async (req, res, next) => {
  try {
    const { name, cost, price, productId, photo } = req.body;

    const existingSparePart = await SpareParts.findOne({ name });
    if (existingSparePart) {
      return res.status(409).json({ message: "SparePart already exits" });
    }

    const product = await Products.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: "SparePart not found" });
    }

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newSparePart = new SpareParts({
      name,
      cost,
      price,
      productId: product._id,
      photoUrl: photoUrl.url,
    });

    await newSparePart.save();

    res.status(200).json({ message: "success" });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateSparePart = async (req, res, next) => {
  try {
    const sparePartId = req.params.id;
    const sparePart = await SpareParts.findById(sparePartId);

    if (!sparePart) {
      return res.status(404).json({ message: "SparePart not found" });
    }

    Object.keys(req.body).forEach((key) => {
      sparePart[key] = req.body[key];
    });

    await sparePart.save();

    res.status(200).json({ message: "success", sparePart: sparePart });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.removeSparePart = async (req, res, next) => {
  try {
    const sparePartId = req.params.id;
    const sparePart = await SpareParts.findById(sparePartId);

    if (!sparePart) {
      return res.status(404).json({ message: "SparePart not found" });
    }

    sparePart.status = "unused";
    sparePart.save();

    res.status(200).json({ message: "success", sparePart: sparePart });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
