const mongoose = require("mongoose");
const { GENERAL_STATUS } = require("../utils/enum");

const sparePartSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, default: 0 },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    photoUrl: { type: String, require: true },
    status: {
      type: String,
      enum: GENERAL_STATUS,
      default: "active",
    },
  },
  { timestamps: true }
);

const sparePartBatchSchema = new mongoose.Schema(
  {
    sparePartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SparePart",
      required: true,
    },
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    status: {
      type: String,
      enum: GENERAL_STATUS,
      default: "active",
    },
  },
  { timestamps: true }
);

const sparePartUnitSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, unique: true, required: true },
    sparePartBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SparePartBatch",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: GENERAL_STATUS,
      default: "active",
    },
  },
  { timestamps: true }
);

const SparePart = mongoose.model("SparePart", sparePartSchema);
const SparePartBatch = mongoose.model("SparePartBatch", sparePartBatchSchema);
const SpartPartUnit = mongoose.model("SparePartUnit", sparePartUnitSchema);

module.exports = { SparePart, SparePartBatch, SpartPartUnit };
