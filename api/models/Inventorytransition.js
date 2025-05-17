const mongoose = require("mongoose");

const inventoryTransitionSchema = new mongoose.Schema(
  {
    transitionType: {
      type: String,
      enum: [
        "stock-in",
        "stock-out",
        "rented-out",
        "returned",
        "issued",
        "technician-issued",
        "consumed",
      ],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: "Technician" },
    cost: { type: Number },
    status: { type: String, default: "pending" },
    note: { type: String },
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
