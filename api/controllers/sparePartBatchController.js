const { SparePartBatch } = require("../models/sparePartModel");
const errorHandler = require("../utils/error");
const { isValidObjectId } = require("../utils/validators");

exports.getSparePartBatchByProductId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const sparePartBatches = await SparePartBatch.find({
      sparePartId: id,
      $expr: { $lt: ["$registered", "$qty"] },
    });

    if (!sparePartBatches) {
      return res
        .status(404)
        .json({ success: false, message: "SparePartBatch not found" });
    }

    res.status(200).json({
      success: true,
      message: "SparePartBatch retrieved",
      data: { sparePartBatches },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
