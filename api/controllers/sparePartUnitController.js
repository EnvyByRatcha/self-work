const { SpartPartUnit } = require("../models/sparePartModel");
const errorHandler = require("../utils/error");

const MAX_LIMIT = 50;

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

    const result = await SpartPartUnit.aggregate(aggregationPipeline);
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
