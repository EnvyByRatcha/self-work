const mongoose = require("mongoose");
const { Assignment, AssignmentDetail } = require("../models/AssignmentModel");
const { ProductUnit } = require("../models/productModel");
const Customer = require("../models/customerModel");
const errorHandler = require("../utils/error");
const { mapJoiErrors } = require("../utils/validators");
const {
  createAssignmentSchema,
} = require("../validators/assignment.validator");
const validateObjectId = require("../helpers/validateObjectId");
const validatePagination = require("../helpers/paginationValidator");
const { SparePartUnit } = require("../models/sparePartModel");

const MAX_LIMIT = 50;

exports.getAllAssignment = async (req, res, next) => {
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
    if (search) {
      filter.serialNumber = {
        $regex: search.trim().toUpperCase,
        $options: "i",
      };
    }
    if (status && status !== "all") {
      filter.status = status;
    }

    const totalAssignments = await Assignment.countDocuments(filter);
    const totalPages = Math.ceil(totalAssignments / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }

    const skip = (page - 1) * limit;

    const sortOption = {};
    if (["updatedAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const assignments = await Assignment.find()
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      message: "Assignments retrieved successfully",
      data: {
        assignments,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalAssignments,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getAllAssignmentByTechnicianId = async (req, res, next) => {
  try {
    const technicianId = req.user.userId;

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
    filter.technicianId = technicianId;
    if (search) {
      filter.name = { $regex: search.trim().toUpperCase(), $options: "i" };
    }

    const totalAssignments = await Assignment.countDocuments(filter);
    const totalPages = Math.ceil(totalAssignments / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }
    const skip = (page - 1) * limit;

    const sortOption = {};
    if (["updatedAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const assignments = await Assignment.find()
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      message: "Assignments retrieved successfully",
      data: {
        assignments,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalAssignments,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getAssignmentByTechnicianId = async (req, res, next) => {
  try {
    const technicianId = req.user.userId;
    let { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const pipeline = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
          technicianId: new mongoose.Types.ObjectId(technicianId),
        },
      },
      {
        $lookup: {
          from: "assignmentdetails",
          localField: "_id",
          foreignField: "assignmentId",
          as: "details",
        },
      },
      {
        $addFields: {
          usedSparePart: {
            $map: {
              input: "$details",
              as: "detail",
              in: {
                sparePartId: "$$detail.sparePartId",
                assignmentDetailId: "$$detail._id",
              },
            },
          },
        },
      },
      {
        $project: {
          details: 0,
        },
      },
    ];

    const assignmentWithSpareParts = await Assignment.aggregate(pipeline);

    const assignment = await Assignment.findOne({ id, technicianId }).lean();
    if (assignment) {
      return res
        .status(404)
        .json({ success: false, message: "Assignment not found" });
    }

    res.status(200).json({
      success: true,
      message: "Assignment retrieved successfully",
      data: {
        assignmentWithParts: assignmentWithSpareParts[0],
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createAssignmentByTechnician = async (req, res, next) => {
  try {
    const technicianId = req.user.userId;
    const { error, value } = createAssignmentSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: mapJoiErrors(error),
      });
    }

    const { title, solution, addressRemark } = value;
    const customerCode = value.customerCode.trim().toUpperCase();
    const serialNumber = value.serialNumber.trim().toUpperCase();

    const customer = await Customer.findOne({ customerCode });
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
        errors: {
          categoryName: "No Customer matches the provided customerCode",
        },
      });
    }

    const productUnit = await ProductUnit.findOne({
      serialNumber,
      customerId: customer._id,
    });
    if (!productUnit) {
      return res.status(404).json({
        success: false,
        message: "Product-unit not found",
        errors: {
          categoryName:
            "No product-unit matches the provided serialnumber or customercode",
        },
      });
    }

    const newAssignment = new Assignment({
      title,
      serialNumber,
      customerCode,
      technicianId,
      solution,
      addressRemark,
    });

    await newAssignment.save();
    res.status(201).json({
      success: true,
      message: "Assignment created successfully",
      data: { assignment: newAssignment },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createAssignmentDetail = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    let { id } = req.params;
    if (!validateObjectId(id, res)) return;

    const { payload } = req.body;

    const assignment = await Assignment.findById(id).session(session);
    if (!assignment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Assignment not found",
      });
    }

    let selectedSparePart = [];
    let totalCost = 0;

    for (const part of payload) {
      const { sparePartId, units } = part;
      if (!validateObjectId(sparePartId, res)) {
        await session.abortTransaction();
        session.endSession();
        return;
      }

      for (const item of units) {
        const sparePartUnit = await SparePartUnit.findOne({
          _id: item._id,
          sparePartId,
          status: "issued",
        })
          .populate("sparePartBatchId")
          .session(session);

        if (!sparePartUnit || sparePartUnit.status !== "issued") {
          return res.status(400).json({
            success: false,
            message: `Invalid or unavailable spare part unit`,
            errors: {
              sparePart: part.sparePartId,
            },
          });
        }

        const unitId = sparePartUnit._id;
        const batch = sparePartUnit.sparePartBatchId._id;
        const cost = sparePartUnit.sparePartBatchId.cost;

        selectedSparePart.push({
          assignmentId: id,
          sparePartId,
          sparePartBatchId: batch,
          sparePartUnitId: unitId,
          serialNumber: sparePartUnit.serialNumber,
          cost,
        });

        sparePartUnit.status = "reserved";
        await sparePartUnit.save({ session });

        totalCost += cost;
      }
    }

    await AssignmentDetail.insertMany(selectedSparePart, { session });
    assignment.cost = totalCost;
    assignment.status = "pending_approval";
    await assignment.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Assignment detail created successfully",
      data: {
        assignment,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
