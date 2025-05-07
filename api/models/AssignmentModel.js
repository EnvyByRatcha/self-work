const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const { WORKFLOW_STATUS, PART_USAGE_STATUS } = require("../utils/enum");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    customerCode: { type: String, required: true },
    technicianId: { type: ObjectId, ref: "Technician" },
    userId: { type: ObjectId, ref: "User" },
    solution: { type: String, required: true },
    addressRemark: { type: String, required: true },
    cost: { type: Number, required: true },
    status: {
      type: String,
      enum: WORKFLOW_STATUS,
      default: "pending",
    },
  },
  { timestamps: true }
);

const assignmentDetailSchema = new mongoose.Schema(
  {
    assignmentId: { type: ObjectId, ref: "Assignment", required: true },
    sparePartId: { type: ObjectId, ref: "SpareParts", required: true },
    qty: { type: Number, required: true },
    cost: { type: Number, required: true },
    status: {
      type: String,
      enum: PART_USAGE_STATUS,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
const AssignmentDetail = mongoose.model(
  "AssignmentDetail",
  assignmentDetailSchema
);

module.exports = { Assignment, AssignmentDetail };
