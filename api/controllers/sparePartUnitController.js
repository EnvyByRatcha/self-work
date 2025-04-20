const { SpartPartUnit } = require("../models/sparePartModel");
const errorHandler = require("../utils/error");

exports.getAllSpartPartUnit = async (req, res, next) => {
  try {
    let { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const sparePartUnits = await SpartPartUnit.find().skip(skip).limit(limit);
    const totalSparePartUnits = await SpartPartUnit.countDocuments();

    const totalPages = Math.ceil(totalSparePartUnits / limit);

    res.status(200).json({
      message: "success",
      page: {
        totalPage: totalPages,
        currentPage: page,
      },
      sparePartUnits: sparePartUnits,
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createSpartPartUnit = async (req, res, next) => {
  try {
    const { serialNumber, customerId, productId, producBashtId } = req.body;

    const existingSparePartUnit = await SpartPartUnit.findOne({ serialNumber });
    if (existingSparePartUnit) {
      return res.status(409).json({ message: "Serial number already exits" });
    }

    const newSparePartUnit = new SpartPartUnit({
      serialNumber,
      customerId,
      producBashtId,
    });

    await newSparePartUnit.save();

    res
      .status(200)
      .json({ message: "success", sparePartUnit: newSparePartUnit });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateSpartPartUnit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateSparePartUnit = await SpartPartUnit.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updateSparePartUnit) {
      return res.status(409).json({ message: "Spare part not found" });
    }

    res
      .status(200)
      .json({ message: "success", sparepartUnit: updateSparePartUnit });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.removeSpartPartUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sparePartUnit = await SpartPartUnit.findById(id);

    if (!sparePartUnit) {
      return res.status(404).json({ message: "Spare part not found" });
    }

    sparePartUnit.status = "unused";
    sparePartUnit.save();

    res.status(200).json({ message: "success", sparePartUnit: sparePartUnit });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
