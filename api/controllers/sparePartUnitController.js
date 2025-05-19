const {
  SparePartUnit,
  SparePart,
  SparePartBatch,
} = require("../models/sparePartModel");
const errorHandler = require("../utils/error");
const { isValidObjectId } = require("../utils/validators");

const MAX_LIMIT = 50;

exports.getAllSparePartUnit = async (req, res, next) => {
  try {
    let { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const sparePartUnits = await SparePartUnit.find().skip(skip).limit(limit);
    const totalSparePartUnits = await SparePartUnit.countDocuments();

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

exports.getSparePartUnitBySparePartId = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    let { page, limit, search = "", status } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    if (
      isNaN(page) ||
      isNaN(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > MAX_LIMIT
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid pagination parameters (limit must be between 1 and ${MAX_LIMIT})`,
        errors: {
          page: "Must be greater than 0",
          limit: `Must be between 1 and ${MAX_LIMIT}`,
        },
      });
    }

    const filter = { sparePartId: id };
    if (search) {
      filter.serialNumber  = { $regex: search.trim(), $options: "i" };
    }
    if (status && GENERAL_STATUS.includes(status)) {
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

    const sparePartUnits = await SparePartUnit.find(filter)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Spare-part-unit retrieved successfully",
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
    const userId = req.user.userId;

    let {
      page = 1,
      limit = 10,
      search = "",
      sort = "createdAt",
      order = "asc",
    } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (
      isNaN(page) ||
      isNaN(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > MAX_LIMIT
    ) {
      return res.status(400).json({
        success: false,
        message: `Invalid pagination parameters (limit must be between 1 and ${MAX_LIMIT})`,
        errors: {
          page: "Must be greater than 0",
          limit: `Must be between 1 and ${MAX_LIMIT}`,
        },
      });
    }

    const filter = {};
    filter.technicianId = userId;
    if (search.trim()) {
      filter.name = { $regex: search.trim(), $options: "i" };
    }

    const sortOrder = order === "desc" ? -1 : 1;

    const aggregationPipeline = [
      { $match: filter },
      {
        $group: {
          _id: "$sparePartBatchId",
          parts: { $push: "$$ROOT" },
          createdAt: { $first: "$createdAt" },
        },
      },
      {
        $sort: { [sort]: sortOrder },
      },
      {
        $facet: {
          paginatedResults: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ];

    const result = await SparePartUnit.aggregate(aggregationPipeline);
    const sparePartUnits = result[0]?.paginatedResults || [];
    const totalItems = result[0]?.totalCount?.[0]?.count || 0;
    const totalPages = Math.ceil(totalItems / limit);

    res.status(200).json({
      success: true,
      message: "SparePartUnits retrieved successfully",
      data: {
        sparePartUnits,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createSparePartUnit = async (req, res, next) => {
  try {
    const { serialNumber, sparePartId, sparePartBatchId } = req.body;

    const existingSparePartUnit = await SparePartUnit.findOne({ serialNumber });
    if (existingSparePartUnit) {
      return res.status(409).json({ message: "Serial number already exits" });
    }

    const updateSparePart = await SparePart.findByIdAndUpdate(
      sparePartId,
      { $inc: { qty: 1 } },
      { new: true }
    );

    if (!updateSparePart) {
      return res.status(404).json({
        success: false,
        message: "SparePart not found",
        errors: { productId: "No sparePart with this ID" },
      });
    }

    const sparePartBatch = await SparePartBatch.findByIdAndUpdate(
      sparePartBatchId
    ).lean();
    if (!sparePartBatch) {
      return res.status(404).json({
        success: false,
        message: "SparePart-batch not found",
        errors: { id: "No sparePart-batch with this ID" },
      });
    }

    const totalSparePartUnits = await SparePartUnit.countDocuments({
      sparePartBatchId,
    });

    if (totalSparePartUnits >= sparePartBatch.qty) {
      return res.status(409).json({
        success: false,
        message: "Cannot register more units than batch quantity",
        errors: { sparePartBatch: "Sparepart batch is already full" },
      });
    }

    await SparePartBatch.findByIdAndUpdate(sparePartBatchId, {
      $inc: { registered: 1 },
    });

    const newSparePartUnit = new SparePartUnit({
      serialNumber,
      sparePartId,
      sparePartBatchId,
    });

    await newSparePartUnit.save();

    res.status(201).json({
      success: true,
      message: "Sparepart-unit created successfully",
      data: { sparePartUnit: newSparePartUnit },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.updateSparePartUnit = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateSparePartUnit = await SparePartUnit.findByIdAndUpdate(
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

exports.removeSparePartUnit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sparePartUnit = await SparePartUnit.findById(id);

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
