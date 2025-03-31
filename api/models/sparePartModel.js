const mongoose = require("mongoose");

const sparePartSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    cost: { type: mongoose.Types.Decimal128, require: true },
    price: { type: mongoose.Types.Decimal128, require: true },
    qty: { type: Number, default: 0 },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      require: true,
    },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const SpareParts = mongoose.model("SpareParts", sparePartSchema);


module.exports = { SpareParts };
