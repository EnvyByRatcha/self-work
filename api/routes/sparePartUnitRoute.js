const express = require("express");
const sparePartUnitController = require("../controllers/sparePartUnitController");
const auth = require("../middleware/auth");

const sparePartUnitRouter = express.Router();

sparePartUnitRouter
  .route("/")
  .post(sparePartUnitController.createSpartPartUnit);

sparePartUnitRouter
  .route("/technician")
  .get(auth.verifyToken, sparePartUnitController.getSparePartByTechnicianId);

module.exports = sparePartUnitRouter;
