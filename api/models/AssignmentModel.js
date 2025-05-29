const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;
const { WORKFLOW_STATUS, PART_USAGE_STATUS } = require("../utils/enum");

const assignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    serialNumber: { type: String, required: true },
    customerCode: { type: String, required: true },
    technicianId: { type: ObjectId, ref: "Technician", require: true },
    userId: { type: ObjectId, ref: "User", default: null },
    solution: { type: String, required: true },
    addressRemark: { type: String, required: true },
    cost: { type: Number, default: 0 },
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
    sparePartId: { type: ObjectId, ref: "SparePart", required: true },
    sparePartBatchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SparePartBatch",
    },
    serialNumber: {
      type: String,
      default: null,
    },
    qty: { type: Number, default: 1 },
    cost: { type: Number, required: true },
  },
  { timestamps: true }
);

const Assignment = mongoose.model("Assignment", assignmentSchema);
const AssignmentDetail = mongoose.model(
  "AssignmentDetail",
  assignmentDetailSchema
);

module.exports = { Assignment, AssignmentDetail };
