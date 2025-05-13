const mongoose = require("mongoose");
const { GENERAL_STATUS } = require("../utils/enum");

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    customerCode: { type: String, unique: true, required: true },
    address: { type: String, required: true },
    tel_1: { type: String, required: true },
    tel_2: { type: String, default: null },
    email: { type: String, required: true },
    status: {
      type: String,
      enum: GENERAL_STATUS,
      default: "active",
    },
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
