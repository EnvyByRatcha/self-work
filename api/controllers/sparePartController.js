const SpareParts = require("../models/sparePartModel");
const errorHandler = require("../utils/error");

exports.getAllSpareParts = async (req, res, next) => {
  try {
    const spareParts = await SpareParts.find();
    res.status(200).json({ message: "success", spareParts: spareParts });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createSparePart = async (req, res, next) => {
  try {
    const { name, cost, price } = req.body;

    const existingSparePart = await SpareParts.findOne({ name });
    if (existingSparePart) {
      return res.status(409).json({ message: "SparePart already exits" });
    }

    const newSparePart = new SpareParts({
      name,
      cost,
      price,
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
