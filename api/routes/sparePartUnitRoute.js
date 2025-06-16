const express = require("express");
const sparePartUnitController = require("../controllers/sparePartUnitController");
const {
  allowAll,
  allowAdminAndManager,
  allowTechnician,
} = require("../middleware/roleAccess");

const sparePartUnitRouter = express.Router();

sparePartUnitRouter
  .route("/")
  .post(allowAdminAndManager, sparePartUnitController.createSparePartUnit);

sparePartUnitRouter
  .route("/sparePart/:id")
  .get(allowAll, sparePartUnitController.getSparePartUnitBySparePartId);

sparePartUnitRouter
  .route("/technician")
  .get(allowTechnician, sparePartUnitController.getSparePartByTechnicianId);

module.exports = sparePartUnitRouter;
