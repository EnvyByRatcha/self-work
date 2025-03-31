const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
      default: null,
    },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const productDetailSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, required: true, unique: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products",
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

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const Products = mongoose.model("Products", productSchema);
const ProductDetails = mongoose.model("ProductDetails", productDetailSchema);
const Categories = mongoose.model("Categories", categorySchema);

module.exports = { Products, ProductDetails, Categories };
