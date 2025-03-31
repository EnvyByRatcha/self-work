const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    customerCode: { type: String, require: true },
    address: { type: String, require: true },
    tel_1: { type: String, require: true },
    tel_2: { type: String },
    email: { type: String, require: true },
    status: { type: String, require: true, default: "used" },
  },
  { timestamps: true }
);

const Customers = mongoose.model("Customers", customerSchema);

module.exports = Customers;
