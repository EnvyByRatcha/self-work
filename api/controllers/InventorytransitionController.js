const {
  InventoryTransitions,
  InventoryTransitionDetail,
} = require("../models/Inventorytransition");
const errorHandler = require("../utils/error");

exports.createInventoryTransition = async (req, res, next) => {
  try {
    const { transitionType, form, to, detail } = req.body;
    const userId = req.user._id;

    const session = await mongoose.startSession();
    session.startTransaction();

    const totalCost = detail.reduce(
      (sum, target) => sum + target.price * target.qty,
      0
    );

    const inventoryTransition = await InventoryTransitions.create(
      [
        {
          transitionType,
          cost: totalCost,
          userId,
        },
      ],
      { session }
    );

    const transitionId = inventoryTransition[0]._id;

    const transitionDetailArr = detail.map((target) => ({
      transitionId,
      productId: target.productId,
      sparePartId: target.sparePartId,
      cost: target.cost,
      qty: target.qty,
    }));

    await InventoryTransitionDetail.insertMany(transitionDetailArr, {
      session,
    });

    await session.commitTransaction();
    session.endSession();

    res
      .status(200)
      .json({ message: "success", inventoryTransition: inventoryTransition });
  } catch (error) {
    errorHandler.mapError(error, 500, "Internal Server Error", next);
  }
};
