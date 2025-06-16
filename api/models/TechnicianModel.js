const mongoose = require("mongoose");
const { GENERAL_STATUS } = require("../utils/enum");

const TechnicianSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    address: { type: String },
    tel_1: { type: String },
    customerId: { type: mongoose.Schema.ObjectId, ref: "Customer" },
    level: { type: String, default: "technician" },
    status: {
      type: String,
      enum: GENERAL_STATUS,
      default: "active",
    },
  },
  { timestamps: true }
);

const Technician = mongoose.model("Technician", TechnicianSchema);

module.exports = Technician;
