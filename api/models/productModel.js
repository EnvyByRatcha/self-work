const mongoose = require("mongoose");
const { GENERAL_STATUS } = require("../utils/enum");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: {
      type: String,
      enum: GENERAL_STATUS,
      default: "active",
    },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    qty: { type: Number, default: 0 },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    photoUrl: { type: String, required: true },
    status: {
      type: String,
      enum: GENERAL_STATUS,
      default: "active",
    },
  },
  { timestamps: true }
);

const productBatchSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    qty: { type: Number, default: 0 },
    registered: { type: Number, default: 0 },
    status: {
      type: String,
      enum: GENERAL_STATUS,
      default: "active",
    },
  },
  { timestamps: true }
);

const productUnitSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, unique: true, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductBatch",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
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

const Category = mongoose.model("Category", categorySchema);

const Product = mongoose.model("Product", productSchema);
const ProductBatch = mongoose.model("ProductBatch", productBatchSchema);
const ProductUnit = mongoose.model("ProductUnit", productUnitSchema);

module.exports = { Category, Product, ProductBatch, ProductUnit };
