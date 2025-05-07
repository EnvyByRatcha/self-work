const express = require("express");
const assignmentController = require("../controllers/assignmentController");

const assignmentRouter = express.Router();

assignmentRouter.route("/").get(assignmentController.getAllAssignment);

module.exports = assignmentRouter;
