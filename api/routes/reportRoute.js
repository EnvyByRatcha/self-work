const express = require("express");
const reportController = require("../controllers/reportController");
const { allowAll } = require("../middleware/roleAccess");

const reportRouter = express.Router();

reportRouter.route("/sumPerMonth").get(allowAll, reportController.sumperMonth);

module.exports = reportRouter;
