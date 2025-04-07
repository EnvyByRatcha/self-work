const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    customerCode: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    tel_1: { type: String, required: true },
    tel_2: { type: String, default: null },
    email: { type: String, required: true },
    status: { type: String, required: true, default: "used" },
  },
  { timestamps: true }
);

const Customers = mongoose.model("Customers", customerSchema);

module.exports = Customers;
