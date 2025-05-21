const { SparePartBatch } = require("../models/sparePartModel");
const errorHandler = require("../utils/error");
const validateObjectId = require("../helpers/validateObjectId");

exports.getSparePartBatchByProductId = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const sparePartBatches = await SparePartBatch.find({
      sparePartId: id,
      $expr: { $lt: ["$registered", "$qty"] },
    });

    if (!sparePartBatches) {
      return res.status(404).json({
        success: false,
        message: "No sparePart batches available for this sparePart",
      });
    }

    res.status(200).json({
      success: true,
      message: "SparePart batches retrieved successfully",
      data: { sparePartBatches },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
