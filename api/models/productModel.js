const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, default: 0 },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      default: null,
    },
    photoUrl: { type: String, require: true },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const productBashSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
      required: true,
    },
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const productUnitSchema = new mongoose.Schema(
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

const Categories = mongoose.model("Categories", categorySchema);

const Products = mongoose.model("Products", productSchema);
const ProductBash = mongoose.model("ProductBash", productBashSchema);
const ProductUnits = mongoose.model("ProductUnits", productUnitSchema);

module.exports = { Products, ProductBash, ProductUnits, Categories };
