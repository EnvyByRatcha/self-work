const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    customerCode: { String, required: true },
    technicianId: { type: ObjectId, ref: "Technicians" },
    solution: { type: String, required: true },
    cost: { type: Number, required: true },
    status: { type: String, default: "pending" },
  },
  { timestamps: true }
);

const assignmentDetailSchema = new mongoose.Schema(
  {
    assignmentId: { type: ObjectId, ref: "Assignments", required: true },
    sparePartId: { type: ObjectId, ref: "SpareParts", required: true },
    status: { type: String, default: "pending" },
    qty: { type: Number, required: true },
    cost: { type: Number, required: true },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignments", assignmentSchema);
const AssignmentDetail = mongoose.model(
  "AssignmentDetail",
  assignmentDetailSchema
);

module.exports = { Assignment, AssignmentDetail };
