const mongoose = require("mongoose");
const {
  InventoryTransition,
  InventoryTransitionDetail,
} = require("../models/Inventorytransition");
const { ProductBatch } = require("../models/productModel");
const { SparePartBatch, SparePartUnit } = require("../models/sparePartModel");
const errorHandler = require("../utils/error");
const validateObjectId = require("../helpers/validateObjectId");
const validatePagination = require("../helpers/paginationValidator");
const Joi = require("joi");

const MAX_LIMIT = 50;

const transitionSchema = Joi.object({
  transition: Joi.object({
    transitionType: Joi.string()
      .valid("stock-in", "stock-out", "technician-issued")
      .required(),
    technicianId: Joi.string(),
  }).required(),
  details: Joi.array()
    .items(
      Joi.object({
        productId: Joi.string().optional(),
        sparePartId: Joi.string().optional(),
        sparePartBatchId: Joi.string(),
        sparePartUnitId: Joi.string(),
        serialNumber: Joi.string(),
        cost: Joi.number().required(),
        qty: Joi.number().greater(0).required(),
        type: Joi.string().valid("product", "sparepart"),
      }).xor("productId", "sparePartId")
    )
    .min(1)
    .required(),
});

exports.getAllInventoryTransitions = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      sort = "createdAt",
      order = "desc",
      status,
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

    const totalInventoryTransitions = await InventoryTransition.countDocuments(
      filter
    );
    const totalPages = Math.ceil(totalInventoryTransitions / limit);

    if (page > totalPages && totalPages !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPages}` },
      });
    }

    const skip = (page - 1) * limit;

    const sortOption = {};
    if (["createdAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const inventoryTransitions = await InventoryTransition.find()
      .populate("userId", "firstName")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: {
        inventoryTransitions,
        pagination: {
          totalPages,
          currentPage: page,
          totalItems: totalInventoryTransitions,
        },
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getInventoryTransitionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
        errors: { id: "Not a valid ObjectId" },
      });
    }

    const inventoryTransition = await InventoryTransition.findById(id).lean();
    if (!inventoryTransition) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory transition not found" });
    }

    const inventoryTransitionDetail = await InventoryTransitionDetail.find({
      transitionId: id,
    })
      .populate("productId", "name")
      .populate("sparePartId", "name")
      .lean();
    if (!inventoryTransitionDetail) {
      return res.status(404).json({
        success: false,
        message: "Inventory transition detail not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Inventory transition retrieved",
      data: {
        inventoryTransition: inventoryTransition,
        inventoryTransitionDetail: inventoryTransitionDetail,
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createInventoryTransition = async (req, res, next) => {
  try {
    const { error } = transitionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        error: { input: error.details },
      });
    }

    const { transition, details } = req.body;
    const userId = req.user.userId;

    const totalCost = details.reduce(
      (accumulator, currentValue) =>
        accumulator + parseInt(currentValue.cost) * parseInt(currentValue.qty),
      0
    );

    const inventoryTransition = await InventoryTransition.create({
      transitionType: transition.transitionType,
      cost: totalCost,
      userId: userId,
    });

    const transitionDetailArr = details.map((item) => ({
      transitionId: inventoryTransition._id,
      productId: item.productId ? item.productId : null,
      sparePartId: item.sparePartId ? item.sparePartId : null,
      cost: item.cost,
      qty: item.qty,
    }));

    await InventoryTransitionDetail.insertMany(transitionDetailArr);

    res.status(200).json({
      success: true,
      message: "Inventory transition created successfully",
      data: { inventoryTransition: inventoryTransition },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createTechnicianIssued = async (req, res, next) => {
  try {
    const { error } = transitionSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Invalid input data",
        error: { input: error.details },
      });
    }

    const { transition, details } = req.body;
    const userId = req.user.userId;

    let totalCost = 0;
    for (const detail of details) {
      const sparePartUnit = await SparePartUnit.findOne({
        _id: detail.sparePartUnitId,
        sparePartId: detail.sparePartId,
      }).populate("sparePartBatchId");

      if (!sparePartUnit || sparePartUnit.status !== "active") {
        return res.status(400).json({
          success: false,
          message: `Invalid or unavailable spare part unit ${detail.serialNumber}`,
          errors: {
            sparePartUnitId: detail.serialNumber,
          },
        });
      }

      const cost = sparePartUnit.sparePartBatchId.cost || 0;
      detail.cost = cost;
      totalCost += cost;

      sparePartUnit.status = "pending_approval";
      await sparePartUnit.save();
    }

    const inventoryTransition = await InventoryTransition.create({
      transitionType: transition.transitionType,
      technicianId: transition.technicianId,
      cost: totalCost,
      userId: userId,
      status: "pending",
    });

    const transitionId = inventoryTransition._id;

    const detailDocs = details.map((detail) => ({
      ...detail,
      transitionId,
    }));

    await InventoryTransitionDetail.insertMany(detailDocs);

    res.status(200).json({
      success: true,
      message: "Technician issued created successfully",
      data: {
        inventoryTransition: inventoryTransition,
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

// exports.approveTransition = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     if (!validateObjectId(id, res)) return;

//     const existingTransition = await InventoryTransition.findById(id);
//     if (!existingTransition) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: "Inventory transition not found",
//       });
//     }

//     if (existingTransition.status === "approve") {
//       await session.abortTransaction();
//       return res.status(400).json({
//         success: false,
//         message: "Inventory transition has already been approved",
//       });
//     }

//     const updatedTransition = await InventoryTransition.findByIdAndUpdate(
//       id,
//       { status: "approve" },
//       { new: true }
//     );

//     if (!updatedTransition) {
//       await session.abortTransaction();
//       return res.status(404).json({
//         success: false,
//         message: "Inventory transition not found",
//       });
//     }

//     const transitionDetails = await InventoryTransitionDetail.find({
//       transitionId: id,
//     });

//     for (const detail of transitionDetails) {
//       const { productId, sparePartId, cost, qty } = detail;

//       if (productId) {
//         const [createdBatch] = await ProductBatch.create([
//           { productId: productId.toString(), cost, qty },
//         ]);
//         detail.productBatchId = createdBatch._id;
//       }

//       if (sparePartId) {
//         const [createdBatch] = await SparePartBatch.create([
//           { sparePartId: sparePartId.toString(), cost, qty },
//         ]);
//         detail.sparePartBatchId = createdBatch._id;
//       }

//       await detail.save();
//     }

//     res.status(200).json({
//       success: true,
//       message: "Inventory transition approved successfully",
//       data: { inventoryTransition: updatedTransition },
//     });
//   } catch (error) {
//     errorHandler.mapError(error, 500, "Internal Server Error", next);
//   }
// };

// exports.approveTchnicianIssued = async (req, res, next) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();
//   try {
//     const { id } = req.params;
//     if (!validateObjectId(id, res)) {
//       await session.abortTransaction();
//       session.endSession();
//       return;
//     }

//     const existingTransition = await InventoryTransition.findById(id).session(
//       session
//     );
//     if (!existingTransition) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({
//         success: false,
//         message: "Inventory transition not found",
//       });
//     }

//     const updatedTransition = await InventoryTransition.findByIdAndUpdate(
//       id,
//       { status: "approve" },
//       { new: true, session }
//     );

//     if (!updatedTransition) {
//       await session.abortTransaction();
//       session.endSession();
//       return res.status(404).json({
//         success: false,
//         message: "Inventory transition not found",
//       });
//     }

//     const transitionDetails = await InventoryTransitionDetail.find({
//       transitionId: id,
//     }).session(session);

//     for (const detail of transitionDetails) {
//       const { serialNumber } = detail;

//       const sparePartUnit = await SparePartUnit.findOne({
//         serialNumber,
//       }).session(session);

//       if (!sparePartUnit) {
//         await session.abortTransaction();
//         session.endSession();
//         return res.status(404).json({
//           success: false,
//           message: `Spare part unit with serial ${serialNumber} not found`,
//         });
//       }
//       sparePartUnit.status = "issued";
//       sparePartUnit.technicianId = updatedTransition.technicianId;
//       await sparePartUnit.save({ session });
//     }

//     await session.commitTransaction();
//     session.endSession();

//     res.status(200).json({
//       success: true,
//       message: "Inventory transition approved successfully",
//       data: { inventoryTransition: updatedTransition },
//     });
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     errorHandler.mapError(error, 500, "Internal Server Error", next);
//   }
// };

exports.approveTransition = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) {
      await session.abortTransaction();
      session.endSession();
      return;
    }

    const existingTransition = await InventoryTransition.findById(id).session(session);
    if (!existingTransition) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ success: false, message: "Inventory transition not found" });
    }

    if (existingTransition.status === "approve") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Already approved" });
    }

    const transitionDetails = await InventoryTransitionDetail.find({
      transitionId: id,
    }).session(session);

    switch (existingTransition.transitionType) {
      case "stock-in":
        for (const detail of transitionDetails) {
          const { productId, sparePartId, cost, qty } = detail;

          if (productId) {
            const [createdBatch] = await ProductBatch.create(
              [{ productId: productId.toString(), cost, qty }],
              { session }
            );
            detail.productBatchId = createdBatch._id;
          }

          if (sparePartId) {
            const [createdBatch] = await SparePartBatch.create(
              [{ sparePartId: sparePartId.toString(), cost, qty }],
              { session }
            );
            detail.sparePartBatchId = createdBatch._id;
          }

          await detail.save({ session });
        }
        break;

      case "technician-issued":
        for (const detail of transitionDetails) {
          const { serialNumber } = detail;

          const sparePartUnit = await SparePartUnit.findOne({ serialNumber }).session(session);
          if (!sparePartUnit) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
              success: false,
              message: `Spare part unit with serial ${serialNumber} not found`,
            });
          }

          sparePartUnit.status = "issued";
          sparePartUnit.technicianId = existingTransition.technicianId;
          await sparePartUnit.save({ session });
        }
        break;

      default:
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Unsupported transition type: ${existingTransition.transitionType}`,
        });
    }

    const updatedTransition = await InventoryTransition.findByIdAndUpdate(
      id,
      { status: "approve" },
      { new: true, session }
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Inventory transition approved successfully",
      data: { inventoryTransition: updatedTransition },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

