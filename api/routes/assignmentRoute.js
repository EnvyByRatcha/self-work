const express = require("express");
const assignmentController = require("../controllers/assignmentController");
const auth = require("../middleware/auth");
const assignmentRouter = express.Router();
const {
  allowAll,
  allowAdminAndManager,
  allowTechnician,
} = require("../middleware/roleAccess");
const { aiCheckSparePart } = require("../middleware/aiCheck");

assignmentRouter.route("/").get(assignmentController.getAllAssignment);

assignmentRouter
  .route("/technician")
  .get(allowTechnician, assignmentController.getAllAssignmentByTechnicianId)
  .post(allowTechnician, assignmentController.createAssignmentByTechnician);
assignmentRouter
  .route("/technician/:id")
  .get(allowTechnician, assignmentController.getAssignmentByTechnicianId)
  .post(
    allowTechnician,
    assignmentController.createAssignmentDetail
  );

assignmentRouter
  .route("/approve/:id")
  .put(allowAdminAndManager, assignmentController.approveAssignment);

assignmentRouter
  .route("/:id")
  .get(allowAll, assignmentController.getAssignmentById);

module.exports = assignmentRouter;
