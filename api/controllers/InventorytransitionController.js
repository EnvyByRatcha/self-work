const mongoose = require("mongoose");
const {
  InventoryTransition,
  InventoryTransitionDetail,
} = require("../models/Inventorytransition");
const { ProductBatch, ProductUnit } = require("../models/productModel");
const { SparePartBatch, SparePartUnit } = require("../models/sparePartModel");
const errorHandler = require("../utils/error");
const validateObjectId = require("../helpers/validateObjectId");
const validatePagination = require("../helpers/paginationValidator");
const {
  createTransitionSchema,
} = require("../validators/transition.validator");

const transformTransitionDetail = (detail) => {
  return {
    _id: detail._id,
    name: detail.sparePartId?.name || detail.productId?.name,
    cost: detail.cost,
    qty: detail.qty,
    total: detail.cost * detail.qty,
  };
};

const transformTransition = (transition) => {
  return {
    id: transition._id,
    transitionType: transition.transitionType,
    user: transition.userId.name,
    technician: transition.technicianId.name,
    cost: transition.cost,
    status: transition.status,
  };
};

exports.getAllInventoryTransitions = async (req, res, next) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      sort = "createdAt",
      order = "desc",
      type,
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
    if (type && type !== "all") {
      filter.transitionType = type;
    }
    if (status && status !== "all" && GENERAL_STATUS.includes(status)) {
      filter.status = status;
    }

    const totalInventoryTransitions = await InventoryTransition.countDocuments(
      filter
    );
    const totalPage = Math.ceil(totalInventoryTransitions / limit);

    if (page > totalPage && totalPage !== 0) {
      return res.status(400).json({
        success: false,
        message: `Page number exceeds total pages`,
        errors: { page: `Max available page is ${totalPage}` },
      });
    }

    const skip = (page - 1) * limit;
    const sortOption = {};
    if (["createdAt"].includes(sort)) {
      sortOption[sort] = order === "desc" ? -1 : 1;
    }

    const inventoryTransitions = await InventoryTransition.find(filter)
      .populate("userId", "firstName")
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      success: true,
      message: "Products retrieved successfully",
      data: {
        inventoryTransitions,
        pagination: {
          totalPage,
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

    const tranformed = inventoryTransitionDetail.map(transformTransitionDetail);

    res.status(200).json({
      success: true,
      message: "Inventory transition retrieved",
      data: {
        inventoryTransition: inventoryTransition,
        inventoryTransitionDetail: tranformed,
      },
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createInventoryTransition = async (req, res, next) => {
  try {
    const { error } = createTransitionSchema.validate(req.body);
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
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error } = createTransitionSchema.validate(req.body);
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
        serialNumber: detail.serialNumber,
        status: "active",
      }).populate("sparePartBatchId");

      if (!sparePartUnit || sparePartUnit.status !== "active") {
        await session.abortTransaction();
        session.endSession();
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
      await sparePartUnit.save({ session });
    }

    const [inventoryTransition] = await InventoryTransition.create(
      [
        {
          transitionType: transition.transitionType,
          technicianId: transition.technicianId,
          cost: totalCost,
          userId: userId,
          status: "pending",
        },
      ],
      { session }
    );

    const transitionId = inventoryTransition._id;

    const detailDocs = details.map((detail) => ({
      ...detail,
      transitionId,
    }));

    await InventoryTransitionDetail.insertMany(detailDocs, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Technician issued created successfully",
      data: {
        inventoryTransition: inventoryTransition,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createProductTranfered = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { error } = createTransitionSchema.validate(req.body);
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
      const productUnit = await ProductUnit.findOne({
        _id: detail.productUnitId,
        productId: detail.productId,
        status: "active",
      })
        .populate("productBatchId")
        .session(session);

      if (!productUnit) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Invalid or unavailable product unit ${detail.serialNumber}`,
          errors: {
            productUnitId: detail.serialNumber,
          },
        });
      }

      const cost = productUnit.productBatchId.cost || 0;
      detail.cost = cost;
      totalCost += cost;

      productUnit.status = "pending_approval";
      await productUnit.save({ session });
    }

    const [inventoryTransition] = await InventoryTransition.create(
      [
        {
          transitionType: transition.transitionType,
          userId: userId,
          customerId: transition.customerId,
          cost: totalCost,
          status: "pending",
        },
      ],
      { session }
    );

    const transitionId = inventoryTransition._id;

    const detailDocs = details.map((detail) => ({
      ...detail,
      transitionId,
    }));

    await InventoryTransitionDetail.insertMany(detailDocs, { session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Product tranfered created successfully",
      data: {
        inventoryTransition: inventoryTransition,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

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

    const existingTransition = await InventoryTransition.findById(id).session(
      session
    );
    if (!existingTransition) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Inventory transition not found" });
    }

    if (existingTransition.status === "approve") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Already approved" });
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

          const sparePartUnit = await SparePartUnit.findOne({
            serialNumber,
          }).session(session);
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

      case "product-tranfered":
        for (const detail of transitionDetails) {
          const { serialNumber } = detail;
          const productUnit = await ProductUnit.findOne({
            serialNumber,
          }).session(session);
          if (!productUnit) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
              success: false,
              message: `product unit with serial ${serialNumber} not found`,
            });
          }

          productUnit.status = "onsite";
          productUnit.customerId = existingTransition.customerId;
          await productUnit.save({ session });
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

exports.rejectTransition = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    if (!validateObjectId(id, res)) {
      await session.abortTransaction();
      session.endSession();
      return;
    }

    const existingTransition = await InventoryTransition.findById(id).session(
      session
    );
    if (!existingTransition) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ success: false, message: "Inventory transition not found" });
    }

    if (existingTransition.status === "approve") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Already approved" });
    }

    if (existingTransition.status === "reject") {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(400)
        .json({ success: false, message: "Already reject" });
    }

    const transitionDetails = await InventoryTransitionDetail.find({
      transitionId: id,
    }).session(session);

    switch (existingTransition.transitionType) {
      case "stock-in":
        existingTransition.status = "reject";
        await existingTransition.save({ session });
        break;

      case "technician-issued":
        for (const detail of transitionDetails) {
          const { serialNumber } = detail;

          const sparePartUnit = await SparePartUnit.findOne({
            serialNumber,
          }).session(session);
          if (!sparePartUnit) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
              success: false,
              message: `Spare part unit with serial ${serialNumber} not found`,
            });
          }

          sparePartUnit.status = "active";
          await sparePartUnit.save({ session });
        }
        break;

      case "product-tranfered":
        for (const detail of transitionDetails) {
          const { serialNumber } = detail;
          const productUnit = await ProductUnit.findOne({
            serialNumber,
          }).session(session);
          if (!productUnit) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({
              success: false,
              message: `product unit with serial ${serialNumber} not found`,
            });
          }

          productUnit.status = "active";
          await productUnit.save({ session });
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
      { status: "reject" },
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
