const express = require("express");
const sparePartController = require("../controllers/sparePartController");
const {
  allowAll,
  allowAdminAndManager,
  allowAdmin,
} = require("../middleware/roleAccess");

const sparePartRouter = express.Router();

sparePartRouter
  .route("/")
  .get(allowAll, sparePartController.getAllSpareParts)
  .post(allowAdmin, sparePartController.createSparePart);
sparePartRouter
  .route("/:id")
  .get(allowAll, sparePartController.getSparePartById)
  .delete(allowAdmin, sparePartController.deactivateSparePart)
  .put(allowAdminAndManager, sparePartController.updateSparePart);

sparePartRouter
  .route("/sn/:serialNumber")
  .get(allowAll, sparePartController.getSparePartByProductSerialNumber);

module.exports = sparePartRouter;
