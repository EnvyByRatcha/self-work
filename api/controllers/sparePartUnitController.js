const mongoose = require("mongoose");
const {
  SparePart,
  SparePartBatch,
  SparePartUnit,
} = require("../models/sparePartModel");
const errorHandler = require("../utils/error");
const { mapJoiErrors } = require("../utils/validators");
const validateObjectId = require("../helpers/validateObjectId");
const validatePagination = require("../helpers/paginationValidator");
const {
  createSparePartUnitSchema,
  updateSparePartUnitSchema,
} = require("../validators/sparePart.validator");

exports.getAllSparePartUnit = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sort = "updatedAt",
      order = "desc",
      status,
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const paginationErrors = validatePagination(page, limit);
    if (paginationErrors) {
      return res.status(400).json({
        success: false,
        message: `Invalid pagination parameters`,
        errors: paginationErrors,
      });
    }

    const filter = {};
    if (search.trim()) {
      filter.serialNumber = { $regex: search.trim(), $options: "i" };
    }
    if (status && status !== "all" && GENERAL_STATUS.includes(status)) {
      filter.status = status;
    } else {
      filter.status = "active";
    }

    const totalSparePartUnits = await SparePartUnit.countDocuments(filter);
    const totalPages = Math.ceil(totalSparePartUnits / limit);
    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }
    const skip = (page - 1) * limit;

    const sortOption = {};
    if (["serialNumber", "updatedAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const sparePartUnits = await SparePartUnit.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      message: "Spaerepart-unit retrieved successfully",
      data: {
        sparePartUnits,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalSparePartUnits,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getSparePartUnitBySparePartId = async (req, res, next) => {
  try {
    const { id: sparePartId } = req.params;
    if (!validateObjectId(sparePartId, res)) return;

    let {
      page = 1,
      limit = 10,
      search = "",
      sort = "updatedAt",
      order = "desc",
      status,
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const paginationErrors = validatePagination(page, limit);
    if (paginationErrors) {
      return res.status(400).json({
        success: false,
        message: `Invalid pagination parameters`,
        errors: paginationErrors,
      });
    }

    const filter = { sparePartId };
    if (search.trim()) {
      filter.serialNumber = { $regex: search.trim(), $options: "i" };
    }
    if (status && status !== "all" && GENERAL_STATUS.includes(status)) {
      filter.status = status;
    } else {
      filter.status = "active";
    }

    const totalSparePartUnits = await SparePartUnit.countDocuments(filter);
    const totalPages = Math.ceil(totalSparePartUnits / limit);
    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages (${totalPages})`,
        errors: {
          page: `Max available page is ${totalPages}`,
        },
      });
    }
    const skip = (page - 1) * limit;

    const sortOption = {};
    if (["serialNumber", "updatedAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const sparePartUnits = await SparePartUnit.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      message: "Sparepart-unit retrieved successfully",
      data: {
        sparePartUnits,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalSparePartUnits,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getSparePartByTechnicianId = async (req, res, next) => {
  try {
    const technicianId = String(req.user.userId);

    const pipeline = [
      {
        $match: {
          technicianId: new mongoose.Types.ObjectId(technicianId),
          status: "issued",
        },
      },
      {
        $lookup: {
          from: "spareparts",
          localField: "sparePartId",
          foreignField: "_id",
          as: "sparePartInfo",
        },
      },
      {
        $unwind: "$sparePartInfo",
      },
      {
        $group: {
          _id: "$sparePartId",
          name: { $first: "$sparePartInfo.name" },
          units: {
            $push: {
              _id: "$_id",
              serialNumber: "$serialNumber",
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          units: 1,
        },
      },
    ];

    const groupedSpareParts = await SparePartUnit.aggregate(pipeline);
    if (!groupedSpareParts) {
      return res
        .status(404)
        .json({ success: false, message: "SparePart-unit not found" });
    }

    res.status(200).json({
      success: true,
      message: "Grouped spare parts retrieved successfully",
      data: { sparePartUnits: groupedSpareParts },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createSparePartUnit = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error, value } = createSparePartUnitSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mapJoiErrors(error),
      });
    }

    const { sparePartBatchId, sparePartId } = value;
    const serialNumber = value.serialNumber.trim().toUpperCase();

    const sparePart = await SparePart.findById(sparePartId).lean();
    if (!sparePart) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
        errors: { sparePartId: "No sparepart with this ID" },
      });
    }

    const sparePartBatch = await SparePartBatch.findById(
      sparePartBatchId
    ).lean();
    if (!sparePartBatch) {
      return res.status(404).json({
        success: false,
        message: "Sparepart-batch not found",
        errors: { sparePartBatchId: "No sparePart-batch with this ID" },
      });
    }

    const existingSparePartUnit = await SparePartUnit.findOne({ serialNumber });
    if (existingSparePartUnit) {
      return res.status(409).json({
        success: false,
        message: "SparePart-unit already exists",
        errors: { serialNumber: "Duplicate serial number" },
      });
    }

    const totalSparePartUnits = await SparePartUnit.countDocuments({
      sparePartBatchId,
    });

    if (totalSparePartUnits >= sparePartBatch.qty) {
      return res.status(409).json({
        success: false,
        message: "Cannot register more units than batch quantity",
        errors: { productBatch: "SparePart batch is already full" },
      });
    }

    const newSparePartUnit = new SparePartUnit({
      serialNumber,
      sparePartId,
      sparePartBatchId,
    });

    await newSparePartUnit.save({ session });
    await SparePartBatch.findByIdAndUpdate(
      sparePartBatchId,
      {
        $inc: { registered: 1 },
      },
      { session }
    );
    await SparePart.findByIdAndUpdate(
      sparePartId,
      { $inc: { qty: 1 } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Sparepart-unit created successfully",
      data: { sparePartUnit: newSparePartUnit },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateSparePartUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const { error, value } = updateSparePartUnitSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mapJoiErrors(error),
      });
    }

    const allowedUpdates = ["serialNumber"];
    const updates = allowedUpdates.reduce((acc, field) => {
      if (value[field] !== undefined) acc[field] = value[field];
      return acc;
    }, {});

    if (updates.serialNumber) {
      const exists = await SparePartUnit.findOne({
        serialNumber: updates.serialNumber.trim().toUpperCase(),
        _id: { $ne: id },
      });
      if (exists) {
        return res.status(409).json({
          success: false,
          message: "Serial number already in use",
          errors: { serialNumber: "Duplicated serial number" },
        });
      }
    }

    const updateSparePartUnit = await SparePartUnit.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!updateSparePartUnit) {
      return res.status(404).json({
        success: false,
        message: "Sparepart-unit not found",
        errors: { id: "No sparepart-unit with this ID" },
      });
    }

    res.status(200).json({
      success: true,
      message: "Sparepart-unit updated successfully",
      data: { sparePartUnit: updateSparePartUnit },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.inactiveSparePartUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const sparePartUnit = await SparePartUnit.findByIdAndDelete(
      id,
      {
        status: "inactive",
      },
      { new: true }
    );
    if (!sparePartUnit) {
      return res.status(404).json({ message: "Sparepart unit not found" });
    }

    res.status(200).json({ message: "success", sparePartUnit: sparePartUnit });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
