const mongoose = require("mongoose");

const inventoryTransitionSchema = new mongoose.Schema(
  {
    transitionType: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
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
      ref: "InventoryTransitions",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
    },
    sparePartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpareParts",
    },
    cost: { type: Number, required: true },
    qty: { type: Number, default: 1 },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const InventoryTransitions = mongoose.model(
  "InventoryTransitions",
  inventoryTransitionSchema
);
const InventoryTransitionDetail = mongoose.model(
  "InventoryTransitionDetail",
  inventoryTransitionDetail
);

module.exports = {
  InventoryTransitions,
  InventoryTransitionDetail,
};
