const mongoose = require("mongoose");

const inventoryTransitionSchema = new mongoose.Schema(
  {
    transitionType: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cost: { type: Number },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const inventoryTransitionDetail = new mongoose.Schema(
  {
    transitionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryTransition",
      required: true,
    },
    productBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductBatch",
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    sparePartBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SparePartBatch",
    },
    sparePartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SparePart",
    },
    cost: { type: Number, default: 0 },
    qty: { type: Number, default: 1 },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const InventoryTransition = mongoose.model(
  "InventoryTransition",
  inventoryTransitionSchema
);
const InventoryTransitionDetail = mongoose.model(
  "InventoryTransitionDetail",
  inventoryTransitionDetail
);

module.exports = {
  InventoryTransition,
  InventoryTransitionDetail,
};
