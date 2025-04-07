const mongoose = require("mongoose");

const TechnicianSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    contact: { type: String, required: true },
    customerId: { type: mongoose.Schema.ObjectId, ref: "Customers" },
    level: { type: String, default: "employee" },
    status: { type: String, default: "used" },
  },
  { timestamps: true }
);

const Technicians = mongoose.model("Technicians", TechnicianSchema);

module.exports = Technicians;
