const SpareParts = require("../models/sparePartModel");
const errorHandler = require("../utils/error");

exports.getAllSpareParts = async (req, res, next) => {
  try {
    let { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const spareParts = await SpareParts.find()
      .populate("productId","name")
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
    const { name, cost, price, productId } = req.body;

    const existingSparePart = await SpareParts.findOne({ name });
    if (existingSparePart) {
      return res.status(409).json({ message: "SparePart already exits" });
    }

    const newSparePart = new SpareParts({
      name,
      cost,
      price,
      productId,
    });

    await newSparePart.save();

    res.status(200).json({ message: "success", sparePart: newSparePart });
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
