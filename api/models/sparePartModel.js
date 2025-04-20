const mongoose = require("mongoose");

const sparePartSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, default: 0 },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    photoUrl: { type: String, require: true },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const sparePartBashSchema = new mongoose.Schema(
  {
    sparePartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SpareParts",
      required: true,
    },
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const sparePartUnitSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, unique: true, required: true },
    producBashtId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductBash",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customers",
      default: null,
    },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const SpareParts = mongoose.model("SpareParts", sparePartSchema);
const SparePartBash = mongoose.model("SparePartBashes", sparePartBashSchema);
const SpartPartUnit = mongoose.model("SparePartUnit", sparePartUnitSchema);

module.exports = { SpareParts, SparePartBash, SpartPartUnit };
