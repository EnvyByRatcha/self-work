const mongoose = require("mongoose");

const sparePartSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    price: { type: Number, required: true },
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

const SpareParts = mongoose.model("SpareParts", sparePartSchema);

module.exports = SpareParts;
