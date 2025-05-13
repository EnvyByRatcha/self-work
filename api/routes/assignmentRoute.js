const express = require("express");
const assignmentController = require("../controllers/assignmentController");
const auth = require("../middleware/auth");
const assignmentRouter = express.Router();

assignmentRouter.route("/").get(assignmentController.getAllAssignment);
assignmentRouter
  .route("/technician")
  .get(auth.verifyToken, assignmentController.getAllAssignment);

module.exports = assignmentRouter;
