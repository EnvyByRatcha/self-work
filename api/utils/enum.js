const GENERAL_STATUS = ["active", "inactive", "issued"];
const TRANSITION_TYPES = ["stock-in", "stock-out"];
const WORKFLOW_STATUS = ["pending", "in_progress", "completed", "cancelled"];
const PART_USAGE_STATUS = ["pending", "used", "returned"];

module.exports = {
  GENERAL_STATUS,
  TRANSITION_TYPES,
  WORKFLOW_STATUS,
  PART_USAGE_STATUS,
};
