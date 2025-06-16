const GENERAL_STATUS = [
  "active",
  "inactive",
  "issued",
  "reserved",
  "used",
  "technician-issued",
  "onsite",
  "pending_approval",
];
const TRANSITION_TYPES = ["stock-in", "stock-out"];
const WORKFLOW_STATUS = [
  "pending",
  "in_progress",
  "completed",
  "cancelled",
  "pending_approval",
  "approved",
];
const PART_USAGE_STATUS = ["pending", "used", "returned"];

const USER_LEVEL = ["admin", "user", "manager"];
const TECHNICIAN_LEVEL = ["technician", "lead-technician"];

module.exports = {
  GENERAL_STATUS,
  TRANSITION_TYPES,
  WORKFLOW_STATUS,
  PART_USAGE_STATUS,
  USER_LEVEL,
  TECHNICIAN_LEVEL,
};
