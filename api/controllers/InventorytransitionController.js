const {
  InventoryTransitions,
  InventoryTransitionDetail,
} = require("../models/Inventorytransition");
const { ProductBash } = require("../models/productModel");
const { SparePartBash } = require("../models/sparePartModel");
const errorHandler = require("../utils/error");

exports.getAllInventoryTransitions = async (req, res, next) => {
  try {
    let { page, limit } = req.body;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    const skip = (page - 1) * limit;

    const inventoryTransitions = await InventoryTransitions.find()
      .populate("userId", "firstName")
      .skip(skip)
      .limit(limit);
    const totalInventoryTransition =
      await InventoryTransitions.countDocuments();
    const totalPages = Math.ceil(totalInventoryTransition / limit);

    res.status(200).json({
      message: "success",
      page: {
        totalPage: totalPages,
        currentPage: page,
      },
      inventoryTransitions: inventoryTransitions,
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.getInventoryTransitionDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const inventoryTransition = await InventoryTransitions.findById({
      _id: id,
    });
    const inventoryTransitionDetail = await InventoryTransitionDetail.find({
      transitionId: id,
    })
      .populate("productId", "name")
      .populate("sparePartId", "name")
      .exec();

    res.status(200).json({
      message: "success",
      inventoryTransition: inventoryTransition,
      inventoryTransitionDetail: inventoryTransitionDetail,
    });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.createInventoryTransition = async (req, res, next) => {
  try {
    const { transition, details } = req.body;
    const userId = req.user.userId;

    const initialValue = 0;
    const totalCost = details.reduce(
      (accumulator, currentValue) =>
        accumulator + parseInt(currentValue.cost) * parseInt(currentValue.qty),
      initialValue
    );

    const inventoryTransition = await InventoryTransitions.create([
      {
        transitionType: transition.transitionType,
        cost: totalCost,
        userId,
      },
    ]);

    const transitionId = inventoryTransition[0]._id;

    const transitionDetailArr = details.map((target) => ({
      transitionId,
      productId: target.productId ? target.productId : null,
      sparePartId: target.sparePartId ? target.sparePartId : null,
      cost: target.cost,
      qty: target.qty,
    }));

    await InventoryTransitionDetail.insertMany(transitionDetailArr);

    res
      .status(200)
      .json({ message: "success", inventoryTransition: inventoryTransition });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};

exports.approveTransition = async (req, res, next) => {
  try {
    const { id } = req.params;

    await InventoryTransitions.findByIdAndUpdate(id, { status: "confirm" });

    const transitionDetails = await InventoryTransitionDetail.find({
      transitionId: id,
    });

    for (let i = 0; i < transitionDetails.length; i++) {
      const target = transitionDetails[i];
      if (target.productId !== null) {
        await ProductBash.create([
          {
            productId: target.productId.toString(),
            cost: target.cost,
            qty: target.qty,
          },
        ]);
      }
      if (target.sparePartId !== null) {
        await SparePartBash.create([
          {
            sparePartId: target.sparePartId.toString(),
            cost: target.cost,
            qty: target.qty,
          },
        ]);
      }
    }

    res.status(200).json({ message: "success" });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
